'use client'

import React from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AnimatedBackground from '@/components/layout/AnimatedBackground'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            {/* Decorative gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
            <div className="relative z-10 mt-2">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <span className="px-4 py-2 rounded-full glass-card text-purple-300 text-sm font-semibold backdrop-blur-xl border border-purple-500/30">
                  Legal Information
                </span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8">
                <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Privacy Policy
                </span>
              </h1>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us, including your name, email address, 
                  profile photo, fitness goals, and program preferences when you create an account or update your profile.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to provide, maintain, and improve our services, 
                  process your transactions, send you technical notices, and respond to your inquiries.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. 
                  However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Your Rights</h2>
                <p>
                  You have the right to access, update, or delete your personal information at any time 
                  through your account settings or by contacting us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at privacy@progym.com
                </p>
              </section>
            </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

