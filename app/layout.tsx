import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FaceTracker Pro - Advanced Face Tracking & Recording',
  description: 'Professional face tracking application with real-time detection and video recording capabilities',
  keywords: ['face tracking', 'video recording', 'computer vision', 'real-time detection'],
  authors: [{ name: 'FaceTracker Pro Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}