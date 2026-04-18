'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  FileText, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Clock, 
  Zap, 
  Lock,
  Mail,
  User,
  ExternalLink,
  ShieldCheck,
  Globe,
  Database
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'https://arvix-backend-666036188871.asia-south1.run.app'

const STATUS_STYLE: Record<string, any> = {
  submitted:   { color: '#38bdf8', label: 'Active Node',   icon: Clock },
  'in-review': { color: '#a855f7', label: 'Processing',   icon: Zap },
  resolved:    { color: '#10B981', label: 'Resolved',    icon: CheckCircle },
  rejected:    { color: '#EF4444', label: 'Rejected',    icon: AlertCircle },
}

const PRIORITY_STYLE: Record<string, any> = {
  low:      { color: '#10B981' },
  medium:   { color: '#38bdf8' },
  high:     { color: '#f59e0b' },
  critical: { color: '#ef4444' },
}

export default function GrievancePage() {
  const [tab, setTab] = useState<'submit'|'track'>('submit')

  // Submit form
  const [form, setForm]   = useState({ title: '', description: '', submitter_name: '', submitter_email: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState<any>(null)
  const [submitErr, setSubmitErr]   = useState('')

  // Track
  const [ticketInput, setTicketInput] = useState('')
  const [tracking, setTracking]       = useState(false)
  const [trackResult, setTrackResult] = useState<any>(null)
  const [trackErr, setTrackErr]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.description) return
    setSubmitting(true)
    setSubmitErr('')
    try {
      const res = await axios.post(`${API}/api/v1/grievances/submit`, form)
      setSubmitted(res.data)
    } catch (err: any) {
      console.error("Submission error:", err)
      setSubmitErr(err.response?.data?.detail || 'Node connection failure. Protocol aborted.')
    } finally { setSubmitting(false) }
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketInput.trim()) return
    setTracking(true)
    setTrackErr('')
    setTrackResult(null)
    try {
      const res = await axios.get(`${API}/api/v1/grievances/track/${ticketInput.trim().toUpperCase()}`)
      setTrackResult(res.data)
    } catch {
      setTrackErr('ID Resolution Error: Ticket code not found in current node cluster.')
    } finally { setTracking(false) }
  }

  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden border-b border-white/5">
        <div className="aurora opacity-20" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-arvix-accent text-xs font-black uppercase tracking-[0.5em] mb-6 block">Sovereign Portal</span>
            <h1 className="text-6xl md:text-8xl font-display font-black leading-none tracking-tighter mb-10 arvix-text-gradient">
              Administrative <br/>
              <span className="arvix-accent-gradient">Registry Portal</span>
            </h1>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-16">
              Arvix Core utilizes high-integrity administrative nodes to manage civil grievances with automated AI triage and global node persistence.
            </p>
          </motion.div>

          <div className="inline-flex p-1.5 arvix-glass rounded-3xl border-white/10">
            {[
              { id: 'submit', label: 'Submit Protocol', icon: FileText },
              { id: 'track',  label: 'Audit Records',    icon: Search },
            ].map(t => (
              <motion.button key={t.id} 
                onClick={() => setTab(t.id as any)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${tab === t.id ? 'bg-white text-slate-950 shadow-xl shadow-white/10' : 'text-slate-400 hover:text-white'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Operations ──────────────────────────────────────────────── */}
      <div className="py-24 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── Submit Form ── */}
          {tab === 'submit' && !submitted && (
            <motion.div key="submit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <div className="arvix-card !p-0 overflow-hidden border-white/5">
                <div className="p-10 border-b border-white/5 bg-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Official Submission</h2>
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Audit Trail Active: B-241094</p>
                   </div>
                   <div className="flex items-center gap-3 px-5 py-2.5 bg-arvix-accent/10 rounded-2xl border border-arvix-accent/20 text-[10px] font-black uppercase tracking-widest text-arvix-accent">
                      <Lock className="w-3.5 h-3.5" /> End-to-End Encryption Enabled
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                        <User className="w-3.5 h-3.5 text-arvix-accent" /> Citizen Identity
                      </label>
                      <input className="arvix-input" placeholder="Official Name"
                        value={form.submitter_name} onChange={e => setForm({...form, submitter_name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2 ml-2">
                        <Mail className="w-3.5 h-3.5 text-arvix-accent" /> Contact Node (Email)
                      </label>
                      <input type="email" className="arvix-input" placeholder="node@protocol.in"
                        value={form.submitter_email} onChange={e => setForm({...form, submitter_email: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                      Portal Subject *
                    </label>
                    <input required className="arvix-input !text-lg font-bold" placeholder="Grievance context..."
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] ml-2">
                      Record Description & Evidence *
                    </label>
                    <textarea required rows={8} className="arvix-input resize-none"
                      placeholder="Provide exhaustive description for AI-driven classification..."
                      value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>

                  {submitErr && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-400 text-sm font-bold">
                       <AlertCircle className="w-5 h-5 flex-shrink-0" />
                       <span>{submitErr}</span>
                    </motion.div>
                  )}

                  <div className="pt-6">
                    <button type="submit" disabled={submitting || !form.title || !form.description}
                      className="w-full arvix-button-primary py-6 text-base tracking-[0.2em]">
                      {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Node Connection...</> : <><ShieldCheck className="w-5 h-5" /> Dispatch Submission</>}
                    </button>
                    <div className="flex justify-center items-center gap-4 mt-8 opacity-20">
                       <span className="w-12 h-px bg-white" />
                       <span className="text-[8px] font-black uppercase tracking-[0.5em]">Arvix Security Layer 2</span>
                       <span className="w-12 h-px bg-white" />
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Success Block ── */}
          {tab === 'submit' && submitted && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="arvix-card p-20 text-center border-arvix-accent/20">
              <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-12 bg-arvix-accent/10 text-arvix-accent border border-arvix-accent/20">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h2 className="text-5xl font-display font-black text-white mb-4 tracking-tighter">Protocol Logged</h2>
              <p className="text-slate-400 font-medium text-lg mb-16">The record has been indexed and distributed across the Arvix Core grid.</p>
              
              <div className="arvix-glass rounded-[2rem] p-12 mb-16 border-white/5 relative overflow-hidden group">
                 <div className="absolute top-6 right-8 text-[9px] font-black uppercase text-arvix-accent bg-arvix-accent/10 px-4 py-2 rounded-xl border border-arvix-accent/20">Official Receipt</div>
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Verification Code</p>
                 <p className="text-6xl md:text-7xl font-display font-black arvix-accent-gradient tracking-tighter leading-none">{submitted.ticket_id}</p>
                 <div className="mt-12 flex flex-wrap justify-center gap-6">
                    <div className="flex items-center gap-3 text-xs font-black text-white px-6 py-3 bg-white/5 rounded-2xl border border-white/10 tracking-widest uppercase">
                       <Zap className="w-4 h-4 text-arvix-accent" /> Priority: <span style={{ color: PRIORITY_STYLE[submitted.ai_priority]?.color }}>{submitted.ai_priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-black text-white px-6 py-3 bg-white/5 rounded-2xl border border-white/10 tracking-widest uppercase">
                       <Globe className="w-4 h-4 text-arvix-accent" /> Node: {submitted.ai_category || 'Triage'}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => { setTab('track'); setTicketInput(submitted.ticket_id) }}
                  className="flex-1 arvix-button-outline py-5 text-xs">Track Record Status</button>
                <button onClick={() => { setSubmitted(null); setForm({ title:'', description:'', submitter_name:'', submitter_email:'' }) }}
                  className="flex-1 arvix-button-primary py-5 text-xs">New Grid Entry</button>
              </div>
            </motion.div>
          )}

          {/* ── Track Block ── */}
          {tab === 'track' && (
            <motion.div key="track" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-10">
              <div className="arvix-card p-10 border-white/5">
                <h3 className="font-bold text-white text-xl mb-10 tracking-tight">Node Grid Search</h3>
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                  <input className="arvix-input flex-1 !text-2xl !font-bold !py-6 tracking-tighter" placeholder="REF-ID (e.g. ALX-123456)"
                    value={ticketInput} onChange={e => setTicketInput(e.target.value)} />
                  <button type="submit" disabled={tracking || !ticketInput}
                    className="arvix-button-primary px-12 whitespace-nowrap">
                    {tracking ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Locate</>}
                  </button>
                </form>
                {trackErr && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="mt-8 p-6 bg-red-400/10 text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl border border-red-400/20 flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{trackErr}</span>
                  </motion.div>
                )}
              </div>

              {trackResult && (() => {
                const s = STATUS_STYLE[trackResult.status] || STATUS_STYLE.submitted
                const StatusIcon = s.icon
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="arvix-card !p-0 overflow-hidden border-white/5 shadow-2xl">
                    <div className="bg-white/5 p-12 flex flex-col sm:flex-row justify-between items-center gap-10">
                       <div>
                          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">System Node Registry</p>
                          <p className="text-6xl font-display font-black text-white tracking-tighter">{trackResult.ticket_id}</p>
                       </div>
                       <div className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-xs uppercase tracking-widest shadow-2xl">
                          <StatusIcon className="w-5 h-5" /> {s.label}
                       </div>
                    </div>

                    <div className="p-12 space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-white/5">
                          <div className="space-y-3">
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Heuristic Priority</p>
                             <div className="flex items-center gap-3 font-black text-xl uppercase tracking-widest" style={{ color: PRIORITY_STYLE[trackResult.ai_priority]?.color }}>
                                 <Zap className="w-4 h-4 fill-current" /> {trackResult.ai_priority}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Node Cluster</p>
                             <div className="flex items-center gap-3 font-black text-white text-xl uppercase tracking-widest">
                                <Database className="w-4 h-4 text-arvix-accent" /> {trackResult.ai_category || 'Triage'}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">SLA Threshold</p>
                             <div className="flex items-center gap-3 font-black text-slate-400 text-xl tracking-tighter">
                                <Clock className="w-4 h-4 text-arvix-accent" /> 24.0h
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em]">Encrypted Log Entry</h4>
                          <h5 className="text-2xl font-bold text-white tracking-tight">{trackResult.title}</h5>
                          <p className="text-slate-500 font-medium leading-relaxed bg-white/5 p-8 rounded-2xl border border-white/5 italic">
                             "{trackResult.description}"
                          </p>
                       </div>

                       <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
                             <Lock className="w-4 h-4" /> Immutable Record Node Mumbai-1
                          </div>
                          <button className="arvix-button-outline px-8 py-4 text-[10px] tracking-widest">
                             Export Receipt <ExternalLink className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Arvix Sovereign Infrastructure — Authorized Portal Only</p>
      </footer>

      <ChatBot />
    </div>
  )
}
