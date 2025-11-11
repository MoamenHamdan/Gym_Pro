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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-12 rounded-3xl text-center"
        >
          <FaQuoteLeft className="w-12 h-12 text-purple-400 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-bold text-white mb-8">
            "The only bad workout is the one that didn't happen. Your body can do it. It's your mind you need to convince."
          </blockquote>
          <button
            onClick={handleJoinClick}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold hover:scale-105 transition-transform shadow-lg"
          >
            Join Us Today
          </button>
        </motion.div>
      </div>
    </section>
  )
}

