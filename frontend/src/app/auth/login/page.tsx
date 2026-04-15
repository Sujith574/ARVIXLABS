'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.append('username', form.email)
      params.append('password', form.password)

      const res = await axios.post(`${API}/api/v1/auth/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('name', res.data.name)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black text-white tracking-wide">ARVIX LABS</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="input-glass"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  className="input-glass pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit"
              className="w-full btn-glow justify-center py-3.5 text-white font-semibold"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-xs text-center text-slate-600 mb-3">Quick Access Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { role: 'Super Admin', email: 'admin@arvixlabs.gov', color: '#f59e0b' },
                { role: 'Officer', email: 'officer@arvixlabs.gov', color: '#3b82f6' },
              ].map(d => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: 'demo1234' })}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
                  style={{ background: `${d.color}12`, border: `1px solid ${d.color}25`, color: d.color }}
                >
                  {d.role}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">
          <Link href="/portal" className="hover:text-slate-500 transition-colors">
            Filing a complaint? Use Public Portal →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
