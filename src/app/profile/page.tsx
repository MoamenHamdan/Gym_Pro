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
      const result = await fileToBase64(file, 20) // 20MB max for images
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
      <div className="min-h-screen flex items-center justify-center bg-charcoal relative overflow-hidden">
        <AnimatedBackground />
        <div className="text-white text-xl relative z-10">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-3 rounded-full glass-3d text-neon-purple text-sm font-bold tracking-wider uppercase border border-neon-purple/40 shadow-neon-purple">
                👤 Your Dashboard
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              <span className="text-gradient-neon">Profile Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">Manage your profile and track your fitness journey</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Stats Cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-3d p-6 rounded-2xl border border-white/10 text-center"
              >
                {(profilePicture || picturePreview) ? (
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={picturePreview || profilePicture}
                    alt={displayName || 'Profile'}
                    className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-neon-purple/50 mx-auto mb-4"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-neon-purple/50 mx-auto mb-4">
                    {displayName.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white mb-2">{displayName || 'User'}</h2>
                <p className="text-gray-400 text-sm mb-4">{userData?.email || user?.email}</p>
                {selectedPrograms.length > 0 && (
                  <div className="mt-4">
                    <p className="text-gray-300 text-sm mb-2">Enrolled Programs:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedPrograms.slice(0, 2).map((progId) => {
                        const prog = programs.find(p => p.id === progId)
                        return prog ? (
                          <span key={progId} className="px-3 py-1 rounded-full glass-card text-neon-purple text-xs font-semibold border border-neon-purple/30">
                            {prog.title}
                          </span>
                        ) : null
                      })}
                      {selectedPrograms.length > 2 && (
                        <span className="px-3 py-1 rounded-full glass-card text-gray-400 text-xs">
                          +{selectedPrograms.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-3d p-6 rounded-2xl border border-white/10"
              >
                <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Programs</span>
                    <span className="text-neon-purple font-bold">{selectedPrograms.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-neon-pink font-bold">
                      {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).getFullYear() : '2024'}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Profile Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-3d p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden"
              >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-blue"></div>
                <div className="relative z-10 mt-2">
                  <h2 className="text-3xl font-extrabold text-white mb-8">
                    <span className="text-gradient-neon">Edit Profile</span>
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Profile Picture Upload */}
                    <div>
                      <label htmlFor="profilePicture" className="block text-sm font-semibold text-gray-300 mb-2">
                        Profile Picture
                      </label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePictureFileUpload}
                              disabled={uploadingPicture}
                              className="hidden"
                            />
                            <div className="px-5 py-3 rounded-xl glass-card text-white hover:bg-neon-purple/20 transition-colors flex items-center justify-center gap-2 border border-white/10 hover:border-neon-purple/50">
                              <FaUpload />
                              {uploadingPicture ? 'Uploading...' : 'Upload Image'}
                            </div>
                          </label>
                          <span className="text-gray-400 text-sm font-medium">OR</span>
                          <input
                            id="profilePicture"
                            type="url"
                            value={profilePicture}
                            onChange={(e) => {
                              setProfilePicture(e.target.value)
                              setPicturePreview('')
                            }}
                            className="flex-1 px-5 py-3 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                            placeholder="Paste image URL"
                          />
                        </div>
                        {picturePreview && (
                          <div className="mt-3">
                            <img src={picturePreview} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-neon-purple/50 shadow-lg" />
                            <p className="text-gray-400 text-xs mt-2">Preview</p>
                          </div>
                        )}
                        <p className="text-gray-400 text-xs font-light">Upload image file (max 20MB) or paste URL</p>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label htmlFor="displayName" className="block text-sm font-semibold text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                        required
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label htmlFor="bio" className="block text-sm font-semibold text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {/* Goals */}
                    <div>
                      <label htmlFor="goals" className="block text-sm font-semibold text-gray-300 mb-2">
                        Fitness Goals
                      </label>
                      <textarea
                        id="goals"
                        value={goals}
                        onChange={(e) => setGoals(e.target.value)}
                        rows={3}
                        className="w-full px-5 py-4 rounded-xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                        placeholder="What are your fitness goals?"
                      />
                    </div>

                    {/* Selected Programs */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-3">
                        Selected Programs
                      </label>
                      {programs.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {programs.map((program) => (
                            <label
                              key={program.id}
                              className="flex items-center space-x-3 cursor-pointer glass-card p-4 rounded-xl hover:bg-neon-purple/20 transition-colors border border-white/10 hover:border-neon-purple/50"
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
                                className="w-5 h-5 rounded text-neon-purple focus:ring-neon-purple focus:ring-2"
                              />
                              <span className="text-white text-sm font-medium">{program.title}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">No programs available. Please add programs from the admin page.</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 rounded-full btn-primary text-white font-bold relative overflow-hidden"
                    >
                      <span className="relative z-10">Save Changes</span>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

