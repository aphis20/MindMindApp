import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentReference,
} from 'firebase/firestore'
import { db } from './config'
import type { Profile, Circle, CircleMember, JournalEntry, Message } from './models'
import { fromFirestore, toFirestore } from './models'

// Profile Services
export const profileService = {
  async create(profile: Profile) {
    const ref = doc(db, 'profiles', profile.id)
    await setDoc(ref, {
      ...toFirestore(profile),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  },

  async get(id: string) {
    const ref = doc(db, 'profiles', id)
    const snap = await getDoc(ref)
    return snap.exists() ? fromFirestore(snap.data() as Profile) : null
  },

  async update(id: string, data: Partial<Profile>) {
    const ref = doc(db, 'profiles', id)
    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  },
}

// Circle Services
export const circleService = {
  async create(circle: Omit<Circle, 'id' | 'createdAt' | 'updatedAt'>) {
    const ref = doc(collection(db, 'circles'))
    await setDoc(ref, {
      ...circle,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return ref.id
  },

  async get(id: string) {
    const ref = doc(db, 'circles', id)
    const snap = await getDoc(ref)
    return snap.exists() ? fromFirestore(snap.data() as Circle) : null
  },

  async update(id: string, data: Partial<Circle>) {
    const ref = doc(db, 'circles', id)
    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  },

  async delete(id: string) {
    await deleteDoc(doc(db, 'circles', id))
  },

  async listByMember(profileId: string) {
    const membershipQuery = query(
      collection(db, 'circleMembers'),
      where('profileId', '==', profileId)
    )
    const membershipSnaps = await getDocs(membershipQuery)
    const circleIds = membershipSnaps.docs.map(doc => doc.data().circleId)
    
    const circles: Circle[] = []
    for (const id of circleIds) {
      const circle = await this.get(id)
      if (circle) circles.push(circle)
    }
    return circles
  },
}

// Circle Member Services
export const circleMemberService = {
  async addMember(circleId: string, profileId: string, role: CircleMember['role'] = 'member') {
    const membershipId = `${profileId}_${circleId}`
    const ref = doc(db, 'circleMembers', membershipId)
    await setDoc(ref, {
      circleId,
      profileId,
      role,
      joinedAt: Timestamp.now(),
    })
  },

  async removeMember(circleId: string, profileId: string) {
    const membershipId = `${profileId}_${circleId}`
    await deleteDoc(doc(db, 'circleMembers', membershipId))
  },

  async updateRole(circleId: string, profileId: string, role: CircleMember['role']) {
    const membershipId = `${profileId}_${circleId}`
    const ref = doc(db, 'circleMembers', membershipId)
    await updateDoc(ref, { role })
  },
}

// Journal Entry Services
export const journalService = {
  async create(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) {
    const ref = doc(collection(db, 'journalEntries'))
    const data = {
      ...entry,
      id: ref.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    await setDoc(ref, data)
    return fromFirestore(data)
  },

  async get(id: string) {
    const ref = doc(db, 'journalEntries', id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    const data = { ...snap.data(), id: snap.id } as JournalEntry
    return fromFirestore(data)
  },

  async update(id: string, data: Partial<JournalEntry>) {
    const ref = doc(db, 'journalEntries', id)
    await updateDoc(ref, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  },

  async delete(id: string) {
    await deleteDoc(doc(db, 'journalEntries', id))
  },

  async listByAuthor(authorId: string) {
    const q = query(
      collection(db, 'journalEntries'),
      where('authorId', '==', authorId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(doc => {
      const data = { ...doc.data(), id: doc.id } as JournalEntry
      return fromFirestore(data)
    })
  },
}

// Message Services
export const messageService = {
  async create(message: Omit<Message, 'id' | 'createdAt'>) {
    const ref = doc(collection(db, 'messages'))
    await setDoc(ref, {
      ...message,
      createdAt: Timestamp.now(),
    })
    return ref.id
  },

  async get(id: string) {
    const ref = doc(db, 'messages', id)
    const snap = await getDoc(ref)
    return snap.exists() ? fromFirestore(snap.data() as Message) : null
  },

  async delete(id: string) {
    await deleteDoc(doc(db, 'messages', id))
  },

  async listByCircle(circleId: string) {
    const q = query(
      collection(db, 'messages'),
      where('circleId', '==', circleId),
      orderBy('createdAt', 'desc')
    )
    const snap = await getDocs(q)
    return snap.docs.map(doc => fromFirestore(doc.data() as Message))
  },
} 