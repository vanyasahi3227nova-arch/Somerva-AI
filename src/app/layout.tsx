import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/navigation/Navbar'

export const metadata: Metadata = {
  title: 'Somerva AI — AI-guided somatic healing for chronic pain',
  description: 'Observe your movement. Refine your practice. Support your nervous system.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF6] text-[#2C2C28] antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="min-h-screen" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  )
}
