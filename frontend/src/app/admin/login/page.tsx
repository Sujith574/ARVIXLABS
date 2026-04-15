'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Loader2, Eye, EyeOff, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ username, password })
      const res = await axios.post(`${API}/api/v1/auth/admin-login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      localStorage.setItem('admin_token', res.data.access_token)
      router.push('/admin/dashboard')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #22d3ee, transparent)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#3b82f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)', boxShadow: '0 0 40px rgba(59,130,246,0.4)' }}>
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white mb-1">ARVIX LABS</h1>
          <p className="text-slate-500 text-sm">Admin Control Panel</p>
        </div>

        <div className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center gap-2 mb-6 p-3 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <Lock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-slate-400">Restricted — Admin access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Username</label>
              <input
                id="admin-username"
                type="text"
                required
                className="input-glass"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Password</label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  required
                  className="input-glass pr-10"
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading || !username || !password}
              id="admin-login-submit"
              className="w-full btn-glow text-white justify-center py-3.5 font-semibold disabled:opacity-50 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating…</> : 'Sign In to Admin'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
