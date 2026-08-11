import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, Bot, Trash2, Loader2, MessageSquare,
  PanelLeftClose, PanelLeftOpen, Menu, AlertCircle, Settings, Plus,
  Sun, Moon, LogOut
} from 'lucide-react'
import './App.css'
import { useTheme } from './hooks/useTheme'
import { useAuth } from './context/AuthContext'
import api from './services/api'
import toast from 'react-hot-toast'



const SUGGESTIONS = [
  {
    icon: '🏆',
    title: "Coupe d'Afrique des Nations",
    desc: 'Analyse et couverture complète du tournoi féminin au Maroc',
    query: "Women's Africa Cup of Nations in Morocco",
  },
  {
    icon: '📊',
    title: 'Métriques de diffusion',
    desc: 'Rapport automatisé sur les audiences et performances Q3 2024',
    query: 'Rapport sur les métriques de diffusion SNRT pour le T3 2024',
  },
  {
    icon: '📰',
    title: 'Veille informationnelle',
    desc: "Synthèse actualisée sur l'actualité sportive et culturelle marocaine",
    query: 'Résumé des dernières actualités sportives et culturelles du Maroc',
  },
  {
    icon: '📅',
    title: 'Planification éditoriale',
    desc: 'Grille de programmation optimisée pour le Ramadan 2025',
    query: 'Créer une grille de programmation pour le Ramadan 2025',
  },
]

const AGENT_STEPS = [
  { label: 'Recherche',     icon: '🔍' },
  { label: 'Planification', icon: '📋' },
  { label: 'Rédaction',     icon: '✍️' },
  { label: 'Production',    icon: '🎬' },
]

// Doit rester aligné sur AGENTS_USED côté backend (app/routers/chat.py)
const AGENT_NAMES = ['Recherche', 'Planification', 'Rédaction', 'Production']

const SECTION_EMOJIS = ['📰','📋','📊','📈','🗓️','🎯','🔍','📑','✍️','🎬','🎥','📱','🎙️','🎞️','👥','📅','🔗','🤖','🏆','📺']

