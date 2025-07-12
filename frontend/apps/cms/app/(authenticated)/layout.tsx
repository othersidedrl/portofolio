'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '~/hooks/useUser'
import LoadingScreen from '~/components/LoadingScreen'
import Sidebar from '~/components/Sidebar'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: user, isLoading, isError } = useUser()

  useEffect(() => {
    if (isError) {
      router.replace('/login')
    }
  }, [isError, router])

  if (isLoading || isError || !user) return <LoadingScreen />

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar />
      <main className="flex-1 p-6 ml-64 relative">{children}</main>
    </div>
  )
}
