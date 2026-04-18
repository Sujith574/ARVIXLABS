'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, Mail, MapPin, Phone, Send, Loader2, CheckCircle, 
  ArrowRight, Globe, MessageSquare, Zap
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import dynamic from 'next/dynamic'
import axios from 'axios'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Support Request', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setErr('')
    try {
      await axios.post(`${API}/api/v1/contact/`, form)
      setSent(true)
    } catch {
      setErr('Communication node failure. Please retry transmission.')
    } finally { setSending(false) }
  }

  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      <section className="pt-32 pb-48 px-6 relative overflow-hidden">
        <div className="aurora opacity-20" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-32">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full arvix-glass border-white/10 text-arvix-accent text-[10px] font-black uppercase tracking-[0.3em] mb-8"
             >
                <Zap className="w-3.5 h-3.5" /> High-Priority Support Node
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-6xl md:text-8xl font-display font-black tracking-tighter mb-8 arvix-text-gradient"
             >
                Secure <br/><span className="arvix-accent-gradient">Handshake</span>
             </motion.h1>
             <p className="text-xl text-slate-400 font-medium leading-relaxed">
                Direct communication link to Arvix Core operatives. Encrypted, auditable, and sovereign support for all global nodes.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
             
             {/* Info Panel */}
             <div className="lg:col-span-5 space-y-8">
                <div className="arvix-card space-y-12">
                   <div className="space-y-6">
                      <h2 className="text-2xl font-black text-white tracking-tight">System Access Points</h2>
                      <p className="text-sm text-slate-500 font-medium">Use these direct channels for immediate infrastructure assistance.</p>
                   </div>

                   <div className="space-y-6">
                      {[
                        { icon: Mail, label: 'Neural Mail', val: 'arvixlabs@gmail.com', href: 'mailto:arvixlabs@gmail.com' },
                        { icon: Globe, label: 'Physical HQ', val: 'Sector Alpha-1, Neo District', href: '#' },
                        { icon: MessageSquare, label: 'ALX-2 Node', val: 'Active 24/7 in Terminal', href: '#' },
                      ].map((item, i) => (
                        <motion.a 
                          key={i} href={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-6 group hover:translate-x-2 transition-all duration-300"
                        >
                           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all duration-500">
                              <item.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{item.label}</p>
                              <p className="text-base font-bold text-white group-hover:text-arvix-accent transition-colors">{item.val}</p>
                           </div>
                        </motion.a>
                      ))}
                   </div>

                   <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">SLA Status: 100% Guaranteed</span>
                       <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Live Node</span>
                       </div>
                   </div>
                </div>

                <div className="arvix-card bg-sky-500/5 border-sky-500/10">
                   <h3 className="text-lg font-bold text-white mb-4">Urgent Dispatch?</h3>
                   <p className="text-sm text-slate-400 leading-relaxed mb-6">
                      High-severity infrastructure failures can be logged directly through the Emergency Grievance protocol with priority tags.
                   </p>
                   <Link href="/grievance" className="text-sky-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 group">
                      Emergency Portal <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                   </Link>
                </div>
             </div>

             {/* Form Panel */}
             <div className="lg:col-span-7">
                <div className="arvix-card !p-0 overflow-hidden relative border-white/5">
                   <div className="absolute inset-0 grid-overlay opacity-10" />
                   <div className="p-12 relative z-10">
                      {sent ? (
                        <div className="py-20 flex flex-col items-center text-center space-y-10">
                           <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center animate-bounce-slow">
                              <CheckCircle className="w-10 h-10" />
                           </div>
                           <div className="space-y-4">
                              <h2 className="text-4xl font-black text-white tracking-tight">Transmission Verified</h2>
                              <p className="text-slate-500 font-medium">Identity handshake complete. An operative will contact you within the next cycle.</p>
                           </div>
                           <button onClick={() => setSent(false)} className="arvix-button-outline px-12 py-5 text-sm">Send New Payload</button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Protocol Identifier</label>
                                 <input required className="arvix-input" placeholder="Name or Organization" 
                                    value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Dispatch Origin</label>
                                 <input required type="email" className="arvix-input" placeholder="secure-node@arvix.ai" 
                                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Subject Metadata</label>
                              <input required className="arvix-input" placeholder="Reason for transmission..." 
                                 value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Encrypted Payload</label>
                              <textarea required rows={6} className="arvix-input resize-none" placeholder="Elaborate on your inquiry..." 
                                 value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                           </div>

                           {err && (
                             <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest text-center">
                                {err}
                             </div>
                           )}

                           <button type="submit" disabled={sending} className="w-full arvix-button-primary py-6 text-base tracking-[0.3em]">
                              {sending ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'DISPATCH HANDSHAKE'}
                           </button>

                           <p className="text-[9px] text-center text-slate-700 font-black uppercase tracking-[0.4em]">Integrated with Arvix Core AES-256 Encryption</p>
                        </form>
                      )}
                   </div>
                </div>
             </div>

          </div>
        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 Arvix Labs — Dedicated Support Infrastructure</p>
      </footer>

      <ChatBot />
    </div>
  )
}
