'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LogIn, LogOut } from 'lucide-react'

export default function AuthButton() {
  const supabase = createClient()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in with Google:', error)
      // Optionally show a toast message
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      // Optionally show a toast message
    } else {
      router.push('/') // Redirect to home after sign out
      router.refresh() // Refresh server components
    }
  }

  return user ? (
    <Button variant="ghost" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  ) : (
    <Button variant="outline" onClick={handleSignInWithGoogle}>
      <LogIn className="mr-2 h-4 w-4" /> Login with Google
    </Button>
  )
}
