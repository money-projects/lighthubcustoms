"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type User = { email: string; name: string; phone?: string; role: string }

type AuthCtx = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem("rm_id_token")
    if (t) {
      setToken(t)
      fetch(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${t}` } })
        .then(r => r.ok ? r.json() : null)
        .then(d => { if (d) setUser(d) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Login failed")
    }
    const data = await res.json()
    // Use id_token for API calls — it carries Cognito user attributes (name, email)
    const t = data.id_token
    localStorage.setItem("rm_id_token", t)
    setToken(t)
    const profile = await fetch(`${API}/api/auth/profile`, { headers: { Authorization: `Bearer ${t}` } })
    setUser(await profile.json())
  }

  const logout = () => {
    localStorage.removeItem("rm_id_token")
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, token, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export const API_URL = API
