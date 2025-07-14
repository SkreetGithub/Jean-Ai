import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Jean AI Assistant",
  description: "Your intelligent AI companion for conversations and assistance",
  keywords: ["AI", "assistant", "chatbot", "voice", "Jean"],
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#181c23] text-white min-h-screen flex flex-col font-sans">
        <NavBar />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
