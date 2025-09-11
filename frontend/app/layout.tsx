import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext" // Import AuthProvider
import { Toaster } from "@/components/ui/toaster" // Assuming you have a Toaster component for toasts

export const metadata: Metadata = {
  title: {
    default: "Nclexkeys - Master Your Exam",
    template: "%s | Nclexkeys",
  },
  description:
    "Your trusted partner for Nclexkeys success. Providing expert virtual tutoring and comprehensive resources for aspiring nurses.",
  keywords: ["Nclexkeys", "nursing", "tutoring", "exam prep", "virtual school", "nursing school", "Nclexkeys-RN", "Nclexkeys-PN"],
  authors: [{ name: "Nclexkeys Team" }],
  creator: "Nclexkeys",
  publisher: "Nclexkeys",
  openGraph: {
    title: "Nclexkeys - Master Your Exam",
    description:
      "Your trusted partner for Nclexkeys success. Providing expert virtual tutoring and comprehensive resources for aspiring nurses.",
    url: "https://nclexintl.vercel.app", // Replace with your actual domain
    siteName: "Nclexkeys",
    images: [
      {
        url: "/placeholder.svg?height=630&width=1200", // Replace with a relevant image for social sharing
        width: 1200,
        height: 630,
        alt: "Nclexkeys Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nclexkeys - Master Your Exam",
    description:
      "Your trusted partner for Nclexkeys success. Providing expert virtual tutoring and comprehensive resources for aspiring nurses.",
    images: ["/placeholder.svg?height=675&width=1200"], // Replace with a relevant image for Twitter
    creator: "@Nclexkeys", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon.ico in your public folder
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
          <Toaster /> {/* Ensure Toaster is rendered for toast notifications */}
        </AuthProvider>
      </body>
    </html>
  )
}
