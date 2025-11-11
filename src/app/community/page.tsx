'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { FaDiscord, FaCalendarAlt, FaUsers, FaTrophy } from 'react-icons/fa'

export default function CommunityPage() {
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 rounded-2xl"
            >
              <FaDiscord className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Discord Community</h2>
              <p className="text-gray-300 mb-6">
                Join our Discord server to connect with other members, share progress, and get support from the community.
              </p>
              <a
                href="#"
                className="px-6 py-3 rounded-full glass text-white font-medium hover:scale-105 transition-transform inline-block"
              >
                Join Discord
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 rounded-2xl"
            >
              <FaCalendarAlt className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Events & Workshops</h2>
              <p className="text-gray-300 mb-6">
                Participate in our regular events, workshops, and group training sessions to enhance your fitness journey.
              </p>
              <a
                href="#"
                className="px-6 py-3 rounded-full glass text-white font-medium hover:scale-105 transition-transform inline-block"
              >
                View Events
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-8 rounded-2xl"
            >
              <FaUsers className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Member Groups</h2>
              <p className="text-gray-300 mb-6">
                Join specialized groups based on your fitness goals and connect with members who share similar interests.
              </p>
              <a
                href="#"
                className="px-6 py-3 rounded-full glass text-white font-medium hover:scale-105 transition-transform inline-block"
              >
                Browse Groups
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-8 rounded-2xl"
            >
              <FaTrophy className="w-12 h-12 text-purple-400 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Challenges & Competitions</h2>
              <p className="text-gray-300 mb-6">
                Participate in fitness challenges and competitions to test your limits and win exciting prizes.
              </p>
              <a
                href="#"
                className="px-6 py-3 rounded-full glass text-white font-medium hover:scale-105 transition-transform inline-block"
              >
                View Challenges
              </a>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

