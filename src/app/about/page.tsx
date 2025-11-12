'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FaStar } from 'react-icons/fa'

interface Coach {
  id: string
  name: string
  yearsExperience: number
  bio: string
  image: string
  badges: string[]
}

interface Feedback {
  id: string
  userId: string
  userName: string
  userPicture?: string
  comment: string
  rating: number
  createdAt: string
}

export default function AboutPage() {
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!db) {
        console.error('Firebase Firestore is not initialized')
        setLoading(false)
        return
      }
      try {
        // Fetch coaches
        const coachesSnapshot = await getDocs(collection(db, 'coaches'))
        const coachesData = coachesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Coach[]
        
        // Remove duplicates based on ID (in case of any data issues)
        const uniqueCoaches = coachesData.filter((coach, index, self) =>
          index === self.findIndex((c) => c.id === coach.id)
        )
        
        setCoaches(uniqueCoaches)

        // Fetch feedback
        const feedbackSnapshot = await getDocs(collection(db, 'feedback'))
        const feedbackData = feedbackSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()) as Feedback[]
        setFeedback(feedbackData.slice(0, 10)) // Show latest 10
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (coaches.length > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      let animationFrameId: number | null = null
      let timeoutId: NodeJS.Timeout | null = null
      let scrollPosition = 0
      const scrollSpeed = 0.5
      let isPaused = false
      let cleanupCalled = false
      
      const handleMouseEnter = () => {
        isPaused = true
      }
      
      const handleMouseLeave = () => {
        isPaused = false
      }
      
      const cleanup = () => {
        cleanupCalled = true
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId)
          animationFrameId = null
        }
        if (timeoutId !== null) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        if (container) {
          container.removeEventListener('mouseenter', handleMouseEnter)
          container.removeEventListener('mouseleave', handleMouseLeave)
        }
      }
      
      // Wait for DOM to update
      timeoutId = setTimeout(() => {
        if (cleanupCalled || !container || container.children.length === 0) {
          return
        }

        // Calculate the width of one set of coaches
        const firstCoachElement = container.children[0] as HTMLElement
        if (!firstCoachElement) return
        
        const coachWidth = firstCoachElement.offsetWidth
        const gap = 24 // space-x-6 = 1.5rem = 24px
        const oneSetWidth = coaches.length * (coachWidth + gap)
        
        // Reset scroll position
        container.scrollLeft = 0
        scrollPosition = 0
        
        const autoScroll = () => {
          if (cleanupCalled) {
            return
          }
          
          if (!isPaused && container && !cleanupCalled) {
            scrollPosition += scrollSpeed
            container.scrollLeft = scrollPosition
            
            // Reset when reaching end of first set for seamless loop
            if (scrollPosition >= oneSetWidth) {
              scrollPosition = 0
              container.scrollLeft = 0
            }
          }
          
          if (!cleanupCalled) {
            animationFrameId = requestAnimationFrame(autoScroll)
          }
        }
        
        // Add event listeners
        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)
        
        // Start auto-scroll
        animationFrameId = requestAnimationFrame(autoScroll)
      }, 100)
      
      return cleanup
    }
  }, [coaches])

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About ProGym</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We are dedicated to helping you achieve your fitness goals with expert coaches and world-class facilities.
            </p>
          </motion.div>

          {/* Coaches Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Coaches</h2>
            {coaches.length > 0 ? (
              <div className="relative overflow-hidden">
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    WebkitScrollbar: { display: 'none' },
                  }}
                >
                  {/* Render coaches multiple times for seamless infinite scroll */}
                  {/* Only duplicate if we have few coaches to ensure smooth scrolling */}
                  {(coaches.length <= 3 
                    ? [...coaches, ...coaches, ...coaches, ...coaches] 
                    : [...coaches, ...coaches]
                  ).map((coach, index) => (
                    <motion.div
                      key={`coach-${coach.id}-set${Math.floor(index / coaches.length)}-idx${index % coaches.length}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="flex-shrink-0 w-80"
                    >
                      <div className="glass-card p-6 rounded-2xl h-full">
                        <img
                          src={coach.image}
                          alt={coach.name}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold text-white mb-2">{coach.name}</h3>
                        <p className="text-purple-300 text-sm mb-2">
                          {coach.yearsExperience} years of experience
                        </p>
                        <p className="text-gray-300 text-sm mb-4">{coach.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {coach.badges.map((badge, badgeIndex) => (
                            <span
                              key={`${coach.id}-${badge}-${badgeIndex}`}
                              className="px-3 py-1 rounded-full glass text-white text-xs"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-300 text-center py-8">No coaches available yet.</p>
            )}
          </section>

          {/* Feedback Section */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Members Say</h2>
            {feedback.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedback.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 rounded-2xl"
                  >
                    <div className="flex items-center mb-4">
                      {item.userPicture ? (
                        <img
                          src={item.userPicture}
                          alt={item.userName}
                          className="w-12 h-12 rounded-full object-cover mr-3"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold mr-3">
                          {item.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-white font-semibold">{item.userName}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < item.rating ? 'text-yellow-400' : 'text-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{item.comment}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-300 text-center py-8">No feedback yet. Be the first to share your experience!</p>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}
