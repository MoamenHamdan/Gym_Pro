'use client'

import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { motion } from 'framer-motion'

interface WhyJoinUs {
  id: string
  title: string
  imageUrl: string
}

export default function Features() {
  const [items, setItems] = useState<WhyJoinUs[]>([])

  useEffect(() => {
    const fetchWhyJoinUs = async () => {
      if (!db) {
        console.error('Firebase Firestore is not initialized')
        return
      }
      try {
        const snapshot = await getDocs(collection(db, 'whyJoinUs'))
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WhyJoinUs[]
        setItems(data)
      } catch (error) {
        console.error('Error fetching whyJoinUs:', error)
      }
    }
    fetchWhyJoinUs()
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
            Why Join Us
          </h2>
          <p className="text-xl text-gray-300">
            Discover what makes ProGym the best choice for your fitness journey
          </p>
        </motion.div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '💪',
                title: 'Personal Trainer',
                description: 'Work with certified personal trainers who create customized workout plans for you.',
              },
              {
                icon: '📅',
                title: 'Practical Sessions',
                description: 'Hands-on training sessions with real-time feedback and corrections.',
              },
              {
                icon: '👥',
                title: 'Good Management',
                description: 'Well-organized facility with professional staff and efficient operations.',
              },
              {
                icon: '⏰',
                title: 'Flexible Hours',
                description: 'Train at your convenience with extended hours and flexible scheduling.',
              },
              {
                icon: '🤝',
                title: 'Community Support',
                description: 'Join a supportive community of fitness enthusiasts on the same journey.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="glass-card p-6 rounded-2xl h-full">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
