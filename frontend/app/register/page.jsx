"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Stethoscope, Eye, EyeOff, ArrowLeft, Loader2, User, Mail, Phone, Lock, CreditCard, CheckCircle } from "lucide-react"
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
    confirmPassword: "",
    paymentStatus: "",
    registrationCode: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate payment status
    if (formData.paymentStatus === "no") {
      setError("Payment is required to register. Please contact admin to make payment first.")
      setIsLoading(false)
      return
    }

    // Validate registration code if payment is yes
    if (formData.paymentStatus === "yes" && !formData.registrationCode.trim()) {
      setError("Registration code is required when payment is completed.")
      setIsLoading(false)
      return
    }

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
      // Register user with backend including payment verification
      const result = await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        payment_status: formData.paymentStatus,
        registration_code: formData.registrationCode
      })
      
      if (result.success) {
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(result.error || "Registration failed. Please check your registration code or try again.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
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
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Create Account
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Join thousands of successful NCLEX candidates
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
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

            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
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

              {/* Payment Status Selection */}
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Have you made payment?
                </Label>
                <Select 
                  value={formData.paymentStatus} 
                  onValueChange={(value) => setFormData({...formData, paymentStatus: value})}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="yes" className="text-gray-900 hover:bg-blue-50">Yes, I have paid</SelectItem>
                    <SelectItem value="no" className="text-gray-900 hover:bg-blue-50">No, I haven't paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Registration Code (only show if payment is yes) */}
              {formData.paymentStatus === "yes" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="registrationCode" className="text-gray-700 font-medium flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Registration Code
                  </Label>
                  <Input
                    id="registrationCode"
                    type="text"
                    placeholder="Enter your registration code"
                    value={formData.registrationCode}
                    onChange={(e) => setFormData({...formData, registrationCode: e.target.value})}
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <p className="text-sm text-gray-600">
                    Enter the unique code provided by admin after payment
                  </p>
                </motion.div>
              )}

              {/* Show message if no payment */}
              {formData.paymentStatus === "no" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                >
                  <p className="text-yellow-800 text-sm">
                    <strong>Payment Required:</strong> Please contact admin to make payment before registration. 
                    You can reach admin through WhatsApp by clicking "Enroll" on the Programs page.
                  </p>
                </motion.div>
              )}

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
                disabled={isLoading || formData.paymentStatus === "no"}
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