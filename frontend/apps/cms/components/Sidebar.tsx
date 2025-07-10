import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Home', subpath: 'home' },
  { label: 'About', subpath: 'about' },
  { label: 'Testimonials', subpath: 'testimonials' },
  { label: 'Projects', subpath: 'projects' },
]

export default function Sidebar() {
  const pathname = usePathname()

  const basePath = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname

  return (
    <aside
      className="w-64 h-screen px-6 py-8 flex flex-col"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
        color: 'var(--color-text)',
      }}
    >
      <h2 className="text-xl font-bold mb-8 tracking-tight">My Portfolio</h2>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const href = `${basePath}/${item.subpath}`
          const isActive = pathname === href
          return (
            <Link
              key={item.subpath}
              href={href}
              className={`block px-4 py-2 rounded-md font-medium transition-colors`}
              style={{
                backgroundColor: isActive ? 'var(--color-border)' : 'transparent',
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
              }}
            >
              {item.label.toUpperCase()}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
