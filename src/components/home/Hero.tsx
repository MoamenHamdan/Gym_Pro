'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { motion } from 'framer-motion'

export default function Hero() {
  const router = useRouter()
  const { user } = useAuth()

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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your Body,
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transform Your Life
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
              Join ProGym and experience professional fitness training with expert coaches and personalized programs designed for your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleJoinClick}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold hover:scale-105 transition-transform shadow-lg"
              >
                {user ? 'Go to Profile' : 'Get Started'}
              </button>
              <button
                onClick={() => router.push('/services')}
                className="px-8 py-4 rounded-full glass-card text-white text-lg font-bold hover:scale-105 transition-transform"
              >
                Explore Programs
              </button>
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden glass-card">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80"
                alt="Fitness Training"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.parentElement!.innerHTML = `
                    <div class="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <div class="text-white text-6xl font-bold">💪</div>
                    </div>
                  `
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            {/* Additional decorative images */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-4 -left-4 w-24 h-24 rounded-2xl overflow-hidden glass-card hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&q=80"
                alt="Training"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="absolute -top-4 -right-4 w-32 h-32 rounded-2xl overflow-hidden glass-card hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=80"
                alt="Fitness"
                className="w-full h-full object-cover"
              />
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

