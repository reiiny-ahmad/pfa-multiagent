import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    const url = err.config?.url || ''
    // Un 401 sur /auth/login ou /auth/register signifie « mauvais identifiants » :
    // il doit remonter au formulaire, surtout pas déclencher une redirection.
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register')

    if (err.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
    return Promise.reject(err)
  }
)

export default api
