'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase/firebase'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { profileService } from './services'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: (currentPassword: string) => Promise<void>
  updateUserSettings: (settings: UserSettings) => Promise<void>
  getUserSettings: () => Promise<UserSettings>
}

interface UserSettings {
  privacy: {
    shareData: boolean
    showProfile: boolean
    showActivity: boolean
    allowAnalytics: boolean
    allowCookies: boolean
  }
  notifications: {
    emailNotifications: boolean
    inAppNotifications: boolean
    weeklyDigest: boolean
    newFeatures: boolean
    securityAlerts: boolean
    marketingEmails: boolean
  }
  preferences: {
    language: string
  }
}

const defaultSettings: UserSettings = {
  privacy: {
    shareData: false,
    showProfile: true,
    showActivity: true,
    allowAnalytics: true,
    allowCookies: true,
  },
  notifications: {
    emailNotifications: true,
    inAppNotifications: true,
    weeklyDigest: true,
    newFeatures: true,
    securityAlerts: true,
    marketingEmails: false,
  },
  preferences: {
    language: 'en',
  },
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      // If a user signs in, ensure they have a profile
      if (user) {
        const profile = await profileService.get(user.uid)
        if (!profile) {
          await profileService.create({
            id: user.uid,
            email: user.email!,
            username: null,
            fullName: user.displayName,
            avatarUrl: user.photoURL,
            bio: null,
            createdAt: new Date(),
            updatedAt: new Date()
          })
        }
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // Initialize user settings in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        settings: defaultSettings,
      })
    } catch (error) {
      console.error('Error signing up:', error)
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error resetting password:', error)
      throw error
    }
  }

  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error('No user logged in')
    try {
      await updateProfile(user, data)
      setUser({ ...user, ...data })
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user || !user.email) throw new Error('No user logged in')
    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      // Update password
      await updatePassword(user, newPassword)
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  }

  const deleteAccount = async (currentPassword: string) => {
    if (!user || !user.email) throw new Error('No user logged in')
    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      // Delete user document from Firestore
      await setDoc(doc(db, 'users', user.uid), { deleted: true })
      // Delete user account
      await deleteUser(user)
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  const updateUserSettings = async (settings: UserSettings) => {
    if (!user) throw new Error('No user logged in')
    try {
      await updateDoc(doc(db, 'users', user.uid), { settings })
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  const getUserSettings = async (): Promise<UserSettings> => {
    if (!user) throw new Error('No user logged in')
    try {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data().settings as UserSettings
      }
      // If settings don't exist, create them with defaults
      await setDoc(docRef, { settings: defaultSettings })
      return defaultSettings
    } catch (error) {
      console.error('Error getting settings:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateUserProfile,
    changePassword,
    deleteAccount,
    updateUserSettings,
    getUserSettings,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 