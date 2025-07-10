'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '~/hooks/useUser'
import LoadingScreen from '~/components/LoadingScreen'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading, isError } = useUser()

  useEffect(() => {
    if (isError) {
      router.replace('/login')
    }
  }, [isError, router])

  if (isLoading || isError || !user) return <LoadingScreen />

  return <>{children}</>
}
