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
import { FaUser, FaVideo, FaFolder, FaCheck, FaTimes, FaTrash } from 'react-icons/fa'

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
}

interface Program {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  difficulty?: string
  tags?: string[]
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminContent />
    </ProtectedRoute>
  )
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState<'users' | 'videos' | 'programs'>('users')
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
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
        const videosSnapshot = await getDocs(collection(db, 'videos'))
        setVideos(videosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Video)))
      } else if (activeTab === 'programs') {
        const programsSnapshot = await getDocs(collection(db, 'programs'))
        setPrograms(programsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Program)))
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
            <div className="flex space-x-4">
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
            </div>
          </motion.div>

          {activeTab === 'users' && <UsersTab users={users} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'videos' && <VideosTab videos={videos} loading={loading} onUpdate={fetchData} />}
          {activeTab === 'programs' && <ProgramsTab programs={programs} loading={loading} onUpdate={fetchData} />}
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
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('fat-loss')
  const [duration, setDuration] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const { user } = useAuth()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) {
      toast.error('Firebase is not initialized')
      return
    }

    if (!videoUrl) {
      toast.error('Please provide a video URL')
      return
    }

    try {
      // Save video metadata with URLs
      await addDoc(collection(db, 'videos'), {
        title,
        description,
        category,
        duration,
        videoUrl: videoUrl.trim(),
        thumbnailUrl: thumbnailUrl.trim() || '',
        published: true,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
      })

      toast.success('Video added successfully!')
      setShowUpload(false)
      setTitle('')
      setDescription('')
      setCategory('fat-loss')
      setDuration('')
      setVideoUrl('')
      setThumbnailUrl('')
      onUpdate()
    } catch (error) {
      console.error('Error adding video:', error)
      toast.error('Error adding video')
    }
  }

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    try {
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
        onClick={() => setShowUpload(!showUpload)}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showUpload ? 'Cancel' : 'Add New Video'}
      </button>

      {showUpload && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Add Video</h2>
          <p className="text-gray-300 text-sm mb-4">
            Enter video URLs from YouTube, Vimeo, or any video hosting service.
          </p>
          <form onSubmit={handleUpload} className="space-y-4">
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
              <label className="block text-white mb-2">Video URL *</label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                required
              />
              <p className="text-gray-400 text-xs mt-1">Paste the full video URL here</p>
            </div>
            <div>
              <label className="block text-white mb-2">Thumbnail URL (optional)</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400"
                placeholder="https://example.com/thumbnail.jpg"
              />
              <p className="text-gray-400 text-xs mt-1">Paste thumbnail image URL (optional)</p>
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
            >
              Add Video
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
            <button
              onClick={() => handleDelete(video.id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
            >
              <FaTrash className="inline mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgramsTab({ programs, loading, onUpdate }: { programs: Program[]; loading: boolean; onUpdate: () => void }) {
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState('Beginner')
  const [tags, setTags] = useState('')

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }
    try {
      await addDoc(collection(db, 'programs'), {
        title,
        slug,
        description,
        difficulty,
        tags: tags.split(',').map((t) => t.trim()),
        icon: 'dumbbell',
      })
      toast.success('Program added')
      setShowAdd(false)
      setTitle('')
      setSlug('')
      setDescription('')
      setDifficulty('Beginner')
      setTags('')
      onUpdate()
    } catch (error) {
      console.error('Error adding program:', error)
      toast.error('Error adding program')
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
        onClick={() => setShowAdd(!showAdd)}
        className="mb-6 px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
      >
        {showAdd ? 'Cancel' : 'Add New Program'}
      </button>

      {showAdd && (
        <div className="glass-card p-6 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Add Program</h2>
          <form onSubmit={handleAdd} className="space-y-4">
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
              Add Program
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="glass-card p-6 rounded-xl">
            <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
            <p className="text-gray-300 text-sm mb-4">{program.description}</p>
            <p className="text-purple-300 text-xs mb-2">Difficulty: {program.difficulty}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {program.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded glass text-white text-xs">
                  {tag}
                </span>
              ))}
            </div>
            <button
              onClick={() => handleDelete(program.id)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm hover:scale-105 transition-transform"
            >
              <FaTrash className="inline mr-2" />
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

