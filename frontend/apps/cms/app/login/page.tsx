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
    <main className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] text-[var(--text-strong)] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm space-y-6 bg-[var(--bg-mid)] p-6 rounded-xl shadow-[0_2px_10px_var(--shadow-color-strong)] border border-[var(--border-color)]"
      >
        <h1 className="text-2xl font-semibold text-center">CMS Login</h1>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-[var(--text-muted)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-[var(--bg-light)] text-[var(--text-strong)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-[var(--text-muted)]">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-[var(--bg-light)] text-[var(--text-strong)] border border-[var(--border-color)] outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium rounded hover:opacity-90 transition"
        >
          Sign In
        </button>
      </form>
    </main>
  )
}