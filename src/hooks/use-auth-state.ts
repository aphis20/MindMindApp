import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth-context'

export function useAuthState() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!loading) {
      const from = searchParams.get('from')
      
      if (user && from) {
        setIsRedirecting(true)
        router.push(from)
      } else if (user) {
        setIsRedirecting(true)
        router.push('/')
      }
    }
  }, [user, loading, router, searchParams])

  return {
    user,
    loading: loading || isRedirecting,
    isAuthenticated: !!user,
  }
} 