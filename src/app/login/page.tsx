'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signup, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  useEffect(() => {
    if (message) {
      toast.error(message)
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
        toast.success('Logged in successfully!')
        router.push('/')
      } else {
        if (!displayName) {
          toast.error('Please enter your name')
          setLoading(false)
          return
        }
        await signup(email, password, displayName)
        toast.success('Account created successfully!')
        router.push('/')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="glass-3d p-8 md:p-12 rounded-3xl max-w-md w-full border border-white/10 relative overflow-hidden card-3d"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
          <div className="relative z-10 mt-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                <span className="text-gradient-neon">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </span>
              </h1>
              <p className="text-gray-400 text-sm font-light">
                {isLogin ? 'Continue your fitness journey' : 'Start your transformation today'}
              </p>
            </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label htmlFor="displayName" className="block text-sm font-semibold text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.2 : 0.4 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                placeholder="Enter your email"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: isLogin ? 0.3 : 0.5 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                placeholder="Enter your password"
                required
              />
              {!isLogin && password.length > 0 && password.length < 6 && (
                <p className="text-neon-pink text-xs mt-2 font-medium">Password should be at least 6 characters</p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 rounded-full btn-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
              </span>
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-neon-purple text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span className="text-neon-purple font-semibold">
                {isLogin ? 'Sign up' : 'Login'}
              </span>
            </button>
          </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}

