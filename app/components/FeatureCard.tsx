import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { FC } from 'react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureCard: FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      className="group p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mb-4 group-hover:from-indigo-500 group-hover:to-purple-600 transition-all duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

export default FeatureCard