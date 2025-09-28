"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, Lock, CheckCircle, XCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const token = searchParams.get('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    // Validate passwords match
    if (formData.new_password !== formData.confirm_password) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          new_password: formData.new_password
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsSuccess(true)
        setMessage(data.message)
      } else {
        setError(data.error || 'Password reset failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-2xl">
            <CardContent className="px-8 py-8 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">
                Invalid Reset Link
              </h3>
              <p className="text-gray-600 mb-6">
                No reset token found. Please check your email for the correct reset link.
              </p>
              <Link 
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
              >
                Request New Reset Link
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
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
                <Lock className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {isSuccess ? 'Password Reset Successfully!' : 'Reset Password'}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {isSuccess 
                  ? 'Your password has been updated' 
                  : 'Enter your new password below'
                }
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  Password Reset Complete!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your password has been successfully updated. You can now log in with your new password.
                </p>
                
                <Button 
                  onClick={() => router.push('/login')}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue to Login
                </Button>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
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

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">
                        {message}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="new_password" className="text-gray-700 font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.new_password}
                      onChange={(e) => setFormData({...formData, new_password: e.target.value})}
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
                  <Label htmlFor="confirm_password" className="text-gray-700 font-medium flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({...formData, confirm_password: e.target.value})}
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
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <div className="text-center">
                  <Link 
                    href="/login" 
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
