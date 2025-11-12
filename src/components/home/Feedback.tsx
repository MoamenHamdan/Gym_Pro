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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 rounded-3xl"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Share Your Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FaStar
                      className={`w-8 h-8 transition-colors ${
                        star <= rating ? 'text-yellow-400' : 'text-gray-400'
                      }`}
                    />
                  </button>
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
            <button
              type="submit"
              disabled={submitting}
              className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

