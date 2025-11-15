'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { motion } from 'framer-motion'

export default function Hero() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentMainImageIndex, setCurrentMainImageIndex] = useState(0)

  // Main images for rotation (3 images)
  const mainImages = [
    { src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', alt: 'Fitness Training' },
    { src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', alt: 'Workout Session' },
    { src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80', alt: 'Gym Training' },
  ]

  // Rotate main image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMainImageIndex((prev) => (prev + 1) % mainImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [mainImages.length])

  const handleJoinClick = () => {
    if (user) {
      router.push('/profile')
    } else {
      router.push('/login?message=Please log in to join.')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="inline-block mb-6 px-6 py-2 rounded-full glass-card border border-purple-500/30 text-purple-300 text-sm font-semibold"
              >
                💪 START YOUR JOURNEY TODAY
              </motion.span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight relative z-20"
            >
              Transform Your Body,
              <br />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent gradient-animated relative z-20 inline-block"
                style={{ 
                  textShadow: '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(236, 72, 153, 0.6), 0 0 120px rgba(239, 68, 68, 0.4)',
                  WebkitTextStroke: '2px rgba(168, 85, 247, 0.3)',
                  filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 24px rgba(236, 72, 153, 0.6))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                }}
              >
                Transform Your Life
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Join ProGym and experience professional fitness training with expert coaches and personalized programs designed for your success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                onClick={handleJoinClick}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="ripple-effect px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 animate-pulse-glow"
              >
                {user ? 'Go to Profile' : 'Get Started'}
              </motion.button>
              <motion.button
                onClick={() => router.push('/services')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="ripple-effect px-8 py-4 rounded-full glass-card border border-white/30 text-white text-lg font-bold hover:border-purple-400/50 transition-all shadow-lg hover:shadow-xl"
              >
                Explore Programs
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden glass-card border border-white/20 hover:border-purple-400/50 transition-all duration-300"
            >
              <motion.img
                key={currentMainImageIndex}
                src={mainImages[currentMainImageIndex].src}
                alt={mainImages[currentMainImageIndex].alt}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none'
                  const parent = e.currentTarget.parentElement
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <div class="text-white text-6xl font-bold">💪</div>
                      </div>
                    `
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              {/* Image indicator dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {mainImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentMainImageIndex
                        ? 'w-8 bg-white'
                        : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-pink-500 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

