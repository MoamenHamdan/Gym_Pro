'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { FaRobot, FaPaperPlane, FaUser } from 'react-icons/fa'
import MarkdownRenderer from '@/components/MarkdownRenderer'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  return (
    <ProtectedRoute>
      <ChatbotContent />
    </ProtectedRoute>
  )
}

function ChatbotContent() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your ProGym AI fitness assistant. I can help you with fitness questions, workout plans, nutrition advice, and gym-related topics. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error: any) {
      console.error('Error:', error)
      const errorMsg = error?.message || 'Failed to get response. Please try again.'
      toast.error(errorMsg)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorMsg}. Please check your API key configuration or try again later.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-3 rounded-full glass-3d text-neon-purple text-sm font-bold tracking-wider uppercase border border-neon-purple/40 shadow-neon-purple">
                🤖 AI Assistant
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="text-gradient-neon">
                Fitness AI Assistant
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Ask me anything about fitness, workouts, nutrition, and health!
            </p>
          </motion.div>

          {/* Chat Container with 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-3d rounded-3xl border border-white/10 overflow-hidden shadow-glass-lg card-3d"
          >
            {/* Messages Area */}
            <div className="h-[600px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-charcoal/80 to-charcoal/60 backdrop-blur-sm">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center flex-shrink-0 shadow-neon-purple border border-white/20"
                    >
                      <FaRobot className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[80%] rounded-2xl p-5 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple border border-white/20'
                        : 'glass-card text-gray-100 border border-white/10 shadow-lg'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">
                      <MarkdownRenderer content={message.content} />
                    </div>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </motion.div>
                  {message.role === 'user' && (
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-cyan flex items-center justify-center flex-shrink-0 shadow-neon-blue border border-white/20"
                    >
                      <FaUser className="w-6 h-6 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 justify-start"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue flex items-center justify-center flex-shrink-0 shadow-neon-purple border border-white/20"
                  >
                    <FaRobot className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="glass-card rounded-2xl p-5 border border-white/10 shadow-lg">
                    <div className="flex gap-2">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-3 h-3 bg-neon-purple rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-3 h-3 bg-neon-pink rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-3 h-3 bg-neon-blue rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-charcoal/80 backdrop-blur-sm">
              <div className="flex gap-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about fitness, workouts, nutrition..."
                  className="flex-1 px-6 py-4 rounded-2xl glass-card text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50 transition-all"
                  disabled={loading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary px-8 py-4 rounded-2xl text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <FaPaperPlane className="w-5 h-5" />
                  <span className="hidden sm:inline">Send</span>
                </motion.button>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center font-light">
                💡 Tip: Ask about workout plans, nutrition advice, exercise techniques, or fitness goals
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

