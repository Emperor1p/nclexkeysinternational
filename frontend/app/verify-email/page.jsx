"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail()
    }
  }, [token])

  const verifyEmail = async () => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsVerified(true)
        setMessage(data.message)
      } else {
        setError(data.error || 'Email verification failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/resend-verification/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: localStorage.getItem('userEmail') || '' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage('Verification email sent successfully!')
      } else {
        setError(data.error || 'Failed to resend verification email')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
                <Mail className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Email Verification
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {isVerified ? 'Email verified successfully!' : 'Verifying your email address...'}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-blue-200 bg-blue-50">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription className="text-blue-800">
                    Verifying your email address...
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {isVerified && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Email Verified Successfully!
                </h3>
                <p className="text-gray-600">
                  Your email has been verified. You can now access all features of your account.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {message && !error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <div className="space-y-4">
              {isVerified ? (
                <div className="space-y-4">
                  <Button 
                    onClick={() => router.push('/login')}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Continue to Login
                  </Button>
                  
                  <Button 
                    onClick={() => router.push('/dashboard')}
                    variant="outline"
                    className="w-full h-12 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {!token && (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        No verification token found. Please check your email for the verification link.
                      </p>
                      
                      <Button 
                        onClick={resendVerification}
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-5 w-5 mr-2" />
                            Resend Verification Email
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <Link 
                      href="/login" 
                      className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}