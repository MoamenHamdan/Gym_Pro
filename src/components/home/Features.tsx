'use client'

import { motion } from 'framer-motion'
import { FaUserTie, FaCalendarCheck, FaUsers, FaClock, FaHandsHelping } from 'react-icons/fa'

const features = [
  {
    icon: FaUserTie,
    title: 'Personal Trainer',
    description: 'Work with certified personal trainers who create customized workout plans for you.',
  },
  {
    icon: FaCalendarCheck,
    title: 'Practical Sessions',
    description: 'Hands-on training sessions with real-time feedback and corrections.',
  },
  {
    icon: FaUsers,
    title: 'Good Management',
    description: 'Well-organized facility with professional staff and efficient operations.',
  },
  {
    icon: FaClock,
    title: 'Flexible Hours',
    description: 'Train at your convenience with extended hours and flexible scheduling.',
  },
  {
    icon: FaHandsHelping,
    title: 'Community Support',
    description: 'Join a supportive community of fitness enthusiasts on the same journey.',
  },
]

export default function Features() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="glass-card p-6 rounded-2xl h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

