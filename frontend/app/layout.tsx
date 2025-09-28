import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NCLEX Keys International',
  description: 'Professional NCLEX preparation courses designed to help you pass your exam with confidence.',
  keywords: 'NCLEX, nursing, exam preparation, RN, registered nurse, nursing courses',
  authors: [{ name: 'NCLEX Keys International' }],
  openGraph: {
    title: 'NCLEX Keys International',
    description: 'Professional NCLEX preparation courses designed to help you pass your exam with confidence.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
