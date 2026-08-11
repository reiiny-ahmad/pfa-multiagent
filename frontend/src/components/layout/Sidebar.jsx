import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Sparkles, Plus, Bot, Clock, CheckSquare, Settings, LogOut, ChevronRight } from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { icon: Plus,        label: 'Nouvelle tâche', path: '/app' },
    { icon: Bot,         label: 'Agents',         path: '/app/agents' },
    { icon: Clock,       label: 'Historique',     path: '#' },
    { icon: CheckSquare, label: 'Tâches',         path: '/app/tasks' },
  ]

  const isActive = path => location.pathname === path

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-manus-black border-r border-gray-800 flex flex-col z-40">
      <div className="p-4 flex items-center gap-2 border-b border-gray-800">
        <Sparkles className="w-5 h-5 text-snrt-purple" />
        <span className="font-serif text-lg font-bold text-white">SNRT Agents</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {navItems.map(item => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive(item.path)
                ? 'bg-snrt-purple/20 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer group mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-snrt-purple to-snrt-indigo flex items-center justify-center text-xs font-bold text-white">
            {user?.full_name?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{user?.full_name || user?.email}</p>
            <p className="text-xs text-gray-500">Personnel</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
        </div>

        <button className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
          <Settings className="w-4 h-4" />
          <span>Paramètres</span>
        </button>
        <button
          onClick={() => { logout(); window.location.replace('/login') }}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  )
}
