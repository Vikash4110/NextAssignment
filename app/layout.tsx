import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FaceTracker Pro - Advanced Face Tracking & Recording',
  description: 'Professional face tracking application with real-time detection and video recording capabilities',
  keywords: ['face tracking', 'video recording', 'computer vision', 'real-time detection'],
  authors: [{ name: 'FaceTracker Pro Team' }],
}

// ✅ Move viewport to its own export
export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
