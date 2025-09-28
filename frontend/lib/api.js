"use client"

// IMPORTANT: Ensure this URL points to your running backend API.
// Production backend URL for deployed application
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://ec2-13-50-116-201.eu-north-1.compute.amazonaws.com:8000";
console.log('🚀 Frontend connecting to backend at:', API_BASE_URL);
console.log('🌐 Environment:', process.env.NODE_ENV);

// Nigerian Bank and Payment Configuration - LIVE CREDENTIALS
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19';
const FLUTTERWAVE_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY;
const VIDEO_STREAMING_URL = process.env.NEXT_PUBLIC_VIDEO_STREAMING_URL || `${API_BASE_URL}/media/videos`;

// Helper function to handle API responses
async function handleResponse(response) {
  const contentType = response.headers.get("content-type")
  let data = {}
  
  try {
    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }
    
    console.log("Response data:", data)
    console.log("Response status:", response.status)
    
  } catch (error) {
    console.error("Error parsing response:", error)
    // Return a safe default response
    return {
      success: false,
      error: {
        message: "Invalid response format from server",
        status: response.status,
        details: "Server returned invalid JSON or text"
      }
    }
  }

  if (!response.ok) {
    let errorMessage = "An unexpected error occurred."
    let isRateLimited = false
    let isLocked = false
    let requires2FA = false
    let requiresEmailVerification = false

    if (response.status === 429) {
      isRateLimited = true
      errorMessage = data.detail || "Too many requests. Please try again later."
    } else if (response.status === 423) {
      isLocked = true
      errorMessage = data.detail || "Account is temporarily locked due to multiple failed login attempts."
    } else if (response.status === 400 && data.requires_2fa) {
      requires2FA = true
      errorMessage = data.detail || "2FA token or backup code required."
    } else if (response.status === 400 && data.detail && data.detail.includes("verify your email")) {
      requiresEmailVerification = true
      errorMessage = data.detail
    } else if (data.detail) {
      errorMessage = data.detail
    } else if (typeof data === "string") {
      errorMessage = data
    } else if (data.errors && Object.keys(data.errors).length > 0) {
      errorMessage = Object.values(data.errors).flat().join(" ")
    }

    return {
      success: false,
      error: {
        message: errorMessage,
        detail: data.detail,
        errors: data.errors, // Preserve the detailed errors structure
        status: response.status,
        isRateLimited,
        isLocked,
        requires2FA,
        requiresEmailVerification,
      },
      requires2FA,
      requiresEmailVerification,
    }
  }
  
  // Store tokens if they exist in the response (for login and refresh)
  console.log("Storing tokens from response:", { access_token: data.access_token, token: data.token, refresh_token: data.refresh_token })
  
  if (data.access_token) {
    localStorage.setItem("access_token", data.access_token)
    console.log("Stored access_token")
  }
  if (data.token) {
    localStorage.setItem("access_token", data.token)  // Store as access_token for consistency
    console.log("Stored token as access_token")
  }
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token)
    console.log("Stored refresh_token")
  }
  
  // Store user data if provided in login response
  if (data.user) {
    localStorage.setItem("user_data", JSON.stringify(data.user))
    console.log("Stored user data")
  }
  
  return { success: true, data }
}

