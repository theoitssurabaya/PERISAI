import { createContext, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('token', res.data.token)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password })
    setUser(res.data.user)
    setToken(res.data.token)
    localStorage.setItem('token', res.data.token)
    return res.data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }