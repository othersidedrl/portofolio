'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', subpath: 'home' },
  { label: 'About', subpath: 'about' },
  { label: 'Testimonials', subpath: 'testimonials' },
  { label: 'Projects', subpath: 'projects' },
  { label: 'Portfolio+', subpath: 'portfolio-plus' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 h-screen px-6 py-8 flex flex-col border-r border-[var(--border-color)] shadow-[4px_0_12px_var(--shadow-color)]"
      style={{
        backgroundColor: 'var(--bg-mid)',
        color: 'var(--text-strong)',
      }}
    >
      <h2 className="text-2xl font-bold mb-8 tracking-tight">My Portfolio</h2>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.split('/').pop() === item.subpath
          return (
            <Link
              key={item.subpath}
              href={item.subpath}
              className={`block px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[var(--highlight)] text-[var(--color-primary)] shadow-inner'
                  : 'hover:bg-[var(--highlight)] hover:text-[var(--color-accent)] text-[var(--text-muted)]'
              }`}
            >
              {item.label.toUpperCase()}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
