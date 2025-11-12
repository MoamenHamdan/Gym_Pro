'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  imageUrl?: string
}

export default function EventDetailPage() {
  return (
    <ProtectedRoute>
      <EventDetailContent />
    </ProtectedRoute>
  )
}

function EventDetailContent() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!db || !params.id) {
        setLoading(false)
        return
      }
      try {
        const eventDoc = await getDoc(doc(db, 'events', params.id as string))
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() } as Event)
        }
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-white text-xl">Event not found</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 px-4 py-2 rounded-lg glass-card text-white hover:bg-purple-500/50 transition-colors"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Events
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-3xl"
          >
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-96 object-cover rounded-2xl mb-6"
              />
            )}
            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-purple-300">
                <FaCalendarAlt className="mr-3" />
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
              </div>
              {event.time && (
                <div className="flex items-center text-purple-300">
                  <FaClock className="mr-3" />
                  <span>{event.time}</span>
                </div>
              )}
              {event.location && (
                <div className="flex items-center text-purple-300">
                  <FaMapMarkerAlt className="mr-3" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

