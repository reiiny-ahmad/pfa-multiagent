import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../services/api'
import { Send, Plus, RefreshCw, Settings, User, Loader2 } from 'lucide-react'

export default function Chat() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const res = await api.get('/conversations')
      setConversations(res.data || [])
    } catch (err) {
      console.error('Erreur chargement conversations:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    const userMsg = { role: 'user', content: query, created_at: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setQuery('')
    setLoading(true)
    setError('')

    try {
      const res = await api.post('/query', {
        conversation_id: activeConv,
        content: userMsg.content
      })

      if (res.data?.success && res.data?.message) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: res.data.message.content,
          created_at: res.data.message.created_at || new Date().toISOString()
        }])
        if (!activeConv && res.data.conversation_id) {
          setActiveConv(res.data.conversation_id)
          fetchConversations()
        }
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.detail || 'Erreur serveur 500')
    } finally {
      setLoading(false)
    }
  }

  const newConversation = () => {
    setActiveConv(null)
    setMessages([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* SIDEBAR */}
      <aside className="w-[260px] bg-[#111111] border-r border-[#222] flex flex-col">
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">PFA Multi-Agents</h1>
            <p className="text-gray-500 text-xs">SNRT Intelligence</p>
          </div>
        </div>

        <button
          onClick={newConversation}
          className="mx-4 mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a1a1a] border border-[#333] text-gray-300 text-sm hover:bg-[#222] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle conversation
        </button>

        <div className="px-4 mb-2">
          <span className="text-xs text-gray-600 font-medium uppercase tracking-wider">Historique</span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {conversations.length === 0 && (
            <div className="text-center py-8 text-gray-600 text-xs">
              Aucune conversation pour le moment
            </div>
          )}
          {conversations.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                activeConv === c.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              {c.title || `Conversation #${c.id}`}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-[#222]">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
              FH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">Faris Hamada</p>
              <p className="text-xs text-gray-500">Stagiaire SNRT</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-[#222] flex items-center justify-between px-6 bg-[#0a0a0a]/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300 font-medium">Conversation active</span>
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Système opérationnel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-3xl px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/30 border border-violet-500/20 text-gray-100'
                    : 'bg-[#161616] border border-[#2a2a2a] text-gray-300'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-sm text-gray-400">Les agents analysent votre demande...</span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-red-400 text-sm">
                <span className="text-lg">⚠</span>
                <span><strong>Erreur :</strong> {error}</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#222] p-4 bg-[#0a0a0a]">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="bg-[#161616] border border-[#2a2a2a] rounded-2xl p-4 focus-within:border-violet-500/30 transition-colors">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit(e)
                  }
                }}
                placeholder="Décrivez votre demande en langage naturel... (ex : Coupe d'Afrique des Nations féminine au Maroc)"
                className="w-full bg-transparent text-gray-200 placeholder-gray-600 outline-none resize-none min-h-[60px] text-sm"
                rows={2}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-600">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#222] text-gray-400 text-[10px]">Entrée</kbd> pour envoyer · <kbd className="px-1.5 py-0.5 rounded bg-[#222] text-gray-400 text-[10px]">Maj</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-[#222] text-gray-400 text-[10px]">Entrée</kbd> pour saut de ligne
                </span>
                <button
                  type="submit"
                  disabled={loading || !query.trim()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  Envoyer
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}