// Generic API request function with token handling and automatic refresh
export async function apiRequest(url, options = {}) {
  console.log("=== apiRequest function START ===")
  console.log("URL:", url)
  console.log("Options:", options)
  
  const token = localStorage.getItem("access_token")
  console.log("API Request - Token from localStorage:", token ? "EXISTS" : "MISSING")
  
  // Skip auth header for login/register requests
  const skipAuth = options.skipAuth || url.includes('/auth/login') || url.includes('/auth/register')
  
  const headers = {
    ...options.headers,
    ...(token && !skipAuth && { Authorization: `Bearer ${token}` }),
  }
  
  console.log("API Request - Final headers:", headers)

  // If body is JSON, set Content-Type
  if (options.body && !(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json"
  }

  try {
    console.log('Making API request to:', `${API_BASE_URL}${url}`)
    console.log('API_BASE_URL:', API_BASE_URL)
    console.log('URL:', url)
    console.log('Options:', options)
    console.log('Headers:', headers)
    
    // Check if URL is already a full URL (starts with http)
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // If token is expired (401), try to refresh it
    if (response.status === 401 && token && !skipAuth) {
      const refreshResult = await refreshToken()
      if (refreshResult.success) {
        // Retry the original request with new token
        const newToken = localStorage.getItem("access_token")
        const newHeaders = {
          ...options.headers,
          ...(newToken && !skipAuth && { Authorization: `Bearer ${newToken}` }),
        }
        
        if (options.body && !(options.body instanceof FormData) && !newHeaders["Content-Type"]) {
          newHeaders["Content-Type"] = "application/json"
        }

        const retryResponse = await fetch(fullUrl, {
          ...options,
          headers: newHeaders,
        });
        
        return handleResponse(retryResponse)
      } else {
        // Refresh failed, clear tokens and return error
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("user_data")
        return { 
          success: false, 
          error: { 
            message: "Session expired. Please login again.",
            status: 401,
            requiresReauth: true
          } 
        }
      }
    }

    return handleResponse(response)
  } catch (error) {
    console.error("Network or unexpected error:", error)
    return { success: false, error: { message: "Network error or unexpected issue." } }
  }
}

// --- AUTHENTICATION ENDPOINTS ---

// 1. User Registration
export async function register({ email, fullName, phoneNumber, role, password, confirmPassword, paymentReference, paymentData }) {
  return apiRequest(`/api/auth/register/`, {
    method: "POST",
    skipAuth: true, // Don't send existing token for registration
    body: JSON.stringify({
      email,
      full_name: fullName,
      phone_number: phoneNumber,
      role,
      password,
      confirm_password: confirmPassword,
      payment_reference: paymentReference,
      payment_data: paymentData,
    }),
  })
}

// 2. User Login
export async function login({ email, password, twoFactorToken = "", backupCode = "" }) {
  const payload = { email, password }
  
  if (twoFactorToken) {
    payload.two_factor_token = twoFactorToken
  }
  if (backupCode) {
    payload.backup_code = backupCode
  }
  
  return apiRequest(`/api/auth/login/`, {
    method: "POST",
    skipAuth: true, // Don't send existing token for login
    body: JSON.stringify(payload),
  })
}

// 3. Instructor Login
export async function instructorLogin({ email, password }) {
  return apiRequest(`/api/auth/instructor/login/`, {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  })
}

// 4. Logout
export async function logout() {
  try {
    // Try to call backend logout (optional)
    const refreshToken = localStorage.getItem("refresh_token")
    if (refreshToken) {
      await apiRequest(`/api/auth/logout/`, {
        method: "POST",
        skipAuth: true, // Don't send access token for logout
        body: JSON.stringify({ refresh_token: refreshToken }),
      })
    }
  } catch (error) {
    // Ignore backend logout errors - always clear local tokens
    console.log("Backend logout failed, but proceeding with local logout")
  }
  
  // Always clear local tokens regardless of backend response
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_data")
  
  return { success: true, message: "Logged out successfully" }
}

// 5. Get User Profile
export async function getUserProfile() {
  return apiRequest(`/api/auth/profile/`, { method: "GET" })
}

// 6. Update User Profile
export async function updateUserProfile(updates) {
  return apiRequest(`/api/auth/profile/update/`, {
    method: "PUT",
    body: JSON.stringify(updates),
  })
}

// 7. Get Instructors
export async function getInstructors() {
  return apiRequest(`/api/auth/instructors/`, { method: "GET" })
}

// --- COURSE API ENDPOINTS ---

// Course Discovery (Public)
export async function listAllCourses(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return apiRequest(`/api/courses/${queryString ? `?${queryString}` : ""}`, { method: "GET" })
}

export async function getCourseDetailsPublic(courseId) {
  return apiRequest(`/api/courses/${courseId}/`, { method: "GET" })
}

export async function getFeaturedCourses() {
  return apiRequest(`/api/courses/featured/`, { method: "GET" })
}

export async function getCourseCategoriesPublic() {
  return apiRequest(`/api/courses/categories/`, { method: "GET" })
}

export async function searchCoursesPublic(query, params = {}) {
  const queryString = new URLSearchParams({ q: query, ...params }).toString()
  return apiRequest(`/api/courses/search/?${queryString}`, { method: "GET" })
}

export async function getCourseRecommendations() {
  return apiRequest(`/api/courses/recommendations/`, { method: "GET" })
}

// Course Enrollment & Payment (Authenticated)
export async function enrollInCourse(courseId, paymentData = {}) {
  return apiRequest(`/api/courses/${courseId}/enroll/`, {
    method: "POST",
    body: JSON.stringify(paymentData),
  })
}

export async function verifyPayment(reference) {
  return apiRequest(`/api/courses/verify-payment/`, {
    method: "POST",
    body: JSON.stringify({ reference }),
  })
}

export async function checkPaymentStatus(reference) {
  return apiRequest(`/api/courses/payment-status/${reference}/`, { method: "GET" })
}

// Course Content Access (Authenticated)
export async function getCourseContentStructure(courseId) {
  return apiRequest(`/api/courses/${courseId}/content/`, { method: "GET" })
}

export async function getLessonDetails(courseId, sectionId, lessonId) {
  return apiRequest(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/`, {
    method: "GET",
  })
}

export async function updateLessonProgress(courseId, sectionId, lessonId, progressData) {
  return apiRequest(`/api/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/progress/`, {
    method: "PUT",
    body: JSON.stringify(progressData),
  })
}

export async function manageLessonBookmarks(lessonId, method, bookmarkData = {}) {
  const url = `/api/courses/lessons/${lessonId}/bookmarks/`
  const options = { method }
  if (method === "POST") {
    options.body = JSON.stringify(bookmarkData)
  } else if (method === "DELETE") {
    options.body = JSON.stringify(bookmarkData) // Expects { index: 0 }
  }
  return apiRequest(url, options)
}

export async function manageLessonNotes(lessonId, method, notesData = {}) {
  const url = `/api/courses/lessons/${lessonId}/notes/`
  const options = { method }
  if (method === "PUT") {
    options.body = JSON.stringify(notesData)
  }
  return apiRequest(url, options)
}

// Progress Tracking (Authenticated)
export async function getMyCourses(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return apiRequest(`/api/courses/my-courses/${queryString ? `?${queryString}` : ""}`, { method: "GET" })
}

export async function getCourseProgress(courseId) {
  return apiRequest(`/api/courses/${courseId}/progress/`, { method: "GET" })
}

export async function updateCourseProgress(courseId, progressData) {
  return apiRequest(`/api/courses/${courseId}/progress/`, {
    method: "PUT",
    body: JSON.stringify(progressData),
  })
}

export async function getMyOverallProgress() {
  return apiRequest(`/api/courses/progress/`, { method: "GET" })
}

// Reviews & Feedback (Authenticated)
export async function getCourseReviews(courseId, params = {}) {
  const queryString = new URLSearchParams(params).toString()
  return apiRequest(`/api/courses/${courseId}/reviews/${queryString ? `?${queryString}` : ""}`, {
    method: "GET",
  })
}

export async function addCourseReview(courseId, reviewData) {
  return apiRequest(`/api/courses/${courseId}/reviews/`, {
    method: "POST",
    body: JSON.stringify(reviewData),
  })
}

// Exams & Assessments (Authenticated)
export async function getCourseExams(courseId) {
  return apiRequest(`/api/courses/${courseId}/exams/`, { method: "GET" })
}

export async function startExam(examId) {
  return apiRequest(`/api/courses/exams/${examId}/start/`, { method: "POST" })
}

export async function getExamQuestions(attemptId) {
  return apiRequest(`/api/courses/exam-attempts/${attemptId}/questions/`, { method: "GET" })
}

export async function submitExamAnswer(attemptId, questionId, answerData) {
  return apiRequest(`/api/courses/exam-attempts/${attemptId}/submit-answer/`, {
    method: "POST",
    body: JSON.stringify({ question_id: questionId, answer_data: answerData }),
  })
}

export async function completeExam(attemptId) {
  return apiRequest(`/api/courses/exam-attempts/${attemptId}/complete/`, { method: "POST" })
}

export async function getExamResults(attemptId) {
  return apiRequest(`/api/courses/exam-attempts/${attemptId}/results/`, { method: "GET" })
}

// User Dashboard (Authenticated)
export async function getUserDashboard() {
  return apiRequest(`/api/courses/dashboard/`, { method: "GET" })
}

export async function getStudentAnalytics() {
  return apiRequest(`/api/courses/student/analytics/`, { method: "GET" })
}

// --- PAYMENT API ENDPOINTS ---
export const paymentAPI = {
  // Initialize payment for a course or student registration
  initializePayment: async (courseId, gateway = 'paystack', paymentType = 'course_enrollment', userData = null, amount = null, currency = 'NGN') => {
    const payload = { 
      gateway,
      payment_type: paymentType
    }
    
    if (paymentType === 'course_enrollment') {
      payload.course_id = courseId
      if (amount) {
        payload.amount = amount
        payload.currency = currency
      }
    } else if (paymentType === 'student_registration' && userData) {
      payload.email = userData.email
      payload.full_name = userData.full_name
      payload.phone_number = userData.phone_number
      payload.amount = amount || 5000 // Student registration fee
      payload.currency = currency || 'NGN'
    }
    
    console.log('Initializing payment with payload:', payload)
    
    return apiRequest(`/api/payments/initialize/`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },

  // Verify payment status
  verifyPayment: async (paymentId) => {
    return apiRequest(`/api/payments/verify/${paymentId}/`, {
      method: "POST",
    })
  },

  // Get payment overview (admin)
  getPaymentOverview: async () => {
    return apiRequest(`/api/payments/overview/`, { method: "GET" })
  },

  // Test student registration payment
  testStudentRegistrationPayment: async () => {
    return apiRequest(`/api/payments/test-student-registration/`, {
      method: "POST",
    })
  },
}

// --- MESSAGING/CHAT API ENDPOINTS ---
export const chatAPI = {
  // Conversations
  getConversations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/messaging/conversations/${queryString ? `?${queryString}` : ""}`, { method: "GET" })
  },

  getConversation: async (conversationId) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/`, { method: "GET" })
  },

  createConversation: async (conversationData) => {
    return apiRequest(`/api/messaging/conversations/create/`, {
      method: "POST",
      body: JSON.stringify(conversationData),
    })
  },

  updateConversation: async (conversationId, updateData) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    })
  },

  deleteConversation: async (conversationId) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/`, {
      method: "DELETE",
    })
  },

  // Messages
  getMessages: async (conversationId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/messaging/conversations/${conversationId}/messages/${queryString ? `?${queryString}` : ""}`, { method: "GET" })
  },

  sendMessage: async (conversationId, messageData) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/send/`, {
      method: "POST",
      body: JSON.stringify(messageData),
    })
  },

  updateMessage: async (messageId, messageData) => {
    return apiRequest(`/api/messaging/messages/${messageId}/`, {
      method: "PUT",
      body: JSON.stringify(messageData),
    })
  },

  deleteMessage: async (messageId) => {
    return apiRequest(`/api/messaging/messages/${messageId}/`, {
      method: "DELETE",
    })
  },

  // Message actions
  markMessageRead: async (messageId) => {
    return apiRequest(`/api/messaging/messages/${messageId}/read/`, {
      method: "POST",
    })
  },

  markConversationRead: async (conversationId) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/read/`, {
      method: "POST",
    })
  },

  // User status
  getUserStatus: async () => {
    return apiRequest(`/api/messaging/user/status/`, { method: "GET" })
  },

  updateUserStatus: async (statusData) => {
    return apiRequest(`/api/messaging/user/status/`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    })
  },

  setTypingStatus: async (conversationId, isTyping) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/typing/`, {
      method: "POST",
      body: JSON.stringify({ is_typing: isTyping }),
    })
  },

  getOnlineUsers: async (conversationId) => {
    return apiRequest(`/api/messaging/conversations/${conversationId}/online-users/`, { method: "GET" })
  },

  // Conversation invitations
  getInvitations: async () => {
    return apiRequest(`/api/messaging/invitations/`, { method: "GET" })
  },

  createInvitation: async (invitationData) => {
    return apiRequest(`/api/messaging/invitations/`, {
      method: "POST",
      body: JSON.stringify(invitationData),
    })
  },

  acceptInvitation: async (invitationId) => {
    return apiRequest(`/api/messaging/invitations/${invitationId}/accept/`, {
      method: "POST",
    })
  },

  declineInvitation: async (invitationId) => {
    return apiRequest(`/api/messaging/invitations/${invitationId}/decline/`, {
      method: "POST",
    })
  },

  // Unread count
  getUnreadCount: async () => {
    return apiRequest(`/api/messaging/unread-count/`, { method: "GET" })
  },

  // Legacy endpoints (keeping for backward compatibility)
  getMessagesLegacy: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiRequest(`/api/messaging/messages/${queryString ? `?${queryString}` : ""}`, { method: "GET" })
  },

  sendMessageLegacy: async (messageData) => {
    return apiRequest(`/api/messaging/send/`, {
      method: "POST",
      body: JSON.stringify(messageData),
    })
  },
}

