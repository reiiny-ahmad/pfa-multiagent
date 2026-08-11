import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { Plus, Wand2, Monitor, Mic, ArrowUp, RefreshCw, X, Mail, MessageSquare, Globe } from 'lucide-react'

const suggestions = [
  { icon: [Mail, MessageSquare], title: 'Obtenez un résumé quotidien', desc: 'de votre boîte de réception et de votre agenda.' },
  { icon: [MessageSquare, Globe], title: 'Résumez ce que vous avez manqué', desc: 'dans vos canaux de communication.' },
  { icon: [Globe], title: 'Créez votre site Web ou portfolio', desc: 'personnel sans écrire une seule ligne de code.' },
]

const quickActions = [
  { icon: '📄', label: 'Créer des diapositives' },
  { icon: '🌐', label: 'Créer un site web' },
  { icon: '🎨', label: 'Conception' },
  { icon: '🎮', label: 'Créer des jeux' },
  { icon: '...', label: 'Plus' },
]

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tasks/stats/dashboard').then(res => setStats(res.data)).catch(() => {})
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    if (query.trim()) navigate('/app/tasks')
  }

  return (
    <div className="min-h-screen bg-manus-black pt-8 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">SNRT Agents</span>
            <span className="text-xs text-gray-600">1.0</span>
          </div>
          <span className="text-xs text-gray-500 bg-manus-card px-3 py-1 rounded-full border border-gray-800">
            Plan gratuit
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-4xl md:text-5xl text-white text-center mb-10"
        >
          Que puis-je faire pour vous ?
        </motion.h1>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mb-8"
        >
          <div className="bg-manus-card border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors">
            <textarea
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Assignez une tâche ou tapez / pour plus"
              className="w-full bg-transparent text-white placeholder-gray-500 outline-none resize-none min-h-[60px] text-base"
              rows={2}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Wand2 className="w-4 h-4" />
                </button>
                <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-gray-400 text-xs transition-colors border border-gray-800">
                  <Monitor className="w-3.5 h-3.5" />
                  SNRT Bureau
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button type="submit" className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors">
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.form>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-400">Suggéré pour vous</span>
            <div className="flex items-center gap-2">
              <button className="text-gray-500 hover:text-gray-300 transition-colors"><RefreshCw className="w-4 h-4" /></button>
              <button className="text-gray-500 hover:text-gray-300 transition-colors"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="bg-manus-card border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  {s.icon.map((Icon, idx) => (
                    <div key={idx} className="w-6 h-6 rounded bg-gray-800 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed">
                  <span className="text-white font-medium">{s.title}</span>{' '}{s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-3 mb-12">
          {quickActions.map(action => (
            <button
              key={action.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-manus-card border border-gray-800 text-sm text-gray-300 hover:border-gray-600 hover:bg-manus-hover transition-all"
            >
              <span>{action.icon}</span>
              {action.label}
            </button>
          ))}
        </motion.div>

        {stats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Tâches totales', value: stats.total_tasks },
              { label: 'Terminées',      value: stats.completed_tasks },
              { label: 'En attente',     value: stats.pending_tasks },
              { label: 'Agents actifs',  value: stats.active_agents },
            ].map(stat => (
              <div key={stat.label} className="bg-manus-card border border-gray-800 rounded-xl p-4">
                <p className="text-2xl font-semibold text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
