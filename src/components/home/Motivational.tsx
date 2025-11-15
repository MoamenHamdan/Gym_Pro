'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { motion } from 'framer-motion'
import { FaQuoteLeft } from 'react-icons/fa'

export default function Motivational() {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="gym-card glass-card p-12 rounded-3xl text-center border border-white/10 hover:border-purple-400/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <FaQuoteLeft className="w-12 h-12 text-purple-400 mx-auto mb-6 animate-pulse-glow" />
            </motion.div>
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed"
            >
              &quot;The only bad workout is the one that didn&apos;t happen. Your body can do it. It&apos;s your mind you need to convince.&quot;
            </motion.blockquote>
            <motion.button
              onClick={handleJoinClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="ripple-effect px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white text-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/50"
            >
              Join Us Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

