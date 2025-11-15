'use client'

import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'

export default function Feedback() {
  const { user, userData } = useAuth()
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(5)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) {
      toast.error('Please log in to submit feedback')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter your feedback')
      return
    }

    setSubmitting(true)
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: user.uid,
        userName: userData?.displayName || user.email || 'Anonymous',
        userPicture: userData?.profilePicture || '',
        comment: comment.trim(),
        rating,
        createdAt: new Date().toISOString(),
      })
      toast.success('Thank you for your feedback!')
      setComment('')
      setRating(5)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Error submitting feedback')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="gym-card glass-card p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10"></div>
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-extrabold text-white mb-6 text-center"
            >
              <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                Share Your Feedback
              </span>
            </motion.h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`w-8 h-8 transition-all ${
                        star <= rating 
                          ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]' 
                          : 'text-gray-400 hover:text-yellow-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Your Feedback</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Tell us about your experience..."
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.05, y: submitting ? 0 : -2 }}
              whileTap={{ scale: submitting ? 1 : 0.95 }}
              className="ripple-effect w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏳
                  </motion.span>
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </motion.button>
          </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

