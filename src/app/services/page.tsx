'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { FaLock, FaCheckCircle } from 'react-icons/fa'
import { extractChunksFromVideoData, reconstructBase64FromChunks, getChunksFromSubcollection } from '@/lib/videoUtils'

interface Category {
  id: string
  name: string
  slug: string
  description: string
}

interface Video {
  id: string
  title: string
  description: string
  category: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: string
  completed?: boolean
  useSubcollection?: boolean
  chunkCount?: number
}

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Fat Loss',
    slug: 'fat-loss',
    description: 'Burn calories and lose weight with our targeted fat loss program.',
  },
  {
    id: '2',
    name: 'Gain Muscle',
    slug: 'gain-muscle',
    description: 'Build muscle mass and strength with our comprehensive muscle gain program.',
  },
  {
    id: '3',
    name: 'Weight Gain',
    slug: 'weight-gain',
    description: 'Gain healthy weight and build mass with our specialized weight gain program.',
  },
]

export default function ServicesPage() {
  const { user, userData } = useAuth()
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) {
        console.error('Firebase Firestore is not initialized')
        return
      }
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'programs'))
        const categoriesData = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Category[]
        if (categoriesData.length > 0) {
          setCategories(categoriesData.filter((cat) => 
            ['fat-loss', 'gain-muscle', 'weight-gain'].includes(cat.slug)
          ))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleCategoryClick = async (category: Category) => {
    if (!user) {
      toast.error('Please log in to view services')
      return
    }

    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    setSelectedCategory(category)
    setLoading(true)

    try {
      // Check if user has access
      const hasAccess = userData?.enrolledCategories?.includes(category.slug) || false

      if (hasAccess) {
        // Fetch videos for this category
        const videosQuery = query(
          collection(db, 'videos'),
          where('category', '==', category.slug),
          where('published', '==', true)
        )
        const videosSnapshot = await getDocs(videosQuery)
        const videosData = videosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[]

        // Reconstruct video URLs from chunks if needed and fetch progress
        const videosWithProgress = await Promise.all(
          videosData.map(async (video) => {
            if (!db) return video
            
            let videoUrl = ''
            
            // Check if video uses subcollection
            if (video.useSubcollection && db) {
              // Fetch chunks from subcollection
              const chunks = await getChunksFromSubcollection(db, video.id)
              videoUrl = reconstructBase64FromChunks(chunks)
            } else {
              // Check old format (chunks in same document or single videoUrl)
              const videoChunks = extractChunksFromVideoData(video)
              videoUrl = reconstructBase64FromChunks(videoChunks) || video.videoUrl || ''
            }
            
            const progressDoc = await getDoc(doc(db, 'users', user.uid, 'progress', video.id))
            return {
              ...video,
              videoUrl: videoUrl,
              completed: progressDoc.exists() && progressDoc.data()?.completed === true,
            }
          })
        )

        setVideos(videosWithProgress)
      } else {
        setVideos([])
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast.error('Error loading videos')
    } finally {
      setLoading(false)
    }
  }

  const playCompletionSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.frequency.value = 800
    oscillator.type = 'sine'

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
  }

  const handleVideoComplete = async (videoId: string, completed: boolean) => {
    if (!user || !db) return

    try {
      const progressRef = doc(db, 'users', user.uid, 'progress', videoId)
      await setDoc(progressRef, {
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      }, { merge: true })

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, completed } : video
        )
      )
      
      if (completed) {
        playCompletionSound()
        toast.success('Video marked as completed!')
      } else {
        toast.success('Video marked as incomplete')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Error updating progress')
    }
  }

  const handlePurchase = (category: Category) => {
    // Replace with your payment link
    window.open('https://your-payment-link.com', '_blank')
    toast('Redirecting to payment page...', { icon: 'ℹ️' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Services</h1>
            <p className="text-xl text-gray-300">
              Choose a program to get started on your fitness journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => {
              const hasAccess = userData?.enrolledCategories?.includes(category.slug) || false
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="glass-card p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{category.name}</h3>
                    {hasAccess ? (
                      <FaCheckCircle className="text-green-400 w-5 h-5" />
                    ) : (
                      <FaLock className="text-gray-400 w-5 h-5" />
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                  {!hasAccess && user && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(category)
                      }}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm font-medium hover:scale-105 transition-transform"
                    >
                      Purchase Access
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>

          {selectedCategory && (
            <div className="glass-card p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                {selectedCategory.name} Videos
              </h2>
              {!user ? (
                <p className="text-gray-300 text-center py-8">
                  Please log in to view videos
                </p>
              ) : !userData?.enrolledCategories?.includes(selectedCategory.slug) ? (
                <div className="text-center py-8">
                  <FaLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300 mb-4">
                    You don't have access to this category yet.
                  </p>
                  <button
                    onClick={() => handlePurchase(selectedCategory)}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
                  >
                    Purchase Access
                  </button>
                </div>
              ) : loading ? (
                <p className="text-gray-300 text-center py-8">Loading videos...</p>
              ) : videos.length === 0 ? (
                <p className="text-gray-300 text-center py-8">No videos available yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="glass-card p-4 rounded-xl">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">Video</span>
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{video.description}</p>
                      {video.duration && (
                        <p className="text-purple-300 text-xs mb-2">Duration: {video.duration}</p>
                      )}
                      {video.videoUrl && (
                        <div className="mb-4">
                          {video.videoUrl.startsWith('data:') ? (
                            <div className="mt-2">
                              <video
                                src={video.videoUrl}
                                controls
                                className="w-full rounded-lg"
                                style={{ maxHeight: '300px' }}
                              />
                            </div>
                          ) : (
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-300 text-sm block hover:underline"
                            >
                              Watch Video →
                            </a>
                          )}
                        </div>
                      )}
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={video.completed || false}
                          onChange={(e) => handleVideoComplete(video.id, e.target.checked)}
                          className="w-5 h-5 rounded text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm">
                          {video.completed ? 'Completed' : 'Mark as completed'}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

