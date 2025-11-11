'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'

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
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userData) {
      setDisplayName(userData.displayName || '')
      setBio(userData.bio || '')
      setGoals(userData.goals || '')
      setSelectedPrograms(userData.selectedPrograms || [])
      setLoading(false)
    }
  }, [userData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) return

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        displayName,
        bio,
        goals,
        selectedPrograms,
        updatedAt: new Date().toISOString(),
      })
      await refreshUserData()
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error('Error updating profile: ' + error.message)
    }
  }

  const programs = ['Strength Training', 'Physical Fitness', 'Fat Loss', 'Weight Gain']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-12 rounded-3xl"
          >
            <h1 className="text-3xl font-bold text-white mb-8">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Avatar */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {displayName.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-white font-medium">Profile Avatar</p>
                  <p className="text-gray-400 text-sm">Initials based on your name</p>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {programs.map((program) => (
                    <label
                      key={program}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPrograms.includes(program)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPrograms([...selectedPrograms, program])
                          } else {
                            setSelectedPrograms(selectedPrograms.filter((p) => p !== program))
                          }
                        }}
                        className="w-4 h-4 rounded text-purple-500 focus:ring-purple-500"
                      />
                      <span className="text-white text-sm">{program}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform"
              >
                Save Changes
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

