import React, { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Sparkles, KeyRound } from 'lucide-react'
import './AuthPage.css'

export default function AuthPage() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const navigate = useNavigate()
  const { login, register, user, loading: authLoading } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await login(form.email, form.password)
      } else {
        // Ordre des arguments : register(email, full_name, password)
        await register(form.email, form.fullName, form.password)
      }
      navigate('/app', { replace: true })
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(
        typeof detail === 'string' ? detail : (err.message || "Une erreur est survenue")
      )
    } finally {
      setLoading(false)
    }
  }

  // Déjà connecté : inutile de réafficher le formulaire
  if (!authLoading && user) {
    return <Navigate to="/app" replace />
  }

  const ssoButtons = [
    { name: 'Facebook', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png' },
    { name: 'Google', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png' },
    { name: 'Microsoft', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png' },
    { name: 'Apple', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png' },
  ]

  return (
    <div className="min-h-screen bg-manus-black dot-grid flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-snrt-purple" />
        <span className="font-serif text-lg font-bold text-white">SNRT Agents</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px]"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-snrt-purple to-snrt-indigo flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-white text-center mb-2">
          {isLogin ? 'Connectez-vous ou inscrivez-vous' : 'Créez votre compte'}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          {isLogin ? 'Commencez à créer avec SNRT Multi-Agents' : 'Rejoignez SNRT Multi-Agents'}
        </p>

        <div className="space-y-3 mb-6">
          {ssoButtons.map((btn) => (
            <button
              key={btn.name}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg bg-manus-card border border-manus-border text-sm text-white hover:bg-manus-hover transition-colors"
            >
              <img src={btn.icon} alt={btn.name} className="w-4 h-4 object-contain" />
              Continuer avec {btn.name}
            </button>
          ))}
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-manus-border"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-manus-black text-gray-500">Ou</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="fullName"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-manus-card border border-manus-border text-white placeholder-gray-500 outline-none focus:border-snrt-purple transition-colors text-sm"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Saisissez votre adresse email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-manus-card border border-manus-border text-white placeholder-gray-500 outline-none focus:border-snrt-purple transition-colors text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-manus-card border border-manus-border text-white placeholder-gray-500 outline-none focus:border-snrt-purple transition-colors text-sm"
            required
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gray-600 text-white text-sm font-medium hover:bg-gray-500 transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Chargement...'
              : isLogin
              ? 'Continuer'
              : "S'inscrire"}
          </button>
        </form>

        {isLogin && (
          <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-manus-card border border-manus-border text-sm text-gray-300 hover:bg-manus-hover transition-colors">
            <KeyRound className="w-4 h-4" />
            Continuer avec une clé d'accès
          </button>
        )}

        <p className="mt-8 text-center text-xs text-gray-600">
          {isLogin ? (
            <>
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-snrt-purple hover:text-snrt-violet transition-colors">
                S'inscrire
              </Link>
            </>
          ) : (
            <>
              Déjà un compte ?{' '}
              <Link to="/login" className="text-snrt-purple hover:text-snrt-violet transition-colors">
                Se connecter
              </Link>
            </>
          )}
        </p>

        <div className="mt-12 text-center">
          <p className="text-xs text-gray-600 mb-1">from</p>
          <p className="text-sm font-semibold text-white">SNRT</p>
        </div>
      </motion.div>
    </div>
  )
}