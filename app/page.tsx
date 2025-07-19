'use client'

import { motion } from 'framer-motion'
import { Camera, Monitor, Shield, Smartphone, Video, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import FaceTracker from './components/FaceTracker'
import FeatureCard from './components/FeatureCard'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const features = [
    {
      icon: Camera,
      title: 'Real-time Tracking',
      description: 'Advanced face detection with sub-pixel accuracy using cutting-edge algorithms'
    },
    {
      icon: Video,
      title: 'HD Recording',
      description: 'Record high-quality videos with embedded face tracking overlays'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance with 60fps tracking and minimal latency'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens locally - your data never leaves your device'
    },
    {
      icon: Monitor,
      title: 'Desktop Ready',
      description: 'Full-featured desktop experience with professional-grade tools'
    },
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Responsive design that works seamlessly on all mobile devices'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Header />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <FaceTracker />
        </motion.div>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  )
}