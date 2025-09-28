"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function PaymentSuccessPage() {
  const [paymentData, setPaymentData] = useState(null)
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Get payment and user data from localStorage
    const payment = localStorage.getItem('payment')
    const user = localStorage.getItem('user')
    
    if (payment) {
      setPaymentData(JSON.parse(payment))
    }
    if (user) {
      setUserData(JSON.parse(user))
    }
  }, [])

  const formatPrice = (price, currency) => {
    if (currency === "NGN") {
      return `${price.toLocaleString()} NGN`
    } else if (currency === "USD") {
      return `${price} US DOLLARS`
    } else if (currency === "GBP") {
      return `${price} POUNDS`
    }
    return `${price} ${currency}`
  }

  const handleDownloadReceipt = () => {
    // Generate receipt content
    const receiptContent = `
NCLEX KEYS INTERNATIONAL - PAYMENT RECEIPT
==========================================

Payment Date: ${new Date().toLocaleDateString()}
Payment Time: ${new Date().toLocaleTimeString()}

Customer Information:
- Name: ${userData?.firstName} ${userData?.lastName}
- Email: ${userData?.email}
- Phone: ${userData?.phone}

Program Details:
- Program: ${paymentData?.course?.region}
- Amount: ${formatPrice(paymentData?.amount, paymentData?.currency)}
- Status: ${paymentData?.status?.toUpperCase()}

Payment Method: Paystack
Transaction ID: ${Date.now()}

Thank you for choosing NCLEX Keys International!
Your journey to NCLEX success starts now.

Contact Information:
Email: nclexkeysintl.academy@gmail.com
Phone: +234 (0) 123 456 7890
Address: Ikorodu, Lagos, Nigeria

This is an automated receipt. Please keep this for your records.
    `.trim()

    // Create and download file
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nclex-keys-receipt-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
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
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Payment Successful!
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Welcome to NCLEX Keys International! Your journey to success begins now.
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8"
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-green-800">
                  Enrollment Confirmed
                </h3>
              </div>
              <p className="text-green-700">
                Your payment has been processed successfully. You are now enrolled in the {paymentData?.course?.region} program.
              </p>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-50 rounded-lg p-6 mb-8"
            >
              <h4 className="font-semibold text-lg text-gray-800 mb-4">Payment Details</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Program:</span>
                  <span className="font-medium">{paymentData?.course?.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(paymentData?.amount, paymentData?.currency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">Paystack</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {paymentData?.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8"
            >
              <h4 className="font-semibold text-lg text-blue-800 mb-4">What's Next?</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Welcome Email</p>
                    <p className="text-blue-700 text-sm">
                      You'll receive a welcome email with your login credentials and program details within 24 hours.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Program Access</p>
                    <p className="text-blue-700 text-sm">
                      Access to your exclusive WhatsApp and Telegram groups will be provided via email.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Study Schedule</p>
                    <p className="text-blue-700 text-sm">
                      Your personalized study plan and schedule will be shared within 48 hours.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <Button
                onClick={handleDownloadReceipt}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Receipt
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
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
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
