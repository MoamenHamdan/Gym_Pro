'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { FaDiscord, FaCalendarAlt, FaUsers, FaTrophy, FaPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time?: string
  location?: string
  imageUrl?: string
}

interface Group {
  id: string
  name: string
  description: string
  createdBy: string
  createdByName?: string
  members: string[]
  score: number
}

interface Competition {
  id: string
  title: string
  description: string
  date: string
}

export default function CommunityPage() {
  return (
    <ProtectedRoute>
      <CommunityContent />
    </ProtectedRoute>
  )
}

function CommunityContent() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'discord' | 'events' | 'groups' | 'challenges'>('discord')
  const [events, setEvents] = useState<Event[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [groupDescription, setGroupDescription] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!db) {
      setLoading(false)
      return
    }
    try {
      // Fetch events
      const eventsSnapshot = await getDocs(collection(db, 'events'))
      const eventsData = eventsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((event) => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as Event[]
      setEvents(eventsData)

      // Fetch groups with member counts and scores
      const groupsSnapshot = await getDocs(collection(db, 'groups'))
      const groupsData = await Promise.all(
        groupsSnapshot.docs.map(async (doc) => {
          const groupData = doc.data() as Group
          const membersSnapshot = await getDocs(collection(db, 'groups', doc.id, 'members'))
          const memberIds = membersSnapshot.docs.map((m) => m.id)
          
          // Calculate score: member count + completed challenges
          let score = memberIds.length
          for (const memberId of memberIds) {
            const progressSnapshot = await getDocs(collection(db, 'users', memberId, 'progress'))
            const completedCount = progressSnapshot.docs.filter((p) => p.data().completed === true).length
            score += completedCount
          }

          return {
            id: doc.id,
            ...groupData,
            members: memberIds,
            score,
          }
        })
      )
      setGroups(groupsData.sort((a, b) => b.score - a.score))

      // Fetch competitions
      const competitionsSnapshot = await getDocs(collection(db, 'competitions'))
      const competitionsData = competitionsSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as Competition[]
      setCompetitions(competitionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !db) {
      toast.error('Please log in to create a group')
      return
    }

    try {
      await addDoc(collection(db, 'groups'), {
        name: groupName,
        description: groupDescription,
        createdBy: user.uid,
        createdByName: userData?.displayName || user.email,
        createdAt: new Date().toISOString(),
      })
      toast.success('Group created successfully!')
      setGroupName('')
      setGroupDescription('')
      setShowCreateGroup(false)
      fetchData()
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Error creating group')
    }
  }

  const handleJoinGroup = async (groupId: string) => {
    if (!user || !db) return

    try {
      await setDoc(doc(db, 'groups', groupId, 'members', user.uid), {
        joinedAt: new Date().toISOString(),
      })
      toast.success('Joined group successfully!')
      fetchData()
    } catch (error) {
      console.error('Error joining group:', error)
      toast.error('Error joining group')
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    if (!user || !db) return

    try {
      await deleteDoc(doc(db, 'groups', groupId, 'members', user.uid))
      toast.success('Left group successfully!')
      fetchData()
    } catch (error) {
      console.error('Error leaving group:', error)
      toast.error('Error leaving group')
    }
  }

  const isMemberOfGroup = (groupId: string) => {
    if (!user) return false
    const group = groups.find((g) => g.id === groupId)
    return group?.members.includes(user.uid) || false
  }

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Community</h1>
            <p className="text-xl text-gray-300">
              Join our fitness community and connect with like-minded individuals
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <button
              onClick={() => setActiveTab('discord')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'discord'
                  ? 'bg-purple-500 text-white'
                  : 'glass-card text-white hover:bg-purple-500/50'
              }`}
            >
              <FaDiscord className="inline mr-2" />
              Discord
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
              Events & Workshops
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'groups'
                  ? 'bg-purple-500 text-white'
                  : 'glass-card text-white hover:bg-purple-500/50'
              }`}
            >
              <FaUsers className="inline mr-2" />
              Member Groups
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'challenges'
                  ? 'bg-purple-500 text-white'
                  : 'glass-card text-white hover:bg-purple-500/50'
              }`}
            >
              <FaTrophy className="inline mr-2" />
              Challenges & Competitions
            </button>
          </div>

          {/* Discord Tab */}
          {activeTab === 'discord' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 rounded-2xl text-center"
            >
              <FaDiscord className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Discord Community</h2>
              <p className="text-gray-300 mb-6">
                Join our Discord server to connect with other members, share progress, and get support from the community.
              </p>
              <p className="text-gray-400 text-sm mb-4">
                {/* TODO: Add your Discord server invite link here */}
                Discord link: https://discord.gg/your-server-link
              </p>
              <a
                href="#"
                className="px-6 py-3 rounded-full glass text-white font-medium hover:scale-105 transition-transform inline-block"
                onClick={(e) => {
                  e.preventDefault()
                  toast.info('Add your Discord link in the code')
                }}
              >
                Join Discord
              </a>
            </motion.div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events & Workshops</h2>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6 rounded-2xl cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => router.push(`/community/event/${event.id}`)}
                    >
                      {event.imageUrl && (
                        <img
                          src={event.imageUrl}
                          alt={event.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{event.description}</p>
                      <p className="text-purple-300 text-xs mb-1">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </p>
                      {event.time && (
                        <p className="text-purple-300 text-xs mb-1">⏰ {event.time}</p>
                      )}
                      {event.location && (
                        <p className="text-purple-300 text-xs mb-4">📍 {event.location}</p>
                      )}
                      <button className="w-full px-4 py-2 rounded-lg glass text-white text-sm font-medium">
                        View Event
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8">No upcoming events. Check back soon!</p>
              )}
            </div>
          )}

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Member Groups</h2>
                {user && (
                  <button
                    onClick={() => setShowCreateGroup(!showCreateGroup)}
                    className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium hover:scale-105 transition-transform"
                  >
                    <FaPlus className="inline mr-2" />
                    Create Group
                  </button>
                )}
              </div>

              {showCreateGroup && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6 rounded-2xl mb-6"
                >
                  <h3 className="text-xl font-bold text-white mb-4">Create New Group</h3>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Group Name</label>
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg glass text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Description</label>
                      <textarea
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg glass text-white"
                        rows={3}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium"
                    >
                      Create Group
                    </button>
                  </form>
                </motion.div>
              )}

              {groups.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.map((group) => {
                    const isMember = isMemberOfGroup(group.id)
                    return (
                      <motion.div
                        key={group.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 rounded-2xl"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold text-white">{group.name}</h3>
                          <span className="px-3 py-1 rounded-full glass text-purple-300 text-xs font-medium">
                            Score: {group.score}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">{group.description}</p>
                        <p className="text-purple-300 text-xs mb-4">
                          👥 {group.members.length} members
                        </p>
                        {user && (
                          <button
                            onClick={() =>
                              isMember ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)
                            }
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-transform ${
                              isMember
                                ? 'bg-red-500 text-white hover:scale-105'
                                : 'bg-purple-500 text-white hover:scale-105'
                            }`}
                          >
                            {isMember ? (
                              <>
                                <FaSignOutAlt className="inline mr-2" />
                                Leave Group
                              </>
                            ) : (
                              <>
                                <FaSignInAlt className="inline mr-2" />
                                Join Group
                              </>
                            )}
                          </button>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-300 text-center py-8">No groups yet. Create the first one!</p>
              )}
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === 'challenges' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Winners</h2>
                <div className="glass-card p-6 rounded-2xl mb-6">
                  <h3 className="text-xl font-bold text-white mb-4">Top Groups</h3>
                  {groups.length > 0 ? (
                    <div className="space-y-4">
                      {groups.slice(0, 5).map((group, index) => (
                        <div
                          key={group.id}
                          className="flex items-center justify-between p-4 rounded-lg glass"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-purple-400 w-8">
                              #{index + 1}
                            </span>
                            <div>
                              <p className="text-white font-semibold">{group.name}</p>
                              <p className="text-gray-400 text-sm">{group.members.length} members</p>
                            </div>
                          </div>
                          <span className="text-purple-300 font-bold">Score: {group.score}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-300">No groups yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Competitions</h2>
                {competitions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {competitions.map((competition) => (
                      <motion.div
                        key={competition.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 rounded-2xl"
                      >
                        <h3 className="text-xl font-bold text-white mb-2">{competition.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{competition.description}</p>
                        <p className="text-purple-300 text-xs">
                          📅 {new Date(competition.date).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-300 text-center py-8">No competitions available yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
