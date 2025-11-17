'use client'

import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
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
        const feedbackData = (feedbackSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Feedback[])
          .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
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
      <main className="min-h-screen bg-charcoal relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-20 relative z-10">
          <div className="text-white text-xl">Loading...</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-3 rounded-full glass-3d text-neon-purple text-sm font-bold tracking-wider uppercase border border-neon-purple/40 shadow-neon-purple">
                Our Story
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="text-gradient-neon">
                About ProGym
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We are dedicated to helping you achieve your fitness goals with expert coaches and world-class facilities.
            </p>
          </motion.div>

          {/* Coaches Section */}
          <section className="mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
            >
              Our Coaches
            </motion.h2>
            {coaches.length > 0 ? (
              <div className="relative overflow-hidden">
                <div
                  ref={scrollContainerRef}
                  className="flex space-x-6 overflow-x-auto scrollbar-hide py-4"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  } as React.CSSProperties}
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
                      transition={{ duration: 0.5 }}
                      className="flex-shrink-0 w-80"
                    >
                      <div className="glass-card p-6 rounded-2xl h-full border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1">
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
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
            >
              What Our Members Say
            </motion.h2>
            {feedback.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {feedback.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
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
