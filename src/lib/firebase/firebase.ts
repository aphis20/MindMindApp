import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDvXllEOCXq4aRUs3RYnYFHWsIb4iUjedc",
  authDomain: "mindbridge-kt5w6.firebaseapp.com",
  projectId: "mindbridge-kt5w6",
  storageBucket: "mindbridge-kt5w6.firebasestorage.app",
  messagingSenderId: "932577963163",
  appId: "1:932577963163:web:2c385b81bd91f3f619ea3e"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app) 