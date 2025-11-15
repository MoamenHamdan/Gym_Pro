'use client'

import { motion } from 'framer-motion'
import { FaFire, FaTrophy, FaDumbbell } from 'react-icons/fa'

interface BannerProps {
  type?: 'promo' | 'achievement' | 'cta'
  title: string
  subtitle?: string
  icon?: 'fire' | 'trophy' | 'dumbbell'
  gradient?: 'purple-pink' | 'blue-cyan' | 'orange-red'
}

export default function Banner({ 
  type = 'promo', 
  title, 
  subtitle, 
  icon = 'fire',
  gradient = 'purple-pink'
}: BannerProps) {
  const iconMap = {
    fire: FaFire,
    trophy: FaTrophy,
    dumbbell: FaDumbbell,
  }

  const gradientMap = {
    'purple-pink': 'from-purple-500 via-pink-500 to-red-500',
    'blue-cyan': 'from-blue-500 via-cyan-500 to-teal-500',
    'orange-red': 'from-orange-500 via-red-500 to-pink-500',
  }

  const IconComponent = iconMap[icon]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="gym-banner p-8 md:p-12 rounded-3xl relative overflow-hidden my-12"
    >
      <div className="absolute inset-0 bg-gradient-to-br opacity-20"></div>
      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex items-center justify-center mb-6"
        >
          <div className={`p-6 rounded-full bg-gradient-to-br ${gradientMap[gradient]} shadow-2xl animate-pulse-glow`}>
            <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-white" />
          </div>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4"
        >
          <span className={`bg-gradient-to-r ${gradientMap[gradient]} bg-clip-text text-transparent`}>
            {title}
          </span>
        </motion.h2>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-200 text-center max-w-3xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}


