'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'

interface Coach {
  id: string
  name: string
  yearsExperience: number
  bio: string
  image: string
  badges: string[]
}

interface Testimonial {
  id: string
  name: string
  rating: number
  text: string
  image?: string
}

const defaultCoaches: Coach[] = [
  {
    id: '1',
    name: 'John Smith',
    yearsExperience: 10,
    bio: 'Certified personal trainer with expertise in strength training and bodybuilding.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    badges: ['Certified Trainer', 'Strength Expert'],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    yearsExperience: 8,
    bio: 'Specialized in cardio and weight loss programs. Helping clients achieve their fitness goals.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400',
    badges: ['Cardio Expert', 'Nutrition Coach'],
  },
  {
    id: '3',
    name: 'Mike Davis',
    yearsExperience: 12,
    bio: 'Former athlete turned trainer. Expert in functional training and mobility.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    badges: ['Functional Training', 'Athletic Performance'],
  },
  {
    id: '4',
    name: 'Emily Wilson',
    yearsExperience: 6,
    bio: 'Yoga and flexibility instructor. Focuses on holistic wellness and mind-body connection.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    badges: ['Yoga Instructor', 'Wellness Coach'],
  },
]

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ahmed Ali',
    rating: 5,
    text: 'ProGym has transformed my life! The trainers are amazing and the facilities are top-notch.',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    rating: 5,
    text: 'Best gym I\'ve ever been to. The programs are well-structured and the community is supportive.',
  },
  {
    id: '3',
    name: 'David Lee',
    rating: 5,
    text: 'I\'ve achieved my fitness goals faster than I ever imagined. Highly recommended!',
  },
  {
    id: '4',
    name: 'Lisa Chen',
    rating: 5,
    text: 'The personal trainers are knowledgeable and the atmosphere is motivating.',
  },
]

export default function AboutPage() {
  const [coaches, setCoaches] = useState<Coach[]>(defaultCoaches)
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [coachScrollX, setCoachScrollX] = useState(0)
  const [testimonialScrollX, setTestimonialScrollX] = useState(0)

  const scrollCoaches = (direction: 'left' | 'right') => {
    const container = document.getElementById('coaches-container')
    if (container) {
      const scrollAmount = 300
      const newScrollX = direction === 'left' 
        ? coachScrollX - scrollAmount 
        : coachScrollX + scrollAmount
      container.scrollTo({ left: newScrollX, behavior: 'smooth' })
      setCoachScrollX(newScrollX)
    }
  }

  const scrollTestimonials = (direction: 'left' | 'right') => {
    const container = document.getElementById('testimonials-container')
    if (container) {
      const scrollAmount = 300
      const newScrollX = direction === 'left'
        ? testimonialScrollX - scrollAmount
        : testimonialScrollX + scrollAmount
      container.scrollTo({ left: newScrollX, behavior: 'smooth' })
      setTestimonialScrollX(newScrollX)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About ProGym</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We are dedicated to helping you achieve your fitness goals with expert coaches and world-class facilities.
            </p>
          </motion.div>

          {/* Coaches Section */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Coaches</h2>
            <div className="relative">
              <button
                onClick={() => scrollCoaches('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <div
                id="coaches-container"
                className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {coaches.map((coach) => (
                  <motion.div
                    key={coach.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80"
                  >
                    <div className="glass-card p-6 rounded-2xl h-full">
                      <img
                        src={coach.image}
                        alt={coach.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-bold text-white mb-2">{coach.name}</h3>
                      <p className="text-purple-300 text-sm mb-2">
                        {coach.yearsExperience} years of experience
                      </p>
                      <p className="text-gray-300 text-sm mb-4">{coach.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {coach.badges.map((badge) => (
                          <span
                            key={badge}
                            className="px-3 py-1 rounded-full glass text-white text-xs"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => scrollCoaches('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </section>

          {/* Testimonials Section */}
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Members Say</h2>
            <div className="relative">
              <button
                onClick={() => scrollTestimonials('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <div
                id="testimonials-container"
                className="flex space-x-6 overflow-x-auto scrollbar-hide py-4 px-12"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {testimonials.map((testimonial) => (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-80"
                  >
                    <div className="glass-card p-6 rounded-2xl h-full">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4">{testimonial.text}</p>
                      <p className="text-white font-semibold">- {testimonial.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button
                onClick={() => scrollTestimonials('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full glass-card flex items-center justify-center text-white hover:scale-110 transition-transform"
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  )
}

