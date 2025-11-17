'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Bubble {
  id: number
  size: number
  x: number
  y: number
  duration: number
  delay: number
  color: string
  initialY: number
  randomX: number
}

export default function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Generate random bubbles
    const colors = [
      'rgba(141, 66, 251, 0.6)', // neon-purple - more visible
      'rgba(255, 51, 102, 0.6)', // neon-pink
      'rgba(59, 130, 246, 0.6)', // neon-blue
      'rgba(6, 182, 212, 0.6)', // neon-cyan
    ]

    const newBubbles: Bubble[] = []
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        size: Math.random() * 120 + 80, // 80-200px - larger bubbles
        x: Math.random() * 100, // 0-100%
        y: Math.random() * 100, // 0-100%
        initialY: Math.random() * 100,
        randomX: Math.random() * 60 - 30, // -30 to 30
        duration: Math.random() * 25 + 20, // 20-45 seconds
        delay: Math.random() * 3, // 0-3 seconds
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    setBubbles(newBubbles)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.x}%`,
            top: `${bubble.initialY}%`,
            background: `radial-gradient(circle, ${bubble.color} 0%, transparent 60%)`,
            filter: 'blur(40px)',
            boxShadow: `0 0 ${bubble.size * 0.8}px ${bubble.color}`,
          }}
          initial={{ 
            y: 0, 
            x: 0,
            opacity: 0.2,
            scale: 0.8 
          }}
          animate={{
            y: [-bubble.size * 2, -bubble.size * 4],
            x: [0, bubble.randomX],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Additional smaller particles */}
      {Array.from({ length: 25 }).map((_, i) => {
        const size = Math.random() * 10 + 6 // 6-16px
        const randomX = Math.random() * 80 - 40 // -40 to 40
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `rgba(141, 66, 251, ${Math.random() * 0.5 + 0.3})`,
              boxShadow: `0 0 ${size * 2}px rgba(141, 66, 251, 0.6)`,
            }}
            initial={{ 
              y: 0, 
              x: 0,
              opacity: 0 
            }}
            animate={{
              y: [-300, -600],
              x: [0, randomX],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              delay: Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )
      })}
    </div>
  )
}