// --- NIGERIAN BANK API ENDPOINTS ---
export const nigerianBankAPI = {
  // Get Nigerian banks
  getBanks: async () => {
    return apiRequest(`/api/payments/banks/`, { method: "GET" })
  },
  
  // Verify bank account
  verifyBankAccount: async (accountNumber, bankCode) => {
    return apiRequest(`/api/payments/verify-account/`, {
      method: "POST",
      body: JSON.stringify({ account_number: accountNumber, bank_code: bankCode }),
    })
  },
  
  // Get payment channels
  getPaymentChannels: async () => {
    return apiRequest(`/api/payments/channels/`, { method: "GET" })
  },
  
  // Get USSD codes
  getUssdCodes: async () => {
    return apiRequest(`/api/payments/ussd-codes/`, { method: "GET" })
  },
  
  // Get mobile money providers
  getMobileMoneyProviders: async () => {
    return apiRequest(`/api/payments/mobile-money/`, { method: "GET" })
  },
  
  // Get transfer instructions
  getTransferInstructions: async (bankCode, amount) => {
    return apiRequest(`/api/payments/transfer-instructions/`, {
      method: "POST",
      body: JSON.stringify({ bank_code: bankCode, amount }),
    })
  },
}

// --- VIDEO STREAMING API ENDPOINTS ---
export const videoAPI = {
  // Get video stream URL
  getVideoStream: (videoId, quality = '720p') => {
    return `${VIDEO_STREAMING_URL}/${videoId}/${videoId}.m3u8`
  },
  
  // Get Cloudinary video URL (for uploaded videos)
  getCloudinaryVideo: (cloudinaryPublicId, quality = 'auto') => {
    if (!cloudinaryPublicId) return null
    // Transform Cloudinary URL for better quality and format
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvmse886w'}/video/upload/q_${quality},f_auto/${cloudinaryPublicId}`
  },

  // Get Cloudinary video thumbnail
  getCloudinaryThumbnail: (cloudinaryPublicId, width = 800, height = 450) => {
    if (!cloudinaryPublicId) return null
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvmse886w'}/video/upload/w_${width},h_${height},c_fill/${cloudinaryPublicId}`
  },
  
  // Get video manifest URL (DASH)
  getVideoManifest: (videoId) => {
    return `${VIDEO_STREAMING_URL}/${videoId}/${videoId}.mpd`
  },
  
  // Get video thumbnail
  getVideoThumbnail: (videoId) => {
    return `${VIDEO_STREAMING_URL}/${videoId}/${videoId}_thumb.jpg`
  },
  
  // Get video segments
  getVideoSegments: (videoId, segmentNumber) => {
    return `${VIDEO_STREAMING_URL}/${videoId}/${videoId}_${segmentNumber.toString().padStart(3, '0')}.ts`
  },
}

