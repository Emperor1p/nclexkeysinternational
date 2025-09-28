"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function PaymentStatusPage() {
  const params = useParams()
  const router = useRouter()
  const [paymentStatus, setPaymentStatus] = useState('verifying')
  const [paymentData, setPaymentData] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.reference) {
      verifyPayment(params.reference)
    }
  }, [params.reference])

  const verifyPayment = async (reference) => {
    try {
      setIsLoading(true)
      
      // Import Paystack service
      const paystackService = (await import('@/lib/paystack')).default
      
      // Verify payment with backend
      const result = await paystackService.verifyPaymentStatus(reference)
      
      if (result.success) {
        setPaymentStatus('success')
        setPaymentData(result.payment)
        
        // Update localStorage with verified payment
        localStorage.setItem('payment', JSON.stringify({
          ...result.payment,
          verified: true,
          status: 'completed'
        }))
      } else {
        setPaymentStatus('failed')
        setError(result.message || 'Payment verification failed')
      }
    } catch (err) {
      console.error('Payment verification error:', err)
      setPaymentStatus('failed')
      setError(err.message || 'Payment verification failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'verifying':
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-600" />
      case 'failed':
        return <XCircle className="h-12 w-12 text-red-600" />
      default:
        return <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
    }
  }

  const getStatusTitle = () => {
    switch (paymentStatus) {
      case 'verifying':
        return 'Verifying Payment...'
      case 'success':
        return 'Payment Successful!'
      case 'failed':
        return 'Payment Failed'
      default:
        return 'Verifying Payment...'
    }
  }

  const getStatusDescription = () => {
    switch (paymentStatus) {
      case 'verifying':
        return 'Please wait while we verify your payment with Paystack.'
      case 'success':
        return 'Your payment has been successfully processed. Welcome to NCLEX Keys International!'
      case 'failed':
        return 'We encountered an issue processing your payment. Please try again or contact support.'
      default:
        return 'Please wait while we verify your payment.'
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
              {getStatusIcon()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {getStatusTitle()}
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                {getStatusDescription()}
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

            {paymentStatus === 'success' && paymentData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
              >
                <h4 className="font-semibold text-lg text-green-800 mb-4">Payment Details</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-700">Reference:</span>
                    <span className="font-medium text-green-800">{paymentData.reference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Amount:</span>
                    <span className="font-medium text-green-800">
                      {paymentData.currency === 'NGN' 
                        ? `₦${paymentData.amount.toLocaleString()}` 
                        : `${paymentData.currency} ${paymentData.amount}`
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Status:</span>
                    <span className="font-medium text-green-800 capitalize">{paymentData.status}</span>
                  </div>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {paymentStatus === 'success' ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => router.push('/payment-success')}
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Continue to Dashboard
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Link href="/programs">
                        View Programs
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 border-green-300 text-green-700 hover:bg-green-50"
                    >
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : paymentStatus === 'failed' ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => router.push('/register')}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Try Again
                  </Button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <Link href="/programs">
                        Back to Programs
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-12 border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Link href="/contact">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Please wait while we verify your payment...
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 mb-2">
                Need help? Contact us at{" "}
                <a href="mailto:nclexkeysintl.academy@gmail.com" className="text-blue-600 hover:underline">
                  nclexkeysintl.academy@gmail.com
                </a>
              </p>
              <p className="text-gray-500 text-sm">
                Ikorodu, Lagos, Nigeria
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
