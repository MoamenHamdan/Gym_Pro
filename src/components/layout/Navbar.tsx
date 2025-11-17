'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'
import { FaDumbbell } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { user, userData, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleJoinClick = () => {
    if (user) {
      router.push('/profile')
    } else {
      router.push('/login')
    }
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/community', label: 'Community' },
    { href: '/contact', label: 'Contact' },
    { href: '/chatbot', label: 'AI Assistant' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-dark backdrop-blur-2xl border-b border-white/10 shadow-glass-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with 3D effect */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-3 rounded-xl bg-gradient-to-br from-neon-purple via-neon-pink to-neon-blue shadow-neon-purple group-hover:shadow-neon-pink transition-all duration-300"
            >
              <FaDumbbell className="w-6 h-6 text-white" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>
            <span className="text-2xl font-bold text-gradient-neon tracking-tight">
              ProGym
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm font-semibold transition-all duration-300 px-3 py-2 rounded-lg ${
                  pathname === link.href
                    ? 'text-neon-purple'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 glass-card rounded-lg border border-neon-purple/30"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                {pathname === link.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Join Now / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && userData?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 rounded-lg glass-card text-sm font-semibold text-white hover:text-neon-purple transition-all hover:border-neon-purple/50 border border-white/10"
              >
                Admin
              </Link>
            )}
            <motion.button
              onClick={handleJoinClick}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary px-6 py-2.5 rounded-full text-white font-bold text-sm relative overflow-hidden"
            >
              <span className="relative z-10">
                {user ? `Hi, ${userData?.displayName || user.displayName || 'User'}` : 'Join Now'}
              </span>
            </motion.button>
            {user && (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-2 glass-3d rounded-2xl mt-2 mb-4 border border-white/10"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-3 text-sm font-semibold rounded-lg transition-all ${
                  pathname === link.href
                    ? 'text-neon-purple bg-white/5 border border-neon-purple/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && userData?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                handleJoinClick()
                setIsMobileMenuOpen(false)
              }}
              className="w-full mx-4 px-6 py-3 rounded-full btn-primary text-white font-bold text-sm"
            >
              {user ? `Hi, ${userData?.displayName || 'User'}` : 'Join Now'}
            </button>
            {user && (
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg w-full text-left transition-all"
              >
                Logout
              </button>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  )
}