const isSectionHeader = l => SECTION_EMOJIS.some(e => l.trimStart().startsWith(e))
const isSeparator     = l => { const t = l.trim(); return (t.startsWith('─') || t.startsWith('—')) && t.length > 5 }
const isShotLine      = l => /^\[\d/.test(l.trim())
const isBullet        = l => { const t = l.trim(); return t.startsWith('- ') || t.startsWith('• ') || /^\d+\./.test(t) }
const isUrl           = w => w.startsWith('http://') || w.startsWith('https://')
const isFooter        = l => l.includes('Généré par SNRT') || l.includes('Multi-Agents AI')

function renderLine(text) {
  return text.split(/(\s+)/).map((part, i) =>
    isUrl(part.trim())
      ? <a key={i} href={part.trim()} target="_blank" rel="noopener noreferrer" className="response-link">{part.trim()}</a>
      : part
  )
}

function renderStructuredResponse(text) {
  if (!text) return null
  return text.split('\n').map((line, i) => {
    const t = line.trim()
    if (!t)                 return <div key={i} className="response-spacer" />
    if (isFooter(t))        return <p   key={i} className="response-footer">{t}</p>
    if (isSeparator(t))     return <hr  key={i} className="response-separator" />
    if (isSectionHeader(t)) return <div key={i} className="response-section-header">{t}</div>
    if (isShotLine(t))      return <div key={i} className="response-shot">{renderLine(t)}</div>
    if (isBullet(t))        return <p   key={i} className="response-bullet">{renderLine(t)}</p>
    return                         <p   key={i} className="response-line">{renderLine(t)}</p>
  })
}

function formatTime(date) {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// ── Composant principal ──────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate()
  const { theme, toggle: toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const [query,       setQuery]       = useState('')
  const [loading,     setLoading]     = useState(false)
  const [activeStep,  setActiveStep]  = useState(-1)
  const [error,       setError]       = useState(null)
  const [history,     setHistory]     = useState([])
  const [messages,    setMessages]    = useState([])
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [activeConv,  setActiveConv]  = useState(null)

  const textareaRef   = useRef(null)
  const messagesEndRef = useRef(null)
  const stepTimerRef  = useRef(null)

  useEffect(() => { fetchHistory() }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [query])

  // Animation séquentielle des étapes agents
  useEffect(() => {
    if (loading) {
      setActiveStep(0)
      let step = 0
      stepTimerRef.current = setInterval(() => {
        step = (step + 1) % AGENT_STEPS.length
        setActiveStep(step)
      }, 1800)
    } else {
      clearInterval(stepTimerRef.current)
      setActiveStep(-1)
    }
    return () => clearInterval(stepTimerRef.current)
  }, [loading])

  async function fetchHistory() {
    try {
      const { data } = await api.get('/conversations')
      setHistory(data || [])
    } catch { /* silencieux */ }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const text = query.trim()
    if (!text || loading) return

    setMessages(prev => [...prev, { role: 'user', text, time: new Date() }])
    setQuery('')
    setError(null)
    setLoading(true)

    try {
      const { data } = await api.post('/query', {
        conversation_id: activeConv,
        content: text,
      })

      setMessages(prev => [...prev, {
        role: 'assistant',
        text: data.result,
        agents: data.agents_used,
        time: data.created_at ? new Date(data.created_at) : new Date(),
      }])

      if (!activeConv && data.conversation_id) setActiveConv(data.conversation_id)
      await fetchHistory()
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : (err.message || 'Erreur serveur'))
    } finally {
      setLoading(false)
    }
  }

  async function loadHistoryItem(item) {
    setError(null)
    setMobileOpen(false)
    setActiveConv(item.id)
    try {
      const { data } = await api.get(`/chat/conversations/${item.id}/messages`)
      setMessages(data.map(m => ({
        role: m.role,
        text: m.content,
        agents: m.role === 'assistant' ? AGENT_NAMES : undefined,
        time: new Date(m.created_at),
      })))
    } catch {
      setError("Impossible de charger cette conversation")
    }
  }

  function startNewChat() {
    setMessages([])
    setQuery('')
    setError(null)
    setActiveConv(null)
  }

  async function clearHistory() {
    try {
      await Promise.all(history.map(item => api.delete(`/conversations/${item.id}`)))
      setHistory([])
      startNewChat()
      toast.success('Historique effacé')
    } catch {
      toast.error("Impossible de vider l'historique")
      setError("Impossible de vider l'historique")
    }
  }

  const useSuggestion = useCallback(text => {
    setQuery(text)
    textareaRef.current?.focus()
  }, [])

  const hasMessages = messages.length > 0

  const initials =
    user?.full_name?.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    'US'

  return (
    <div className="layout">
      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay${mobileOpen ? ' visible' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Bouton menu mobile */}
      <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Ouvrir le menu">
        <Menu size={18} />
      </button>

      {/* ── Sidebar ── */}
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__brand-icon"><Bot size={16} /></div>
            <div className="sidebar__brand-text">
              <span className="sidebar__brand-name">PFA Multi-Agents</span>
              <span className="sidebar__brand-sub">SNRT Intelligence</span>
            </div>
          </div>
          <button
            className="sidebar__toggle"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Déplier' : 'Replier'}
          >
            {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
          </button>
        </div>

        <button className="sidebar__new" onClick={startNewChat}>
          <Plus size={14} />
          <span>Nouvelle conversation</span>
        </button>

        <div className="sidebar__section-label">
          <span>Historique</span>
        </div>

        {history.length === 0 ? (
          <div className="sidebar__empty">
            <MessageSquare size={28} opacity={0.2} />
            <span>Aucune conversation<br />pour le moment</span>
          </div>
        ) : (
          <>
            <div className="sidebar__list">
              {history.map(item => (
                <div
                  key={item.id}
                  className={`sidebar__item${activeConv === item.id ? ' active' : ''}`}
                  onClick={() => loadHistoryItem(item)}
                >
                  <MessageSquare size={13} className="sidebar__item-icon" />
                  <div className="sidebar__item-body">
                    <div className="sidebar__item-query">{item.title || `Conversation #${item.id}`}</div>
                    <div className="sidebar__item-time">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="sidebar__clear" onClick={clearHistory}>
              <Trash2 size={12} />
              <span>Effacer l'historique</span>
            </button>
          </>
        )}

        <div className="sidebar__profile">
          <div className="sidebar__avatar">{initials}</div>
          <div className="sidebar__profile-info">
            <div className="sidebar__profile-name">{user?.full_name || user?.email || 'Utilisateur'}</div>
            <div className="sidebar__profile-role">{user?.email || 'SNRT'}</div>
          </div>
        </div>
      </aside>

      {/* ── Zone principale ── */}
      <main className="main">

        {/* Barre supérieure */}
        <header className="topbar">
          <div className="topbar__title">
            Conversation active
            <span className="topbar__status">
              <span className="topbar__dot" />
              Système opérationnel
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Changer le thème">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button className="topbar__btn" aria-label="Paramètres">
              <Settings size={17} />
            </button>
            <button className="topbar__btn" aria-label="Déconnexion" onClick={() => { logout(); navigate('/login', { replace: true }) }}>
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* Zone de défilement */}
        <div className="chat-area">

          {/* Écran d'accueil */}
          {!hasMessages && (
            <div className="welcome">
              <div className="welcome__icon"><Bot size={34} /></div>
              <h1 className="welcome__title">PFA Multi-Agents</h1>
              <p className="welcome__subtitle">Système d'Intelligence Artificielle Multi-Agents — SNRT</p>

              <div className="suggestion-grid">
                {SUGGESTIONS.map(s => (
                  <button key={s.title} className="suggestion-card" onClick={() => useSuggestion(s.query)}>
                    <div className="suggestion-card__icon">{s.icon}</div>
                    <div className="suggestion-card__title">{s.title}</div>
                    <div className="suggestion-card__desc">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fil de messages */}
          {hasMessages && (
            <div className="messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message message--${msg.role}`}>
                  <div className="message__avatar">
                    {msg.role === 'user' ? initials : <Bot size={14} />}
                  </div>
                  <div className="message__body">
                    <div className="message__header">
                      <span className="message__author">
                        {msg.role === 'user' ? 'Vous' : 'Système Multi-Agents'}
                      </span>
                      <span className="message__time">{formatTime(msg.time)}</span>
                      {msg.agents && (
                        <span className="agents-badge">
                          {msg.agents.map(a => <span key={a} className="agent-chip">{a}</span>)}
                        </span>
                      )}
                    </div>
                    <div className="message__content">
                      {msg.role === 'assistant'
                        ? renderStructuredResponse(msg.text)
                        : <p className="response-line">{msg.text}</p>
                      }
                    </div>
                  </div>
                </div>
              ))}

              {/* Indicateur de frappe */}
              {loading && (
                <div className="message message--assistant">
                  <div className="message__avatar"><Bot size={14} /></div>
                  <div className="message__body">
                    <div className="message__header">
                      <span className="message__author">Système Multi-Agents</span>
                    </div>
                    <div className="typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Barre de chargement + étapes agents */}
          {loading && (
            <div className="loading-bar">
              <div className="loading-bar__track">
                <div className="loading-bar__fill" />
              </div>
              <div className="loading-steps">
                {AGENT_STEPS.map((step, i) => (
                  <div key={step.label} className={`loading-step${activeStep === i ? ' active' : ''}`}>
                    <div className="loading-step__dot" />
                    {step.icon} {step.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="error-box">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><strong>Erreur :</strong> {error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Zone de saisie */}
        <div className="input-area">
          <form onSubmit={handleSubmit} className="form">
            <div className="form__box">
              <textarea
                ref={textareaRef}
                className="textarea"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e) }
                }}
                placeholder="Décrivez votre demande en langage naturel… (ex : Coupe d'Afrique des Nations féminine au Maroc)"
                rows={1}
                disabled={loading}
              />
              <div className="form__toolbar">
                <span className="form__hint">
                  <kbd>Entrée</kbd> pour envoyer · <kbd>Maj</kbd>+<kbd>Entrée</kbd> pour saut de ligne
                </span>
                <button type="submit" className="btn-submit" disabled={loading || !query.trim()}>
                  {loading
                    ? <><Loader2 size={14} className="spin" />Analyse…</>
                    : <><Send size={14} />Envoyer</>
                  }
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
