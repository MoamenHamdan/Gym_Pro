'use client'

import { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { FaUsers, FaVideo, FaTrophy, FaFire } from 'react-icons/fa'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Stat {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  color: string
}

export default function StatsBanner() {
  const [stats, setStats] = useState<Stat[]>([
    { icon: <FaUsers />, value: 0, label: 'Active Members', color: 'purple' },
    { icon: <FaVideo />, value: 0, label: 'Workout Videos', color: 'pink' },
    { icon: <FaTrophy />, value: 0, label: 'Competitions', color: 'blue' },
    { icon: <FaFire />, value: 0, label: 'Calories Burned', suffix: 'K', color: 'orange' },
  ])

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  // Fetch real data from database
  useEffect(() => {
    const fetchStats = async () => {
      if (!db) return

      try {
        // Fetch members count
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const membersCount = usersSnapshot.docs.length

        // Fetch videos count
        const videosSnapshot = await getDocs(collection(db, 'videos'))
        const videosCount = videosSnapshot.docs.length

        // Fetch competitions count (all competitions, past and future)
        const competitionsSnapshot = await getDocs(collection(db, 'competitions'))
        const competitionsCount = competitionsSnapshot.docs.length

        // Calories stays as default (1000K)
        const caloriesCount = 1000

        // Update stats with real values
        setStats([
          { icon: <FaUsers />, value: membersCount, label: 'Active Members', color: 'purple' },
          { icon: <FaVideo />, value: videosCount, label: 'Workout Videos', color: 'pink' },
          { icon: <FaTrophy />, value: competitionsCount, label: 'Competitions', color: 'blue' },
          { icon: <FaFire />, value: caloriesCount, label: 'Calories Burned', suffix: 'K', color: 'orange' },
        ])
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  // Animate numbers when in view
  useEffect(() => {
    if (isInView && stats.some(s => s.value > 0)) {
      stats.forEach((stat, index) => {
        const target = stat.value
        if (target === 0) return
        
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
          current += increment
          if (current >= target) {
            current = target
            clearInterval(timer)
          }
          
          setStats(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], value: Math.floor(current) }
            return updated
          })
        }, duration / steps)
      })
    }
  }, [isInView, stats.length])

  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    pink: 'from-pink-500 to-pink-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-blue-900/20"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent">
              Our Impact
            </span>
          </h2>
          <p className="text-xl text-gray-300">Numbers that speak for themselves</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="gym-card glass-card p-8 rounded-2xl text-center border border-white/10"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3, type: 'spring' }}
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${colorClasses[stat.color as keyof typeof colorClasses]} flex items-center justify-center text-white text-2xl shadow-lg`}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold text-white mb-2 count-up"
              >
                {stat.value.toLocaleString()}
                {stat.suffix && <span className="text-2xl">{stat.suffix}</span>}
              </motion.div>
              <p className="text-gray-300 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


