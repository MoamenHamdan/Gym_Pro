'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'
import { FaDumbbell, FaRunning, FaFire, FaWeight } from 'react-icons/fa'
import Link from 'next/link'

interface Program {
  id: string
  title: string
  slug: string
  description: string
  icon: string
  difficulty?: string
  level?: string
  type?: string
  tags?: string[]
  picture?: string
}

const defaultPrograms: Program[] = [
  {
    id: '1',
    title: 'Strength Training',
    slug: 'strength',
    description: 'Build muscle and increase your strength with our comprehensive strength training program.',
    icon: 'dumbbell',
    difficulty: 'Intermediate',
    tags: ['Muscle', 'Strength'],
  },
  {
    id: '2',
    title: 'Physical Fitness',
    slug: 'fitness',
    description: 'Improve your overall physical fitness and endurance with varied workouts.',
    icon: 'running',
    difficulty: 'Beginner',
    tags: ['Cardio', 'Endurance'],
  },
  {
    id: '3',
    title: 'Fat Loss',
    slug: 'fat-loss',
    description: 'Burn calories and lose fat with our targeted fat loss program.',
    icon: 'fire',
    difficulty: 'Intermediate',
    tags: ['Weight Loss', 'Cardio'],
  },
  {
    id: '4',
    title: 'Weight Gain',
    slug: 'weight-gain',
    description: 'Gain healthy weight and build mass with our specialized weight gain program.',
    icon: 'weight',
    difficulty: 'Advanced',
    tags: ['Mass', 'Nutrition'],
  },
]

const iconMap: { [key: string]: React.ComponentType<any> } = {
  dumbbell: FaDumbbell,
  running: FaRunning,
  fire: FaFire,
  weight: FaWeight,
}

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>(defaultPrograms)

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!db) {
        console.error('Firebase Firestore is not initialized')
        return
      }
      try {
        const programsSnapshot = await getDocs(collection(db, 'programs'))
        const programsData = programsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Program[]
        // Only update if we have programs from database, otherwise keep defaults
        if (programsData.length > 0) {
          setPrograms(programsData)
        }
        // If database has programs, use them; otherwise keep default programs
      } catch (error) {
        console.error('Error fetching programs:', error)
        // Keep default programs on error
      }
    }
    fetchPrograms()
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Explore Our Programs
          </h2>
          <p className="text-xl text-gray-300">
            Choose the program that fits your fitness goals
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => {
            const IconComponent = iconMap[program.icon] || FaDumbbell
            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="glass-card p-6 rounded-2xl h-full flex flex-col overflow-hidden">
                  {program.picture ? (
                    <img
                      src={program.picture}
                      alt={program.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                      <IconComponent className="w-16 h-16 text-white opacity-80" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{program.title}</h3>
                  <p className="text-gray-300 text-sm mb-4 flex-grow">{program.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(program.level || program.difficulty) && (
                      <span className="px-3 py-1 rounded-full glass text-white text-xs font-medium">
                        {program.level || program.difficulty}
                      </span>
                    )}
                    {program.type && (
                      <span className="px-3 py-1 rounded-full glass text-purple-300 text-xs font-medium">
                        {program.type}
                      </span>
                    )}
                    {program.tags && program.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded glass text-white text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/services#${program.slug}`}
                    className="px-4 py-2 rounded-lg glass text-white text-sm font-medium hover:scale-105 transition-transform text-center"
                  >
                    View / Join
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

