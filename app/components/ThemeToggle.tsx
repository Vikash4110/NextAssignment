'use client'

import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { FC, useEffect, useState } from 'react'

const ThemeToggle: FC = () => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-white/20 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-800/70 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 360 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </motion.div>
    </motion.button>
  )
}

export default ThemeToggle