'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 md:p-12 rounded-3xl"
          >
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
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
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

