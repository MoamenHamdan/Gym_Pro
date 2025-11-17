'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Hero() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Professional fitness images
  const heroImages = [
    { 
      src: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80', 
      alt: 'Professional Fitness Training',
      title: 'Expert Training',
      subtitle: 'Train with certified professionals'
    },
    { 
      src: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80', 
      alt: 'Modern Gym Equipment',
      title: 'State-of-the-Art Equipment',
      subtitle: 'Access to premium fitness facilities'
    },
    { 
      src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80', 
      alt: 'Group Workout Session',
      title: 'Community Support',
      subtitle: 'Join a community of fitness enthusiasts'
    },
    { 
      src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1200&q=80', 
      alt: 'Personalized Workout',
      title: 'Personalized Programs',
      subtitle: 'Customized plans for your goals'
    },
  ]

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
    }
  }

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const handleJoinClick = () => {
    if (user) {
      router.push('/profile')
    } else {
      router.push('/login?message=Please log in to join.')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-charcoal">
      {/* Enhanced animated background with neon gradients */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-neon-purple/30 to-neon-pink/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-neon-blue/30 to-neon-purple/20 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-neon-pink/25 to-neon-blue/25 rounded-full filter blur-3xl"
        />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
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
                className="inline-block mb-6 px-6 py-3 rounded-full glass-3d border border-neon-purple/40 text-neon-purple text-sm font-bold tracking-wider uppercase shadow-neon-purple"
              >
                💪 START YOUR JOURNEY TODAY
              </motion.span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-6 leading-tight relative z-20"
            >
              Transform Your Body,
              <br />
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gradient-neon relative z-20 inline-block"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(141, 66, 251, 0.8)) drop-shadow(0 0 40px rgba(255, 51, 102, 0.6))',
                }}
              >
                Transform Your Life
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Join ProGym and experience professional fitness training with expert coaches and personalized programs designed for your success.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <motion.button
                onClick={handleJoinClick}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary px-10 py-5 rounded-full text-white text-lg font-bold relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {user ? 'Go to Profile' : 'Get Started'}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
              <motion.button
                onClick={() => router.push('/services')}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary px-10 py-5 rounded-full text-white text-lg font-bold border border-white/20 hover:border-neon-purple/50"
              >
                Explore Programs
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Modern Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="relative"
          >
            <div
              ref={carouselRef}
              className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden glass-3d border border-white/20 card-3d"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[currentImageIndex].src}
                    alt={heroImages[currentImageIndex].alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const parent = e.currentTarget.parentElement
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-full h-full bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center">
                            <div class="text-white text-6xl font-bold">💪</div>
                          </div>
                        `
                      }
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  
                  {/* Image content overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {heroImages[currentImageIndex].title}
                      </h3>
                      <p className="text-gray-200 text-lg">
                        {heroImages[currentImageIndex].subtitle}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-3d border border-white/20 flex items-center justify-center text-white hover:bg-neon-purple/30 transition-all z-10"
                aria-label="Previous image"
              >
                <FaChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-3d border border-white/20 flex items-center justify-center text-white hover:bg-neon-purple/30 transition-all z-10"
                aria-label="Next image"
              >
                <FaChevronRight className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentImageIndex
                        ? 'w-8 h-2 bg-white'
                        : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Stats Grid Below Carousel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { value: '10K+', label: 'Active Members' },
                { value: '500+', label: 'Workout Videos' },
                { value: '50+', label: 'Expert Coaches' },
                { value: '98%', label: 'Success Rate' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="glass-3d p-4 rounded-xl border border-white/10 text-center card-3d"
                >
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-gradient-neon mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-gray-400 text-xs font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

