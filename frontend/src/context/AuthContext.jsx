import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const saved = localStorage.getItem('auth_user')
    if (token && saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {
        // Entrée corrompue (ex : ancien token "undefined") — on repart propre.
        localStorage.removeItem('access_token')
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const persist = (data) => {
    if (!data?.access_token || !data?.user) {
      throw new Error('Réponse du serveur invalide : token manquant')
    }
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    return persist(data)
  }, [])

  const register = useCallback(async (email, full_name, password) => {
    const { data } = await api.post('/auth/register', { email, full_name, password })
    return persist(data)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
