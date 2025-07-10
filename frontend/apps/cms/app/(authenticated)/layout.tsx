'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token') // dummy for now
    if (!token) {
      router.replace('/login')
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <p className="p-8">Checking authentication...</p>

  return <>{children}</>
}
