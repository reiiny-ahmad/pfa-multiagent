import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-serif text-xl font-bold text-gray-900">
          <Sparkles className="w-6 h-6 text-snrt-purple" />
          <span>PFA Multi-Agents</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#features" className="hover:text-gray-900 transition-colors">Fonctionnalités</a>
          <a href="#solutions" className="hover:text-gray-900 transition-colors">Solutions</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
            Connexion
          </Link>
          <Link to="/login" className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Commencer
          </Link>
        </div>
      </div>
    </nav>
  )
}
