"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InstructorPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main login page
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Redirecting to Login...</h2>
        <p className="text-gray-600">Please use the main login page with instructor credentials.</p>
      </div>
    </div>
  )
}
