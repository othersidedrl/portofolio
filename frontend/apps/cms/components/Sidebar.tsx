"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbLogout2 } from "react-icons/tb";

const navItems = [
  { label: "Hero", subpath: "/dashboard/hero" },
  { label: "About", subpath: "/dashboard/about" },
  { label: "Testimonials", subpath: "/dashboard/testimonials" },
  { label: "Projects", subpath: "/dashboard/projects" },
  { label: "Portfolio+", subpath: "/dashboard/portfolio-plus" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside
      className="w-64 h-screen px-6 py-8 flex flex-col justify-between border-r border-[var(--border-color)] shadow-[4px_0_12px_var(--shadow-color)]"
      style={{
        backgroundColor: "var(--bg-mid)",
        color: "var(--text-strong)",
      }}
    >
      <div>
        <a href="/dashboard"><h2 className="text-2xl font-bold mb-8 tracking-tight">My Portfolio</h2></a>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.subpath);
            return (
              <Link
                key={item.subpath}
                href={item.subpath}
                className={`block px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--highlight)] text-[var(--color-primary)] shadow-inner"
                    : "hover:bg-[var(--highlight)] hover:text-[var(--color-accent)] text-[var(--text-muted)]"
                }`}
              >
                {item.label.toUpperCase()}
              </Link>
            );
          })}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="cursor-pointer mt-4 px-4 py-2 text-sm rounded bg-[var(--bg-light)] text-[var(--text-muted)] hover:text-[var(--color-accent)] transition-colors"
      >
        <div className="flex items-center gap-2">
          <TbLogout2 /> Logout
        </div>
      </button>
    </aside>
  );
}
