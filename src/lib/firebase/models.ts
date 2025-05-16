// User Profile
export interface Profile {
  id: string // matches auth uid
  createdAt: Date
  updatedAt: Date
  username: string | null
  fullName: string | null
  avatarUrl: string | null
  email: string
  bio: string | null
}

// Circle (Support Group)
export interface Circle {
  id: string
  createdAt: Date
  updatedAt: Date
  name: string
  description: string | null
  creatorId: string
  isPrivate: boolean
  emotionTag: string | null
}

// Circle Membership
export interface CircleMember {
  circleId: string
  profileId: string
  joinedAt: Date
  role: 'member' | 'moderator' | 'admin'
}

// Journal Entry
export interface JournalEntry {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  content: string
  authorId: string
  emotion: string | null
  isPrivate: boolean
}

// Message
export interface Message {
  id: string
  createdAt: Date
  content: string
  senderId: string
  circleId: string
  replyToId: string | null
  emotion: string | null
}

// Helper function to convert Firestore timestamp to Date
export const fromFirestore = <T extends Record<string, any>>(
  data: T
): T => {
  const result: { [K in keyof T]: T[K] } = { ...data }
  Object.keys(result).forEach((key) => {
    const value = result[key as keyof T]
    if (value && typeof value === 'object') {
      if ('toDate' in value) {
        // Convert Firestore Timestamp to Date
        result[key as keyof T] = value.toDate() as T[keyof T]
      } else if ('seconds' in value && 'nanoseconds' in value) {
        // Handle raw timestamp objects
        result[key as keyof T] = new Date(value.seconds * 1000 + value.nanoseconds / 1000000) as T[keyof T]
      }
    }
  })
  return result as T
}

// Helper function to prepare data for Firestore
export const toFirestore = <T extends Record<string, any>>(
  data: T
): Omit<T, 'id'> => {
  const { id, ...rest } = data
  return rest
} 