"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Stethoscope, Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, CreditCard, Shield, User, Mail, Phone, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

export default function RegisterPage() {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  })
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(1) // 1: Registration, 2: Course Selection, 3: Payment
  const router = useRouter()

  useEffect(() => {
    // Check if user came from programs page with selected course
    const course = localStorage.getItem('selectedCourse')
    if (course) {
      setSelectedCourse(JSON.parse(course))
      setStep(2) // Skip to course selection step
    }
  }, [])

  const formatPrice = (price, currency) => {
    if (currency === "NGN") {
      return `${price.toLocaleString()} NGN`
    } else if (currency === "USD") {
      return `$${price} USD`
    } else if (currency === "GBP") {
      return `£${price} GBP`
    }
    return `${price} ${currency}`
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      // Store user data temporarily
      localStorage.setItem('tempUserData', JSON.stringify({
        ...formData,
        registrationTime: new Date().toISOString()
      }))
      
      setStep(2)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseSelection = (course) => {
    setSelectedCourse(course)
    localStorage.setItem('selectedCourse', JSON.stringify(course))
    setStep(3)
  }

  const handlePayment = async () => {
    setIsLoading(true)
    setError("")
    
    try {
      // Import Paystack service
      const paystackService = (await import('@/lib/paystack')).default
      
      // Get user data
      const userData = JSON.parse(localStorage.getItem('tempUserData') || '{}')
      
      // Prepare payment data
      const paymentData = {
        amount: selectedCourse.price * 100, // Convert to kobo/cents
        currency: selectedCourse.currency,
        userData: {
          email: userData.email,
          full_name: `${userData.firstName} ${userData.lastName}`,
          phone_number: userData.phone,
          first_name: userData.firstName,
          last_name: userData.lastName
        },
        paymentMethod: 'card'
      }
      
      // Process payment with Paystack
      const result = await paystackService.processPayment(paymentData)
      
      if (result.success) {
        // Register user with backend after successful payment
        const registrationResult = await register({
          email: userData.email,
          password: userData.password,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          course: selectedCourse
        })
        
        if (registrationResult.success) {
          // Store payment info
          localStorage.setItem('payment', JSON.stringify({
            course: selectedCourse,
            amount: selectedCourse.price,
            currency: selectedCourse.currency,
            reference: result.reference,
            status: 'completed',
            paymentTime: new Date().toISOString()
          }))
          
          // Clear temporary data
          localStorage.removeItem('tempUserData')
          localStorage.removeItem('selectedCourse')
          
          // Redirect to success page
          router.push('/payment-success')
        } else {
          setError(registrationResult.error || "Registration failed. Please try again.")
        }
      } else {
        setError("Payment initialization failed. Please try again.")
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err.message || "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToPrograms = () => {
    localStorage.removeItem('selectedCourse')
    localStorage.removeItem('tempUserData')
    router.push('/programs')
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
        className="relative z-10 w-full max-w-2xl"
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
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {step === 1 ? "Create Account" : step === 2 ? "Select Program" : "Complete Payment"}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {step === 1 ? "Join thousands of successful NCLEX candidates" : 
                 step === 2 ? "Choose your preferred program" : 
                 "Secure payment with Paystack"}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step > stepNumber ? <CheckCircle className="h-5 w-5" /> : stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {/* Step 1: Registration Form */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleRegistration}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700 font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700 font-medium flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.form>
            )}

            {/* Step 2: Course Selection */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Choose Your Program
                  </h3>
                  <p className="text-gray-600">
                    Select the program that best fits your needs and location
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: "nigeria", region: "NIGERIA", price: 30000, currency: "NGN" },
                    { id: "african", region: "AFRICAN", price: 35000, currency: "NGN" },
                    { id: "usa-canada", region: "USA/CANADA", price: 60, currency: "USD" },
                    { id: "europe", region: "EUROPE", price: 35, currency: "GBP" }
                  ].map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                        selectedCourse?.id === course.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleCourseSelection(course)}
                    >
                      <div className="text-center">
                        <h4 className="font-semibold text-lg text-gray-800 mb-2">
                          {course.region}
                        </h4>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                          {formatPrice(course.price, course.currency)}
                        </p>
                        <p className="text-sm text-gray-600">PER MONTH</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!selectedCourse}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Complete Your Payment
                  </h3>
                  <p className="text-gray-600">
                    Secure payment powered by Paystack
                  </p>
                </div>

                {selectedCourse && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-lg text-gray-800 mb-4">
                      Selected Program
                    </h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{selectedCourse.region}</p>
                        <p className="text-sm text-gray-600">Monthly Subscription</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">
                          {formatPrice(selectedCourse.price, selectedCourse.currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">
                      Secure Payment with Paystack
                    </p>
                  </div>
                  <p className="text-green-700 text-sm mt-1">
                    Your payment information is encrypted and secure
                  </p>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay with Paystack
                    </>
                  )}
                </Button>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Programs
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBackToPrograms}
                    className="flex-1"
                  >
                    Change Program
                  </Button>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 mb-4">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">
                  Sign in here
                </Link>
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Link 
                  href="/programs" 
                  className="flex items-center text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Programs
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}