// --- PAYMENT GATEWAY CONFIGURATION ---
export const paymentConfig = {
  paystack: {
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    country: 'NG',
  },
  flutterwave: {
    publicKey: FLUTTERWAVE_PUBLIC_KEY,
    currency: 'NGN',
    country: 'NG',
  },
}

export default {
  // Authentication APIs
  login,
  register,
  logout,
  instructorLogin,
  getUserProfile,
  updateUserProfile,
  getInstructors,
  // Student APIs
  listAllCourses,
  getCourseDetailsPublic,
  getFeaturedCourses,
  getCourseCategoriesPublic,
  searchCoursesPublic,
  getCourseRecommendations,
  enrollInCourse,
  verifyPayment,
  checkPaymentStatus,
  getCourseContentStructure,
  getLessonDetails,
  updateLessonProgress,
  manageLessonBookmarks,
  manageLessonNotes,
  getMyCourses,
  getCourseProgress,
  updateCourseProgress,
  getMyOverallProgress,
  getCourseReviews,
  addCourseReview,
  getCourseExams,
  startExam,
  getExamQuestions,
  submitExamAnswer,
  completeExam,
  getExamResults,
  getUserDashboard,
  getStudentAnalytics,
  // Payment APIs
  paymentAPI,
  // Chat/Messaging APIs
  chatAPI,
  // Nigerian Bank APIs
  nigerianBankAPI,
  // Video Streaming APIs
  videoAPI,
  // Payment Configuration
  paymentConfig,
}
