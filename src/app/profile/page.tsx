'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { doc, updateDoc, getDoc, collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { FaUpload } from 'react-icons/fa'
import { fileToBase64, isImageFile, formatFileSize } from '@/lib/fileUtils'

interface Program {
  id: string
  title: string
  slug: string
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}

function ProfileContent() {
  const { user, userData, refreshUserData } = useAuth()
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [goals, setGoals] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [picturePreview, setPicturePreview] = useState<string>('')

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!db) return
      try {
        const programsSnapshot = await getDocs(collection(db, 'programs'))
        const programsData = programsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Program[]
        setPrograms(programsData)
      } catch (error) {
        console.error('Error fetching programs:', error)
      }
    }
    fetchPrograms()
  }, [])

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '')
      setBio(userData.bio || '')
      setGoals(userData.goals || '')
      setProfilePicture(userData.profilePicture || '')
      setSelectedPrograms(userData.selectedPrograms || [])
      setLoading(false)
    }
  }, [userData])

  const handlePictureFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file)) {
      toast.error('Please select an image file')
      return
    }

    setUploadingPicture(true)
    try {
      const result = await fileToBase64(file, 10) // 10MB max for images
      setProfilePicture(result.dataUrl)
      setPicturePreview(result.dataUrl)
      toast.success(`Profile picture uploaded: ${formatFileSize(result.fileSize)}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture')
    } finally {
      setUploadingPicture(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) return

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        displayName,
        bio,
        goals,
        profilePicture: profilePicture.trim(),
        selectedPrograms,
        updatedAt: new Date().toISOString(),
      })
      await refreshUserData()
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-white text-xl relative z-10">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
            <div className="relative z-10 mt-2">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 rounded-full glass-card text-purple-300 text-sm font-semibold backdrop-blur-xl border border-purple-500/30">
                  Profile Settings
                </span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Edit Profile
                </span>
              </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center space-x-6 mb-6">
                {(profilePicture || picturePreview) ? (
                  <img
                    src={picturePreview || profilePicture}
                    alt={displayName || 'Profile'}
                    className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-purple-500"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling!.classList.remove('hidden')
                    }}
                  />
                ) : null}
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg ${(profilePicture || picturePreview) ? 'hidden' : ''}`}>
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-white font-medium">Profile Picture</p>
                  <p className="text-gray-400 text-sm">Upload an image or paste a URL</p>
                </div>
              </div>

              {/* Profile Picture Upload */}
              <div>
                <label htmlFor="profilePicture" className="block text-sm font-medium text-white mb-2">
                  Profile Picture
                </label>
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
                      <div className="px-4 py-3 rounded-lg glass text-white hover:bg-purple-500/50 transition-colors flex items-center justify-center gap-2">
                        <FaUpload />
                        {uploadingPicture ? 'Uploading...' : 'Upload Image'}
                      </div>
                    </label>
                    <span className="text-gray-400 text-sm">OR</span>
                    <input
                      id="profilePicture"
                      type="url"
                      value={profilePicture}
                      onChange={(e) => {
                        setProfilePicture(e.target.value)
                        setPicturePreview('')
                      }}
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Paste image URL"
                    />
                  </div>
                  {picturePreview && (
                    <div className="mt-2">
                      <img src={picturePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-2 border-purple-500" />
                      <p className="text-gray-400 text-xs mt-1">Preview</p>
                    </div>
                  )}
                  <p className="text-gray-400 text-xs">Upload image file (max 10MB) or paste URL</p>
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-white mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Goals */}
              <div>
                <label htmlFor="goals" className="block text-sm font-medium text-white mb-2">
                  Fitness Goals
                </label>
                <textarea
                  id="goals"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="What are your fitness goals?"
                />
              </div>

              {/* Selected Programs */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Selected Programs
                </label>
                {programs.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {programs.map((program) => (
                      <label
                        key={program.id}
                        className="flex items-center space-x-2 cursor-pointer glass-card p-3 rounded-lg hover:bg-purple-500/20 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPrograms.includes(program.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPrograms([...selectedPrograms, program.id])
                            } else {
                              setSelectedPrograms(selectedPrograms.filter((p) => p !== program.id))
                            }
                          }}
                          className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm">{program.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No programs available. Please add programs from the admin page.</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
              >
                Save Changes
              </button>
            </form>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

