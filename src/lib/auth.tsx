'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  refreshUserData: () => Promise<void>
}

interface UserData {
  displayName: string
  email: string
  role?: 'user' | 'admin'
  enrolledCategories?: string[]
  bio?: string
  goals?: string
  selectedPrograms?: string[]
  profilePicture?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (uid: string) => {
    if (!db) {
      console.error('Firebase Firestore is not initialized')
      return
    }
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData)
      } else {
        // Create user document if it doesn't exist
        const newUserData: UserData = {
          displayName: user?.displayName || '',
          email: user?.email || '',
          role: 'user',
          enrolledCategories: [],
        }
        await setDoc(doc(db, 'users', uid), newUserData)
        setUserData(newUserData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid)
    }
  }

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      if (user) {
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase is not initialized')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signup = async (email: string, password: string, displayName: string) => {
    if (!auth || !db) throw new Error('Firebase is not initialized')
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(userCredential.user, { displayName })
    
    // Create user document in Firestore
    const userData: UserData = {
      displayName,
      email,
      role: 'user',
      enrolledCategories: [],
    }
    await setDoc(doc(db, 'users', userCredential.user.uid), userData)
  }

  const logout = async () => {
    if (!auth) throw new Error('Firebase is not initialized')
    await signOut(auth)
    setUserData(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, login, signup, logout, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

