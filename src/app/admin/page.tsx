'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { FaUser, FaVideo, FaFolder, FaCheck, FaTimes, FaTrash, FaEdit, FaUserTie, FaCalendarAlt, FaStar, FaTrophy, FaUpload } from 'react-icons/fa'
import { fileToBase64, isImageFile, isVideoFile, formatFileSize } from '@/lib/fileUtils'
import { createChunkedVideoData, extractChunksFromVideoData, reconstructBase64FromChunks, saveChunksToSubcollection, getChunksFromSubcollection, deleteChunksFromSubcollection } from '@/lib/videoUtils'

interface User {
  id: string
  displayName: string
  email: string
  role?: string
  enrolledCategories?: string[]
}

interface Video {
  id: string
  title: string
  description: string
  category: string
  videoUrl?: string
  thumbnailUrl?: string
  duration?: string
  published?: boolean
  useSubcollection?: boolean
  chunkCount?: number
}

interface Program {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  difficulty?: string
  level?: string
  type?: string
  tags?: string[]
  picture?: string
}

interface Coach {
  id: string
  name: string
  yearsExperience: number
  bio: string
  image: string
  badges: string[]
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  imageUrl?: string
}

interface WhyJoinUs {
  id: string
  title: string
  imageUrl: string
}

interface Competition {
  id: string
  title: string
  description: string
  date: string
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<'users' | 'videos' | 'programs' | 'coaches' | 'events' | 'whyJoinUs' | 'competitions'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [whyJoinUs, setWhyJoinUs] = useState<WhyJoinUs[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    if (!db) {
      toast.error('Firebase is not initialized')
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      if (activeTab === 'users') {
        const usersSnapshot = await getDocs(collection(db, 'users'))
        setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User)))
      } else if (activeTab === 'videos') {
        if (!db) {
          setLoading(false)
          return
        }
        
        const videosSnapshot = await getDocs(collection(db, 'videos'))
        const videosData = videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video))
        
        // Reconstruct video URLs from chunks if needed
        const videosWithReconstructedUrls = await Promise.all(
          videosData.map(async (video) => {
            if (!db) return video
            
            // Check if video uses subcollection
            if (video.useSubcollection) {
              // Fetch chunks from subcollection
              const chunks = await getChunksFromSubcollection(db, video.id)
              const reconstructedUrl = reconstructBase64FromChunks(chunks)
              return {
                ...video,
                videoUrl: reconstructedUrl || '',
              }
            } else {
              // Check old format (chunks in same document)
              const videoChunks = extractChunksFromVideoData(video)
              const reconstructedUrl = reconstructBase64FromChunks(videoChunks)
              return {
                ...video,
                videoUrl: reconstructedUrl || video.videoUrl || '',
              }
            }
          })
        )
        
        setVideos(videosWithReconstructedUrls)
      } else if (activeTab === 'programs') {
        const programsSnapshot = await getDocs(collection(db, 'programs'))
        setPrograms(programsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Program)))
      } else if (activeTab === 'coaches') {
        const coachesSnapshot = await getDocs(collection(db, 'coaches'))
        setCoaches(coachesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Coach)))
      } else if (activeTab === 'events') {
        const eventsSnapshot = await getDocs(collection(db, 'events'))
        setEvents(eventsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event)))
      } else if (activeTab === 'whyJoinUs') {
        const whyJoinUsSnapshot = await getDocs(collection(db, 'whyJoinUs'))
        setWhyJoinUs(whyJoinUsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as WhyJoinUs)))
      } else if (activeTab === 'competitions') {
        const competitionsSnapshot = await getDocs(collection(db, 'competitions'))
        setCompetitions(competitionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Competition)))
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error fetching data')
    } finally {
      setLoading(false)
    }
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
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'users'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaUser className="inline mr-2" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'videos'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaVideo className="inline mr-2" />
                Videos
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'programs'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaFolder className="inline mr-2" />
                Programs
              </button>
              <button
                onClick={() => setActiveTab('coaches')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'coaches'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaUserTie className="inline mr-2" />
                Coaches
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'events'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaCalendarAlt className="inline mr-2" />
                Events
              </button>
              <button
                onClick={() => setActiveTab('whyJoinUs')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'whyJoinUs'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaStar className="inline mr-2" />
                Why Join Us
              </button>
              <button
                onClick={() => setActiveTab('competitions')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'competitions'
                    ? 'bg-purple-500 text-white'
                    : 'glass-card text-white hover:bg-purple-500/50'
                }`}
              >
                <FaTrophy className="inline mr-2" />
                Competitions
              </button>
            </div>
          </motion.div>

          {activeTab === 'users' && <UsersTab users={users} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'videos' && <VideosTab videos={videos} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'programs' && <ProgramsTab programs={programs} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'coaches' && <CoachesTab coaches={coaches} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'events' && <EventsTab events={events} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'whyJoinUs' && <WhyJoinUsTab whyJoinUs={whyJoinUs} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'competitions' && <CompetitionsTab competitions={competitions} loading={loading} onUpdate={fetchData} />}
        </div>
      </div>
      <Footer />
    </main>
  )
}

function UsersTab({ users, loading, onUpdate }: { users: User[]; loading: boolean; onUpdate: () => void }) {
  const categories = ['fat-loss', 'gain-muscle', 'weight-gain']

  const toggleAccess = async (userId: string, category: string) => {
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const userRef = doc(db, 'users', userId)
      const user = users.find((u) => u.id === userId)
      const currentCategories = user?.enrolledCategories || []
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category]

      await updateDoc(userRef, {
        enrolledCategories: newCategories,
      })
      toast.success('Access updated')
      onUpdate()
    } catch (error) {
      console.error('Error updating access:', error)
      toast.error('Error updating access')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading users...</div>
  }

  return (
    <div className="glass-card p-6 rounded-2xl overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left text-white p-4">Name</th>
            <th className="text-left text-white p-4">Email</th>
            <th className="text-left text-white p-4">Role</th>
            <th className="text-left text-white p-4">Fat Loss</th>
            <th className="text-left text-white p-4">Gain Muscle</th>
            <th className="text-left text-white p-4">Weight Gain</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-white/10">
              <td className="text-white p-4">{user.displayName || 'N/A'}</td>
              <td className="text-gray-300 p-4">{user.email}</td>
              <td className="text-gray-300 p-4">{user.role || 'user'}</td>
              {categories.map((category) => (
                <td key={category} className="p-4">
                  <button
                    onClick={() => toggleAccess(user.id, category)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.enrolledCategories?.includes(category)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {user.enrolledCategories?.includes(category) ? (
                      <FaCheck className="w-4 h-4" />
                    ) : (
                      <FaTimes className="w-4 h-4" />
                    )}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function VideosTab({ videos, loading, onUpdate }: { videos: Video[]; loading: boolean; onUpdate: () => void }) {
  const [showUpload, setShowUpload] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('fat-loss')
  const [duration, setDuration] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [published, setPublished] = useState(true)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [videoPreview, setVideoPreview] = useState<string>('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const { user } = useAuth()

  useEffect(() => {
    if (editingVideo && db) {
      setTitle(editingVideo.title)
      setDescription(editingVideo.description)
      setCategory(editingVideo.category)
      setDuration(editingVideo.duration || '')
      
      // Reconstruct video URL from chunks if needed
      const loadVideoUrl = async () => {
        if (!db) return
        
        if (editingVideo.useSubcollection) {
          // Fetch chunks from subcollection
          const chunks = await getChunksFromSubcollection(db, editingVideo.id)
          const reconstructedVideoUrl = reconstructBase64FromChunks(chunks)
          setVideoUrl(reconstructedVideoUrl || '')
        } else {
          // Check old format (chunks in same document or single videoUrl)
          const videoChunks = extractChunksFromVideoData(editingVideo)
          const reconstructedVideoUrl = reconstructBase64FromChunks(videoChunks)
          setVideoUrl(reconstructedVideoUrl || editingVideo.videoUrl || '')
        }
      }
      
      loadVideoUrl()
      setThumbnailUrl(editingVideo.thumbnailUrl || '')
      setPublished(editingVideo.published !== false)
      setShowUpload(true)
    }
  }, [editingVideo, db])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategory('fat-loss')
    setDuration('')
    setVideoUrl('')
    setThumbnailUrl('')
    setPublished(true)
    setEditingVideo(null)
    setShowUpload(false)
    setVideoPreview('')
    setThumbnailPreview('')
  }

  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isVideoFile(file)) {
      toast.error('Please select a video file')
      return
    }

    // Firestore has a 1MB limit per field, but we'll chunk large videos
    // Allow larger files (up to 5MB) which will be split into chunks
    const maxSizeMB = 5 // 5MB max - will be chunked if needed
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      toast.error(
        `Video file too large. Maximum size is ${maxSizeMB}MB (${formatFileSize(maxSizeBytes)}). Your file is ${formatFileSize(file.size)}. Please compress the video or use a smaller file.`
      )
      return
    }

    setUploadingVideo(true)
    try {
      // Convert to base64 - we'll chunk it when saving
      const result = await fileToBase64(file, maxSizeMB)
      setVideoUrl(result.dataUrl)
      setVideoPreview(result.dataUrl)
      toast.success(`Video uploaded: ${formatFileSize(result.fileSize)}. Will be chunked for storage.`)
    } catch (error: any) {
      console.error('Video upload error:', error)
      toast.error(error.message || 'Failed to upload video')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleThumbnailFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    // Thumbnails should be small, limit to 500KB raw (becomes ~667KB base64)
    // This ensures it fits in Firestore with the video data
    const maxSizeMB = 0.99 // 500KB max
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (file.size > maxSizeBytes) {
      toast.error(
        `Thumbnail file too large. Maximum size is ${maxSizeMB}MB (${formatFileSize(maxSizeBytes)}). Your file is ${formatFileSize(file.size)}. Please use a smaller image.`
      )
      return
    }

    setUploadingThumbnail(true)
    try {
      const result = await fileToBase64(file, maxSizeMB)
      setThumbnailUrl(result.dataUrl)
      setThumbnailPreview(result.dataUrl)
      toast.success(`Thumbnail uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      console.error('Thumbnail upload error:', error)
      toast.error(error.message || 'Failed to upload thumbnail')
    } finally {
      setUploadingThumbnail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) {
      toast.error('Firebase is not initialized')
      return
    }

    if (!videoUrl.trim()) {
      toast.error('Please provide a video URL or upload a video file')
      return
    }

    try {
      // Check if videoUrl is a base64 data URL (starts with data:)
      const isBase64Video = videoUrl.trim().startsWith('data:video/')
      
      let videoChunkData: any = {}
      
      if (isBase64Video) {
        // Check if video should be stored in subcollection or main document
        const chunkData = createChunkedVideoData(videoUrl.trim())
        
        // Prepare thumbnail data (usually small, store in main document)
        let thumbnailChunkData: any = {}
        if (thumbnailUrl && thumbnailUrl.trim().startsWith('data:image/')) {
          thumbnailChunkData = { thumbnailUrl: thumbnailUrl.trim() }
        } else if (thumbnailUrl) {
          thumbnailChunkData = { thumbnailUrl: thumbnailUrl.trim() }
        }
        
        if (chunkData.useSubcollection && chunkData.chunks) {
          // Large video - store chunks in subcollection
          // First create/update the main video document with metadata only
          const videoData: any = {
            title,
            description,
            category,
            duration: duration || '',
            useSubcollection: true, // Flag to indicate chunks are in subcollection
            chunkCount: chunkData.chunkCount,
            published,
            createdBy: user.uid,
            updatedAt: new Date().toISOString(),
          }
          
          // Add thumbnail if provided
          if (thumbnailChunkData.thumbnailUrl) {
            videoData.thumbnailUrl = thumbnailChunkData.thumbnailUrl
          }
          
          // Only add createdAt when creating new video
          if (!editingVideo) {
            videoData.createdAt = new Date().toISOString()
          }
          
          let videoId: string
          if (editingVideo) {
            videoId = editingVideo.id
            // Delete old chunks if they exist
            await deleteChunksFromSubcollection(db, videoId)
            await updateDoc(doc(db, 'videos', videoId), videoData)
          } else {
            // Create new video document
            const videoDocRef = await addDoc(collection(db, 'videos'), videoData)
            videoId = videoDocRef.id
          }
          
          // Save chunks to subcollection
          await saveChunksToSubcollection(db, videoId, chunkData.chunks)
          toast.success(editingVideo ? 'Video updated successfully!' : 'Video added successfully!')
        } else {
          // Small video - store in main document (backward compatibility)
          const videoData: any = {
            title,
            description,
            category,
            duration: duration || '',
            videoUrl: chunkData.videoUrl,
            useSubcollection: false,
            published,
            createdBy: user.uid,
            updatedAt: new Date().toISOString(),
          }
          
          // Add thumbnail if provided
          if (thumbnailChunkData.thumbnailUrl) {
            videoData.thumbnailUrl = thumbnailChunkData.thumbnailUrl
          }
          
          // Only add createdAt when creating new video
          if (!editingVideo) {
            videoData.createdAt = new Date().toISOString()
          }
          
          if (editingVideo) {
            // Delete old chunks if they exist (in case video was previously chunked)
            await deleteChunksFromSubcollection(db, editingVideo.id)
            await updateDoc(doc(db, 'videos', editingVideo.id), videoData)
            toast.success('Video updated successfully!')
          } else {
            await addDoc(collection(db, 'videos'), videoData)
            toast.success('Video added successfully!')
          }
        }
      } else {
        // Regular URL (not base64), store normally
        const videoData: any = {
          title,
          description,
          category,
          duration: duration || '',
          videoUrl: videoUrl.trim(),
          useSubcollection: false,
          published,
          createdBy: user.uid,
          updatedAt: new Date().toISOString(),
        }
        
        // Add thumbnail if provided
        if (thumbnailUrl && thumbnailUrl.trim()) {
          videoData.thumbnailUrl = thumbnailUrl.trim()
        }
        
        // Only add createdAt when creating new video
        if (!editingVideo) {
          videoData.createdAt = new Date().toISOString()
        }

        if (editingVideo) {
          // Delete old chunks if they exist (in case video was previously chunked)
          await deleteChunksFromSubcollection(db, editingVideo.id)
          await updateDoc(doc(db, 'videos', editingVideo.id), videoData)
          toast.success('Video updated successfully!')
        } else {
          await addDoc(collection(db, 'videos'), videoData)
          toast.success('Video added successfully!')
        }
      }
      
      resetForm()
      onUpdate()
    } catch (error: any) {
      console.error('Error saving video:', error)
      // Show more detailed error message
      const errorMessage = error.message || 'Unknown error occurred'
      if (errorMessage.includes('size') || errorMessage.includes('too large') || errorMessage.includes('longer than')) {
        toast.error(`Video file is too large: ${errorMessage}. Please try a smaller video file.`)
      } else if (errorMessage.includes('permission') || errorMessage.includes('permissions-denied')) {
        toast.error('Permission denied. Please check your Firestore rules.')
      } else {
        toast.error(`Error saving video: ${errorMessage}`)
      }
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      // Delete chunks from subcollection if they exist
      await deleteChunksFromSubcollection(db, videoId)
      // Delete the main video document
      await deleteDoc(doc(db, 'videos', videoId))
      toast.success('Video deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting video:', error)
      toast.error('Error deleting video')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading videos...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowUpload(!showUpload)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showUpload ? 'Cancel' : 'Add New Video'}
      </button>

      {showUpload && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingVideo ? 'Edit Video' : 'Add Video'}
          </h2>
          <p className="text-gray-300 text-sm mb-4">
            Upload video files from your device or paste video URLs. Large videos are automatically chunked for Firestore storage (max 5MB per video).
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                placeholder="Enter video title"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                rows={3}
                placeholder="Enter video description"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              >
                <option value="fat-loss">Fat Loss</option>
                <option value="gain-muscle">Gain Muscle</option>
                <option value="weight-gain">Weight Gain</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Duration (e.g., 10:30)</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                placeholder="10:30"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Video *</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileUpload}
                      disabled={uploadingVideo}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingVideo ? 'Uploading...' : 'Upload Video File'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value)
                      setVideoPreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                    placeholder="Paste video URL here"
                  />
                </div>
                {videoPreview && (
                  <div className="mt-2">
                    <video src={videoPreview} controls className="w-full max-h-48 rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Video preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload video file (max 5MB) or paste URL</p>
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Thumbnail</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailFileUpload}
                      disabled={uploadingThumbnail}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value)
                      setThumbnailPreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                    placeholder="Paste thumbnail URL"
                  />
                </div>
                {thumbnailPreview && (
                  <div className="mt-2">
                    <img src={thumbnailPreview} alt="Thumbnail preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Thumbnail preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload image file (max 500KB) or paste URL</p>
              </div>
            </div>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500"
                />
                <span className="text-white">Published</span>
              </label>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
            >
              {editingVideo ? 'Update Video' : 'Add Video'}
            </button>
          </form>
        </div>
      )}

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
                <FaVideo className="w-12 h-12 text-white opacity-50" />
              </div>
            )}
            <h3 className="text-lg font-bold text-white mb-2">{video.title}</h3>
            <p className="text-gray-300 text-sm mb-2 line-clamp-2">{video.description}</p>
            <p className="text-purple-300 text-xs mb-2">Category: {video.category}</p>
            <p className="text-gray-400 text-xs mb-2">
              Status: {video.published !== false ? 'Published' : 'Draft'}
            </p>
            {video.videoUrl && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 text-xs mb-4 block hover:underline"
              >
                View Video →
              </a>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingVideo(video)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgramsTab({ programs, loading, onUpdate }: { programs: Program[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [level, setLevel] = useState('Beginner')
  const [type, setType] = useState('Strength')
  const [tags, setTags] = useState('')
  const [picture, setPicture] = useState('')
  const [icon, setIcon] = useState('dumbbell')
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [picturePreview, setPicturePreview] = useState<string>('')

  useEffect(() => {
    if (editingProgram) {
      setTitle(editingProgram.title)
      setSlug(editingProgram.slug)
      setDescription(editingProgram.description)
      setDifficulty(editingProgram.difficulty || 'Beginner')
      setLevel(editingProgram.level || 'Beginner')
      setType(editingProgram.type || 'Strength')
      setTags(editingProgram.tags?.join(', ') || '')
      setPicture(editingProgram.picture || '')
      setIcon(editingProgram.icon || 'dumbbell')
      setShowAdd(true)
    }
  }, [editingProgram])

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setDescription('')
    setDifficulty('Beginner')
    setLevel('Beginner')
    setType('Strength')
    setTags('')
    setPicture('')
    setIcon('dumbbell')
    setEditingProgram(null)
    setShowAdd(false)
    setPicturePreview('')
  }

  const handlePictureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    setUploadingPicture(true)
    try {
      const result = await fileToBase64(file, 10)
      setPicture(result.dataUrl)
      setPicturePreview(result.dataUrl)
      toast.success(`Image uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingPicture(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const programData = {
        title,
        slug,
        description,
        difficulty,
        level,
        type,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        picture: picture.trim() || '',
        icon,
      }

      if (editingProgram) {
        await updateDoc(doc(db, 'programs', editingProgram.id), programData)
        toast.success('Program updated')
      } else {
        await addDoc(collection(db, 'programs'), programData)
        toast.success('Program added')
      }
      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving program:', error)
      toast.error('Error saving program')
    }
  }

  const handleDelete = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      await deleteDoc(doc(db, 'programs', programId))
      toast.success('Program deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting program:', error)
      toast.error('Error deleting program')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading programs...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowAdd(!showAdd)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Program'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingProgram ? 'Edit Program' : 'Add Program'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass text-white"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-white mb-2">Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass text-white"
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Type</label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                placeholder="e.g., Strength, Cardio, Flexibility"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Picture</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePictureFileUpload}
                      disabled={uploadingPicture}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingPicture ? 'Uploading...' : 'Upload Image'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={picture}
                    onChange={(e) => {
                      setPicture(e.target.value)
                      setPicturePreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white"
                    placeholder="Paste image URL"
                  />
                </div>
                {picturePreview && (
                  <div className="mt-2">
                    <img src={picturePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Image preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload image file (max 500KB) or paste URL</p>
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Icon</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
              >
                <option value="dumbbell">Dumbbell</option>
                <option value="running">Running</option>
                <option value="fire">Fire</option>
                <option value="weight">Weight</option>
              </select>
            </div>
            <div>
              <label className="block text-white mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                placeholder="Strength, Cardio"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
            >
              {editingProgram ? 'Update Program' : 'Add Program'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="glass-card p-6 rounded-xl">
            {program.picture && (
              <img
                src={program.picture}
                alt={program.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{program.description}</p>
            <p className="text-purple-300 text-xs mb-2">Difficulty: {program.difficulty || program.level}</p>
            <p className="text-purple-300 text-xs mb-2">Type: {program.type}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {program.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded glass text-white text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProgram(program)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(program.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CoachesTab({ coaches, loading, onUpdate }: { coaches: Coach[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingCoach, setEditingCoach] = useState<Coach | null>(null)
  const [name, setName] = useState('')
  const [yearsExperience, setYearsExperience] = useState(0)
  const [bio, setBio] = useState('')
  const [image, setImage] = useState('')
  const [badges, setBadges] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (editingCoach) {
      setName(editingCoach.name)
      setYearsExperience(editingCoach.yearsExperience)
      setBio(editingCoach.bio)
      setImage(editingCoach.image)
      setBadges(editingCoach.badges.join(', '))
      setShowAdd(true)
    }
  }, [editingCoach])

  const resetForm = () => {
    setName('')
    setYearsExperience(0)
    setBio('')
    setImage('')
    setBadges('')
    setEditingCoach(null)
    setShowAdd(false)
    setImagePreview('')
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    setUploadingImage(true)
    try {
      const result = await fileToBase64(file, 10)
      setImage(result.dataUrl)
      setImagePreview(result.dataUrl)
      toast.success(`Image uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const coachData = {
        name,
        yearsExperience,
        bio,
        image: image.trim(),
        badges: badges.split(',').map((b) => b.trim()).filter(Boolean),
      }

      if (editingCoach) {
        await updateDoc(doc(db, 'coaches', editingCoach.id), coachData)
        toast.success('Coach updated')
      } else {
        await addDoc(collection(db, 'coaches'), coachData)
        toast.success('Coach added')
      }
      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving coach:', error)
      toast.error('Error saving coach')
    }
  }

  const handleDelete = async (coachId: string) => {
    if (!confirm('Are you sure you want to delete this coach?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      await deleteDoc(doc(db, 'coaches', coachId))
      toast.success('Coach deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting coach:', error)
      toast.error('Error deleting coach')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading coaches...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowAdd(!showAdd)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Coach'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingCoach ? 'Edit Coach' : 'Add Coach'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Years of Experience</label>
              <input
                type="number"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Image</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => {
                      setImage(e.target.value)
                      setImagePreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white"
                    placeholder="Paste image URL"
                    required
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Image preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload image file (max 500KB) or paste URL</p>
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Badges (comma-separated)</label>
              <input
                type="text"
                value={badges}
                onChange={(e) => setBadges(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                placeholder="Certified Trainer, Strength Expert"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
            >
              {editingCoach ? 'Update Coach' : 'Add Coach'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coaches.map((coach) => (
          <div key={coach.id} className="glass-card p-6 rounded-xl">
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
            <div className="flex flex-wrap gap-2 mb-4">
              {coach.badges.map((badge) => (
                <span key={badge} className="px-2 py-1 rounded glass text-white text-xs">
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCoach(coach)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(coach.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function EventsTab({ events, loading, onUpdate }: { events: Event[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title)
      setDescription(editingEvent.description)
      setDate(editingEvent.date)
      setTime(editingEvent.time || '')
      setLocation(editingEvent.location || '')
      setImageUrl(editingEvent.imageUrl || '')
      setShowAdd(true)
    }
  }, [editingEvent])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setTime('')
    setLocation('')
    setImageUrl('')
    setEditingEvent(null)
    setShowAdd(false)
    setImagePreview('')
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    setUploadingImage(true)
    try {
      const result = await fileToBase64(file, 10)
      setImageUrl(result.dataUrl)
      setImagePreview(result.dataUrl)
      toast.success(`Image uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const eventData = {
        title,
        description,
        date,
        time: time.trim() || '',
        location: location.trim() || '',
        imageUrl: imageUrl.trim() || '',
      }

      if (editingEvent) {
        await updateDoc(doc(db, 'events', editingEvent.id), eventData)
        toast.success('Event updated')
      } else {
        await addDoc(collection(db, 'events'), eventData)
        toast.success('Event added')
      }
      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Error saving event')
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      await deleteDoc(doc(db, 'events', eventId))
      toast.success('Event deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Error deleting event')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading events...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowAdd(!showAdd)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Event'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingEvent ? 'Edit Event' : 'Add Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-white mb-2">Time (optional)</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg glass text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-white mb-2">Location (optional)</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Image (optional)</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImagePreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white"
                    placeholder="Paste image URL"
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Image preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload image file (max 500KB) or paste URL</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
            >
              {editingEvent ? 'Update Event' : 'Add Event'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="glass-card p-6 rounded-xl">
            {event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{event.description}</p>
            <p className="text-purple-300 text-xs mb-2">Date: {new Date(event.date).toLocaleDateString()}</p>
            {event.time && <p className="text-purple-300 text-xs mb-2">Time: {event.time}</p>}
            {event.location && <p className="text-purple-300 text-xs mb-2">Location: {event.location}</p>}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setEditingEvent(event)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function WhyJoinUsTab({ whyJoinUs, loading, onUpdate }: { whyJoinUs: WhyJoinUs[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingItem, setEditingItem] = useState<WhyJoinUs | null>(null)
  const [title, setTitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title)
      setImageUrl(editingItem.imageUrl)
      setShowAdd(true)
    }
  }, [editingItem])

  const resetForm = () => {
    setTitle('')
    setImageUrl('')
    setEditingItem(null)
    setShowAdd(false)
    setImagePreview('')
  }

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    setUploadingImage(true)
    try {
      const result = await fileToBase64(file, 10)
      setImageUrl(result.dataUrl)
      setImagePreview(result.dataUrl)
      toast.success(`Image uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const itemData = {
        title,
        imageUrl: imageUrl.trim(),
      }

      if (editingItem) {
        await updateDoc(doc(db, 'whyJoinUs', editingItem.id), itemData)
        toast.success('Item updated')
      } else {
        await addDoc(collection(db, 'whyJoinUs'), itemData)
        toast.success('Item added')
      }
      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving item:', error)
      toast.error('Error saving item')
    }
  }

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      await deleteDoc(doc(db, 'whyJoinUs', itemId))
      toast.success('Item deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting item:', error)
      toast.error('Error deleting item')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading items...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowAdd(!showAdd)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Item'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingItem ? 'Edit Item' : 'Add Item'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Image</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                    <div className="px-4 py-2 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                      <FaUpload />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </div>
                  </label>
                  <span className="text-gray-400 text-sm">OR</span>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => {
                      setImageUrl(e.target.value)
                      setImagePreview('')
                    }}
                    className="flex-1 px-4 py-2 rounded-lg glass text-white"
                    placeholder="Paste image URL"
                    required
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs mt-1">Image preview</p>
                  </div>
                )}
                <p className="text-gray-400 text-xs">Upload image file (max 500KB) or paste URL</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
            >
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whyJoinUs.map((item) => (
          <div key={item.id} className="glass-card p-6 rounded-xl">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setEditingItem(item)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CompetitionsTab({ competitions, loading, onUpdate }: { competitions: Competition[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    if (editingCompetition) {
      setTitle(editingCompetition.title)
      setDescription(editingCompetition.description)
      setDate(editingCompetition.date)
      setShowAdd(true)
    }
  }, [editingCompetition])

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setEditingCompetition(null)
    setShowAdd(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      const competitionData = {
        title,
        description,
        date,
      }

      if (editingCompetition) {
        await updateDoc(doc(db, 'competitions', editingCompetition.id), competitionData)
        toast.success('Competition updated')
      } else {
        await addDoc(collection(db, 'competitions'), competitionData)
        toast.success('Competition added')
      }
      resetForm()
      onUpdate()
    } catch (error) {
      console.error('Error saving competition:', error)
      toast.error('Error saving competition')
    }
  }

  const handleDelete = async (competitionId: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
      await deleteDoc(doc(db, 'competitions', competitionId))
      toast.success('Competition deleted')
      onUpdate()
    } catch (error) {
      console.error('Error deleting competition:', error)
      toast.error('Error deleting competition')
    }
  }

  if (loading) {
    return <div className="text-white text-center py-8">Loading competitions...</div>
  }

  return (
    <div>
      <button
        onClick={() => {
          resetForm()
          setShowAdd(!showAdd)
        }}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Competition'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {editingCompetition ? 'Edit Competition' : 'Add Competition'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                placeholder="e.g., 50 pull ups in 1 min"
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-white mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
            >
              {editingCompetition ? 'Update Competition' : 'Add Competition'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {competitions.map((competition) => (
          <div key={competition.id} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">{competition.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{competition.description}</p>
            <p className="text-purple-300 text-xs mb-4">
              📅 {new Date(competition.date).toLocaleDateString()}
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingCompetition(competition)}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaEdit className="inline mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(competition.id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
              >
                <FaTrash className="inline mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
