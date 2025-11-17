'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs, query, where, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import { motion } from 'framer-motion'
import { FaLock, FaCheckCircle, FaTrophy } from 'react-icons/fa'
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
  day?: number // Day of the program (1-28 for 4 weeks)
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

interface VideosByDay {
  [day: number]: Video[]
}

interface CategoryProgress {
  [categorySlug: string]: {
    completed: number
    total: number
    percentage: number
  }
}

export default function ServicesPage() {
  const { user, userData } = useAuth()
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [videos, setVideos] = useState<Video[]>([])
  const [videosByDay, setVideosByDay] = useState<VideosByDay>({})
  const [loading, setLoading] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress>({})

  // Calculate progress for a category
  const calculateCategoryProgress = useCallback(async (categorySlug: string) => {
    if (!user || !db) return { completed: 0, total: 0, percentage: 0 }

    try {
      // Get all videos for this category
      const videosQuery = query(
        collection(db, 'videos'),
        where('category', '==', categorySlug),
        where('published', '==', true)
      )
      const videosSnapshot = await getDocs(videosQuery)
      const totalVideos = videosSnapshot.docs.length

      if (totalVideos === 0) {
        return { completed: 0, total: 0, percentage: 0 }
      }

      // Get all progress documents for this user
      const progressSnapshot = await getDocs(collection(db, 'users', user.uid, 'progress'))
      const completedVideoIds = new Set(
        progressSnapshot.docs
          .filter((doc) => doc.data().completed === true)
          .map((doc) => doc.id)
      )

      // Count completed videos that belong to this category
      let completedCount = 0
      videosSnapshot.docs.forEach((videoDoc) => {
        if (completedVideoIds.has(videoDoc.id)) {
          completedCount++
        }
      })

      const percentage = totalVideos > 0 ? Math.round((completedCount / totalVideos) * 100) : 0

      return {
        completed: completedCount,
        total: totalVideos,
        percentage,
      }
    } catch (error) {
      console.error('Error calculating progress:', error)
      return { completed: 0, total: 0, percentage: 0 }
    }
  }, [user, db])

  useEffect(() => {
    const fetchCategories = async () => {
      if (!db) {
        console.error('Firebase Firestore is not initialized')
        return
      }
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'programs'))
        const categoriesData = categoriesSnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.title || data.name || 'Untitled Program',
            slug: data.slug || '',
            description: data.description || '',
          } as Category
        })
        if (categoriesData.length > 0) {
          setCategories(categoriesData)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch progress when categories or user changes
  useEffect(() => {
    if (user && categories.length > 0) {
      const fetchProgress = async () => {
        const progress: CategoryProgress = {}
        for (const category of categories) {
          progress[category.slug] = await calculateCategoryProgress(category.slug)
        }
        setCategoryProgress(progress)
      }
      fetchProgress()
    }
  }, [user, categories, calculateCategoryProgress])

  const handleCategoryClick = async (category: Category) => {
    if (!user) {
      toast.error('Please log in to view services')
      return
    }

    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    // Check if program is locked (100% complete)
    const progress = categoryProgress[category.slug]
    if (progress && progress.percentage >= 100) {
      toast.success('🎉 Congratulations! You have completed this program! It is now locked.')
      return
    }

    setSelectedCategory(category)
    setSelectedWeek(null)
    setSelectedDay(null)
    setLoading(true)

    try {
      // Check if user has access
      const hasAccess = userData?.enrolledCategories?.includes(category.slug) || false

      if (hasAccess) {
        // Fetch ALL videos for this category (no limit - supports many videos per day)
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
        
        // Group videos by day (1-28 for 4 weeks) - supports many videos per day
        const grouped: VideosByDay = {}
        videosWithProgress.forEach((video) => {
          const day = video.day || 1 // Default to day 1 if not specified
          // Ensure day is between 1-28 (4 weeks)
          const validDay = Math.max(1, Math.min(28, day))
          if (!grouped[validDay]) {
            grouped[validDay] = []
          }
          grouped[validDay].push(video)
        })
        
        // Sort videos within each day by title (supports unlimited videos per day)
        Object.keys(grouped).forEach((day) => {
          grouped[parseInt(day)].sort((a, b) => a.title.localeCompare(b.title))
        })
        
        console.log(`Loaded ${videosWithProgress.length} videos total, grouped by day:`, 
          Object.keys(grouped).map(d => `Day ${d}: ${grouped[parseInt(d)].length} videos`).join(', '))
        
        setVideosByDay(grouped)
      } else {
        setVideos([])
        setVideosByDay({})
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
        updatedAt: new Date().toISOString(),
      }, { merge: true })

      // Update videos state
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video.id === videoId ? { ...video, completed } : video
        )
      )
      
      // Update videosByDay state as well
      setVideosByDay((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((day) => {
          updated[parseInt(day)] = updated[parseInt(day)].map((video) =>
            video.id === videoId ? { ...video, completed } : video
          )
        })
        return updated
      })

      // Recalculate progress for the current category
      if (selectedCategory) {
        const progress = await calculateCategoryProgress(selectedCategory.slug)
        setCategoryProgress((prev) => ({
          ...prev,
          [selectedCategory.slug]: progress,
        }))

        // Check if program is completed (100%)
        if (progress.percentage >= 100) {
          toast.success('🎉🎉🎉 Congratulations! You completed the entire program! 🎉🎉🎉')
        }
      }
      
      if (completed) {
        playCompletionSound()
        toast.success('🎉 Video marked as completed! Great job!')
      } else {
        toast.success('Video marked as incomplete')
      }
    } catch (error) {
      console.error('Error updating progress:', error)
      toast.error('Error updating progress. Please try again.')
    }
  }

  const handlePurchase = (category: Category) => {
    // Replace with your payment link
    window.open('https://your-payment-link.com', '_blank')
    toast('Redirecting to payment page...', { icon: 'ℹ️' })
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header Section */}
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
                Premium Programs
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="text-gradient-neon">
                Our Services
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Choose a program to get started on your fitness journey. Transform your body with expert guidance.
            </p>
          </motion.div>

          {/* Enhanced Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => {
              const hasAccess = userData?.enrolledCategories?.includes(category.slug) || false
              const progress = categoryProgress[category.slug] || { completed: 0, total: 0, percentage: 0 }
              const isCompleted = progress.percentage >= 100
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative"
                >
                  <motion.div
                    whileHover={!isCompleted ? { y: -8, scale: 1.02 } : {}}
                    whileTap={!isCompleted ? { scale: 0.98 } : {}}
                    className={`relative h-full gym-card glass-card p-8 rounded-3xl overflow-hidden border transition-all duration-500 ${
                      isCompleted 
                        ? 'border-yellow-500/50 cursor-not-allowed opacity-90' 
                        : 'border-white/10 hover:border-purple-400/50 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/20'
                    }`}
                    onClick={() => !isCompleted && handleCategoryClick(category)}
                  >
                    {/* Completion overlay for 100% */}
                    {isCompleted && (
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-3xl z-20 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50"
                          >
                            <FaTrophy className="w-10 h-10 text-white" />
                          </motion.div>
                          <p className="text-yellow-400 font-bold text-lg">Program Completed!</p>
                          <p className="text-yellow-300 text-sm mt-1">Locked</p>
                        </div>
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 transition-all duration-500 rounded-3xl"></div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            {hasAccess && (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-semibold">
                                <FaCheckCircle className="w-3 h-3" />
                                Enrolled
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-semibold">
                                <FaTrophy className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`p-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
                          isCompleted
                            ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                            : hasAccess 
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                            : 'bg-gray-500/20 border border-gray-500/30 text-gray-400 group-hover:border-purple-500/50 group-hover:text-purple-400'
                        }`}>
                          {isCompleted ? (
                            <FaTrophy className="w-6 h-6" />
                          ) : hasAccess ? (
                            <FaCheckCircle className="w-6 h-6" />
                          ) : (
                            <FaLock className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                      <p className="text-gray-300 text-base leading-relaxed mb-6 min-h-[60px]">
                        {category.description}
                      </p>

                      {/* Progress Bar */}
                      {hasAccess && progress.total > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-300">Progress</span>
                            <span className="text-sm font-bold text-purple-400">
                              {progress.completed} / {progress.total} ({progress.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden border border-gray-600/30">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${progress.percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                isCompleted
                                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
                              } shadow-lg`}
                            />
                          </div>
                        </div>
                      )}

                      {!hasAccess && user && (
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(category)
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="ripple-effect w-full px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/50"
                        >
                          Purchase Access
                        </motion.button>
                      )}
                      {hasAccess && !isCompleted && (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 font-semibold text-center"
                        >
                          <span className="flex items-center justify-center gap-2">
                            <motion.span
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                            >
                              ✓
                            </motion.span>
                            Access Granted
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>

          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 overflow-hidden relative"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                      <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                        {selectedCategory.name}
                      </span>
                    </h2>
                    <p className="text-gray-400 text-sm">Your personalized workout videos</p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 rounded-lg glass hover:bg-white/10 transition-colors duration-300"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {!user ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-card flex items-center justify-center border-2 border-purple-500/30">
                      <FaLock className="w-12 h-12 text-purple-400" />
                    </div>
                    <p className="text-xl text-gray-300 mb-2">Please log in to view videos</p>
                    <p className="text-gray-400">Join us to access premium content</p>
                  </div>
                ) : !userData?.enrolledCategories?.includes(selectedCategory.slug) ? (
                  <div className="text-center py-16">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-32 h-32 mx-auto mb-8 rounded-full glass-card flex items-center justify-center border-2 border-purple-500/30 relative"
                    >
                      <FaLock className="w-16 h-16 text-gray-400" />
                      <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">Access Required</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                      You don&apos;t have access to this category yet. Purchase access to unlock all premium videos.
                    </p>
                    <button
                      onClick={() => handlePurchase(selectedCategory)}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95"
                    >
                      Purchase Access Now
                    </button>
                  </div>
                ) : loading ? (
                  <div className="text-center py-16">
                    <div className="inline-block w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-300 text-lg">Loading videos...</p>
                  </div>
                ) : videos.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-card flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xl text-gray-300">No videos available yet.</p>
                    <p className="text-gray-400 mt-2">Check back soon for new content!</p>
                  </div>
                ) : selectedWeek === null ? (
                  // Show 4 weeks
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((week) => {
                      const weekDays = Array.from({ length: 7 }, (_, i) => ((week - 1) * 7) + i + 1)
                      const totalVideos = weekDays.reduce((sum, day) => sum + (videosByDay[day]?.length || 0), 0)
                      
                      return (
                        <motion.div
                          key={week}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: week * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="glass-card p-8 rounded-3xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                          onClick={() => setSelectedWeek(week)}
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-purple-500/30">
                              {week}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                              Week {week}
                            </h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Days {((week - 1) * 7) + 1} - {week * 7}
                            </p>
                            <div className="px-4 py-2 rounded-full glass-card text-purple-300 text-sm font-semibold border border-purple-500/30 inline-block">
                              {totalVideos} {totalVideos === 1 ? 'Video' : 'Videos'}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                ) : selectedDay === null ? (
                  // Show days for selected week
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <button
                        onClick={() => setSelectedWeek(null)}
                        className="px-4 py-2 rounded-lg glass-card text-white hover:bg-white/10 transition-colors"
                      >
                        ← Back to Weeks
                      </button>
                      <h2 className="text-3xl font-bold text-white">
                        <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                          Week {selectedWeek}
                        </span>
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                      {Array.from({ length: 7 }, (_, i) => {
                        const day = ((selectedWeek - 1) * 7) + i + 1
                        const dayVideos = videosByDay[day] || []
                        
                        return (
                          <motion.div
                            key={day}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 cursor-pointer text-center"
                            onClick={() => setSelectedDay(day)}
                          >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-purple-500/30">
                              {day}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">
                              Day {day}
                            </h3>
                            <p className="text-gray-400 text-xs mb-3">Day {i + 1}</p>
                            <div className="px-3 py-1 rounded-full glass-card text-purple-300 text-xs font-semibold border border-purple-500/30 inline-block">
                              {dayVideos.length} {dayVideos.length === 1 ? 'Video' : 'Videos'}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  // Show videos for selected day
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <button
                        onClick={() => setSelectedDay(null)}
                        className="px-4 py-2 rounded-lg glass-card text-white hover:bg-white/10 transition-colors"
                      >
                        ← Back to Days
                      </button>
                      <h2 className="text-3xl font-bold text-white">
                        <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-white bg-clip-text text-transparent">
                          Week {selectedWeek} - Day {selectedDay}
                        </span>
                      </h2>
                    </div>
                    {videosByDay[selectedDay] && videosByDay[selectedDay].length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {videosByDay[selectedDay].map((video, videoIndex) => (
                              <motion.div
                                key={video.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: videoIndex * 0.05 }}
                                className="group relative glass-card p-5 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
                              >
                                {/* Completion badge */}
                                {video.completed && (
                                  <div className="absolute top-3 right-3 z-20 bg-green-500 rounded-full p-1.5 shadow-lg">
                                    <FaCheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                                
                                {/* Thumbnail */}
                                {video.thumbnailUrl ? (
                                  <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300">
                                    <img
                                      src={video.thumbnailUrl}
                                      alt={video.title}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                  </div>
                                ) : (
                                  <div className="relative w-full h-44 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl mb-4 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-pink-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <span className="relative z-10 text-white text-3xl font-bold">📹</span>
                                  </div>
                                )}
                                
                                {/* Video info */}
                                <h4 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                                  {video.title}
                                </h4>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                  {video.description}
                                </p>
                                
                                {/* Duration badge */}
                                {video.duration && (
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {video.duration}
                                  </div>
                                )}
                                
                                {/* Video player/link */}
                                {video.videoUrl && (
                                  <div className="mb-4">
                                    {video.videoUrl.startsWith('data:') ? (
                                      <div className="mt-2 rounded-xl overflow-hidden border border-white/10">
                                        <video
                                          src={video.videoUrl}
                                          controls
                                          className="w-full rounded-lg"
                                          style={{ maxHeight: '280px' }}
                                        />
                                      </div>
                                    ) : (
                                      <a
                                        href={video.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 text-sm font-semibold hover:from-purple-500/30 hover:to-pink-500/30 hover:border-purple-500/50 transition-all duration-300 group/link"
                                      >
                                        <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Watch Video
                                      </a>
                                    )}
                                  </div>
                                )}
                                
                                {/* Completion checkbox */}
                                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-purple-500/20">
                                  <input
                                    type="checkbox"
                                    checked={video.completed || false}
                                    onChange={(e) => handleVideoComplete(video.id, e.target.checked)}
                                    className="w-5 h-5 rounded-md text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent cursor-pointer transition-all duration-300"
                                  />
                                  <span className={`text-sm font-medium transition-colors duration-300 ${
                                    video.completed 
                                      ? 'text-green-400' 
                                      : 'text-gray-300 group-hover:text-white'
                                  }`}>
                                    {video.completed ? '✓ Completed' : 'Mark as completed'}
                                  </span>
                                </label>
                              </motion.div>
                            ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full glass-card flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xl text-gray-300">No videos assigned for this day</p>
                        <p className="text-gray-400 mt-2">Check back soon for new content!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

