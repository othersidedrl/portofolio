// apps/cms/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Dummy auth logic
    if (email === 'admin@example.com' && password === 'admin') {
      localStorage.setItem('token', 'my-secret-token')
      router.push('/dashboard')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <form onSubmit={handleLogin} className="p-8 max-w-md mx-auto mt-20 border rounded shadow">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="block w-full mb-4 p-2 border"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Login
      </button>
    </form>
  )
}