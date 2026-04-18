'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Loader2, Mail, Send, CheckCircle, AlertCircle, ArrowRight, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const ADMIN_EMAIL = "arvixlabs@gmail.com"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email !== ADMIN_EMAIL) {
      setError('Unauthorized administrative identity.')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      await axios.post(`${API}/api/v1/auth/request-otp`, { email })
      setStep('otp')
      setSuccess(`Security code dispatched to ${email}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'System failure. Unable to dispatch OTP.')
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
      localStorage.setItem('admin_token', res.data.access_token)
      setSuccess('Identity verified. Granting access…')
      setTimeout(() => router.push('/admin/dashboard'), 1000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid or expired security code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#020617]">
      {/* 3D Modern Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        
        <div className="absolute inset-0 opacity-[0.02]" 
          style={{ backgroundImage: `radial-gradient(#3b82f6 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md perspective-1000"
      >
        {/* Identity Shield */}
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotateY: 20, rotateX: 10, scale: 1.1 }}
            className="w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 preserve-3d shadow-2xl shadow-blue-500/20"
            style={{ 
               background: 'linear-gradient(135deg, #0A2A66 0%, #3B82F6 100%)',
               border: '1px solid rgba(255,255,255,0.1)'
            }}>
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-black text-white tracking-tighter mb-2">
            ARVIX <span className="text-blue-500">LABS</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Security Access Port</p>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="flex items-center gap-3 mb-8 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <Lock className="w-4 h-4 text-blue-400" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
               {step === 'email' ? 'Identification Required' : 'TFA Verification'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'email' ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleRequestOTP} 
                className="space-y-6"
              >
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Admin Identity (Email)</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="arvixlabs@gmail.com"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all font-medium"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !email}
                  className="w-full h-[60px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all shadow-xl shadow-blue-900/40 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Initialize OTP</>}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleVerifyOTP} 
                className="space-y-6"
              >
                <div>
                   <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">One-Time Code</label>
                      <button type="button" onClick={() => setStep('email')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Change Mail</button>
                   </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 text-center text-4xl font-display font-black text-white tracking-[0.5em] placeholder-slate-800 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.04] transition-all"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  />
                  <p className="text-[10px] text-center text-slate-500 mt-4 font-bold uppercase tracking-widest">Sent to {email}</p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  className="w-full h-[60px] bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:translate-y-[-2px] active:scale-95 transition-all shadow-xl shadow-emerald-900/40 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-4 h-4" /> Verify & Unlock</>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {(error || success) && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }}
               className={`mt-6 p-4 rounded-2xl flex items-center gap-3 ${error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-green-500/10 border border-green-500/20 text-green-400'}`}
             >
                {error ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
                <p className="text-xs font-bold leading-snug">{error || success}</p>
             </motion.div>
          )}
        </div>

        <p className="text-center mt-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
           Sovereign Grade Security — Arvix v2.4
        </p>
      </motion.div>
    </div>
  )
}
