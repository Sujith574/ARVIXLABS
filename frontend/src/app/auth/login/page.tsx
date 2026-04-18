'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Eye, EyeOff, Loader2, ArrowRight, User, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API}/api/v1/auth/request-otp`, { email })
      setStep(2)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Identity not recognized in Arvix Oversight Hub.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API}/api/v1/auth/verify-otp`, { email, otp })
      localStorage.setItem('token', res.data.access_token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('email', res.data.username)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid or expired security code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen arvix-gradient-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="noise" />
      <div className="aurora opacity-30" />
      
      <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }} 
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12">
          <Link href="/" className="inline-block group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative"
            >
              <div className="absolute inset-0 bg-blue-500 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="w-full h-full rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative z-10 border border-white/20 shadow-2xl">
                 <Shield className="w-10 h-10 text-white" />
              </div>
            </motion.div>
          </Link>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter mb-4">
             Command <span className="arvix-accent-gradient">Central</span>
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
             <span className="w-8 h-[1px] bg-slate-800" />
             Neural Oversight Terminal
             <span className="w-8 h-[1px] bg-slate-800" />
          </div>
        </div>

        <div className="arvix-card !p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-10 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-100 text-[11px] font-bold leading-tight"
            >
               <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
               {error}
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={handleRequestOTP} className="space-y-10">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">Sub-Supervisor Identity</label>
                <div className="relative">
                   <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500">
                      <User className="w-5 h-5" />
                   </div>
                   <input
                    type="email"
                    required
                    className="arvix-input !pl-16 !py-6 text-xl"
                    placeholder="Identify yourself…"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                   />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="arvix-button-primary w-full py-6 group"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : (
                  <span className="flex items-center justify-center gap-3">
                     Dispatch Security Key <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-10 text-center">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5 mb-10">
                 <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    A secure 6-digit key has been dispatched to <br/>
                    <span className="text-white font-black tracking-tight mt-1 inline-block">{email}</span>
                 </p>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Protocol</label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  className="arvix-input text-center !text-5xl !font-black tracking-[0.6em] !py-8 !text-arvix-accent"
                  placeholder="••••••"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="px-8 py-6 rounded-3xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex-shrink-0"
                >
                  Reset
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="arvix-button-primary flex-1 py-6"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Authorize Handshake'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Auth Encypted</span>
             </div>
             <p className="text-[8px] text-slate-600 uppercase tracking-widest font-black">Node: AS-S1-PROD</p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8">
           <Link href="/" className="text-[10px] font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
             Sovereign Command
           </Link>
           <div className="w-1 h-1 rounded-full bg-slate-800" />
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
             &copy; 2026 Arvix Labs
           </p>
        </div>
      </motion.div>
    </div>
  )
}
