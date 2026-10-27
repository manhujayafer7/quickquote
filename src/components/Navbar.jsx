import { Link, NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="QuickQuote home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/app" className={linkClass}>
            Quote Builder
          </NavLink>
          <Link
            to="/app"
            className="hidden rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 sm:inline-block"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  )
}
