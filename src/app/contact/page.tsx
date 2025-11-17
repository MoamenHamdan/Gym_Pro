'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/lib/auth'
import { toast } from 'react-hot-toast'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa'

export default function ContactPage() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please log in to send a message')
      return
    }
    
    if (!db) {
      toast.error('Firebase is not initialized')
      return
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)
    try {
      const messageData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'No Subject',
        message: formData.message.trim(),
        userId: user.uid,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      
      await addDoc(collection(db, 'messages'), messageData)

      toast.success('Message sent successfully! We will get back to you soon.')
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error sending message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <main className="min-h-screen bg-charcoal relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <span className="px-6 py-3 rounded-full glass-3d text-neon-purple text-sm font-bold tracking-wider uppercase border border-neon-purple/40 shadow-neon-purple">
                Get in Touch
              </span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              <span className="text-gradient-neon">
                Contact Us
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Have a question or feedback? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <FaEnvelope className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <p className="text-gray-300 text-sm">support@progym.com</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <FaPhone className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <FaMapMarkerAlt className="w-6 h-6 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Address</h3>
                    <p className="text-gray-300 text-sm">123 Fitness Street, Gym City, GC 12345</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-8 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                {!user && (
                  <div className="mb-6 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 text-sm">
                    Please log in to send a message. <a href="/login" className="underline hover:text-yellow-100">Log in here</a>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="What's this about?"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Your message..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !user}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

