// Paystack integration service
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_9afe0ff4d8f81a67b5e799bd12a30551da1b0e19'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://ec2-34-206-167-168.compute-1.amazonaws.com:8000'

class PaystackService {
  constructor() {
    this.publicKey = PAYSTACK_PUBLIC_KEY
    this.apiBaseUrl = API_BASE_URL
  }

  // Initialize payment with backend
  async initializePayment(paymentData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/payments/initialize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gateway: 'paystack',
          payment_type: 'student_registration',
          amount: paymentData.amount,
          currency: paymentData.currency,
          user_data: paymentData.userData,
          payment_method: paymentData.paymentMethod || 'card'
        })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Payment initialization failed')
      }

      return result
    } catch (error) {
      console.error('Paystack initialization error:', error)
      throw error
    }
  }

  // Verify payment with backend
  async verifyPayment(reference) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/payments/verify/${reference}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error?.message || 'Payment verification failed')
      }

      return result
    } catch (error) {
      console.error('Paystack verification error:', error)
      throw error
    }
  }

  // Load Paystack script dynamically
  loadPaystackScript() {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve(window.PaystackPop)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => resolve(window.PaystackPop)
      script.onerror = () => reject(new Error('Failed to load Paystack script'))
      document.head.appendChild(script)
    })
  }

  // Open Paystack payment modal
  async openPaymentModal(paymentData) {
    try {
      const PaystackPop = await this.loadPaystackScript()
      
      const handler = PaystackPop.setup({
        key: this.publicKey,
        email: paymentData.email,
        amount: paymentData.amount * 100, // Paystack expects amount in kobo
        currency: paymentData.currency,
        ref: paymentData.reference,
        metadata: {
          custom_fields: [
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: paymentData.fullName
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: paymentData.phone
            }
          ]
        },
        callback: (response) => {
          console.log('Payment successful:', response)
          return response
        },
        onClose: () => {
          console.log('Payment modal closed')
        }
      })

      handler.openIframe()
      return handler
    } catch (error) {
      console.error('Paystack modal error:', error)
      throw error
    }
  }

  // Process payment with backend integration
  async processPayment(paymentData) {
    try {
      // Step 1: Initialize payment with backend
      const initResult = await this.initializePayment(paymentData)
      
      if (!initResult.success) {
        throw new Error(initResult.error?.message || 'Payment initialization failed')
      }

      // Step 2: Open Paystack modal with backend data
      const paymentModalData = {
        email: paymentData.userData.email,
        amount: paymentData.amount,
        currency: paymentData.currency,
        reference: initResult.data.reference,
        fullName: paymentData.userData.full_name,
        phone: paymentData.userData.phone_number
      }

      const handler = await this.openPaymentModal(paymentModalData)
      
      return {
        success: true,
        reference: initResult.data.reference,
        paymentUrl: initResult.data.payment_url,
        handler: handler
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      throw error
    }
  }

  // Verify payment after successful transaction
  async verifyPaymentStatus(reference) {
    try {
      const result = await this.verifyPayment(reference)
      
      if (result.success && result.data.payment.status === 'completed') {
        return {
          success: true,
          payment: result.data.payment,
          message: result.data.message
        }
      } else {
        return {
          success: false,
          message: 'Payment verification failed'
        }
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      return {
        success: false,
        message: error.message || 'Payment verification failed'
      }
    }
  }
}

// Create singleton instance
const paystackService = new PaystackService()

export default paystackService
