import { motion } from 'framer-motion'
import { Eye, Sparkles } from 'lucide-react'
import { FC } from 'react'

const Header: FC = () => {
  return (
    <header className="text-center mb-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg"
      >
        <Eye className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.h1 
        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-300 bg-clip-text text-transparent mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        FaceTracker Pro
      </motion.h1>
      
      <motion.div 
        className="flex items-center justify-center gap-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
          Enterprise Grade
        </span>
      </motion.div>
      
      <motion.p 
        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Advanced real-time face tracking with professional video recording capabilities.
        Built with cutting-edge technology for precision and performance.
      </motion.p>
    </header>
  )
}

export default Header