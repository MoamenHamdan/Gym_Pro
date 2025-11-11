'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'
import { FaDumbbell } from 'react-icons/fa'

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
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-dark backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl transition-shadow">
              <FaDumbbell className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ProGym</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-purple-300'
                    : 'text-white hover:text-purple-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Join Now / User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && userData?.role === 'admin' && (
              <Link
                href="/admin"
                className="text-sm font-medium text-white hover:text-purple-300 transition-colors"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleJoinClick}
              className="px-6 py-2.5 rounded-full glass-card text-white font-medium hover:scale-105 transition-transform"
            >
              {user ? `Hi, ${userData?.displayName || user.displayName || 'User'}` : 'Join Now'}
            </button>
            {user && (
              <button
                onClick={logout}
                className="text-sm text-white hover:text-purple-300 transition-colors"
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
          <div className="md:hidden py-4 space-y-4 glass-dark rounded-lg mt-2 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-medium ${
                  pathname === link.href
                    ? 'text-purple-300'
                    : 'text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user && userData?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-white"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => {
                handleJoinClick()
                setIsMobileMenuOpen(false)
              }}
              className="w-full mx-4 px-6 py-2.5 rounded-full glass-card text-white font-medium"
            >
              {user ? `Hi, ${userData?.displayName || 'User'}` : 'Join Now'}
            </button>
            {user && (
              <button
                onClick={() => {
                  logout()
                  setIsMobileMenuOpen(false)
                }}
                className="block px-4 py-2 text-sm font-medium text-white w-full text-left"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

