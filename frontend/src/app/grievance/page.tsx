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
  Menu, 
  X,
  Lock,
  Mail,
  User,
  ExternalLink
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_STYLE: Record<string, any> = {
  submitted:   { color: '#3B82F6', bg: '#EFF6FF', border: '#DBEAFE', label: 'Submitted',   icon: Clock },
  'in-review': { color: '#F59E0B', bg: '#FFFBEB', border: '#FEF3C7', label: 'In Review',   icon: Zap },
  resolved:    { color: '#10B981', bg: '#ECFDF5', border: '#D1FAE5', label: 'Resolved',    icon: CheckCircle },
  rejected:    { color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2', label: 'Rejected',    icon: AlertCircle },
}

const PRIORITY_STYLE: Record<string, any> = {
  low:      { color: '#10B981', bg: '#ECFDF5' },
  medium:   { color: '#F59E0B', bg: '#FFFBEB' },
  high:     { color: '#F97316', bg: '#FFF7ED' },
  critical: { color: '#EF4444', bg: '#FEF2F2' },
}

export default function GrievancePage() {
  const [tab, setTab] = useState<'submit'|'track'>('submit')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      setSubmitErr(err.response?.data?.detail || 'Portal connection failure. Please verify your internet and try again.')
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
      setTrackErr('Ticket ID not found. Please double-check your reference code.')
    } finally { setTracking(false) }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <Navbar />

      {/* ── Sub-Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-100 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#0A2A66] mb-8 tracking-tighter">
              Administrative <span className="gradient-text">Grievance Portal</span>
            </h1>
            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-16">
              Our high-fidelity framework ensures citizen concerns are classified and prioritized via internal AI nodes for rapid institutional resolution.
            </p>
          </motion.div>

          <div className="inline-flex p-1.5 bg-slate-100/80 backdrop-blur rounded-[2rem] border border-slate-200/50 perspective-1000">
            {[
              { id: 'submit', label: 'Log New Protocol', icon: FileText },
              { id: 'track',  label: 'Audit Status',    icon: Search },
            ].map(t => (
              <motion.button key={t.id} 
                onClick={() => setTab(t.id as any)}
                whileHover={{ scale: 1.05, translateZ: 10 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all preserve-3d ${tab === t.id ? 'bg-white text-[#0A2A66] shadow-xl shadow-blue-900/5' : 'text-slate-500 hover:text-[#0A2A66]'}`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      <div className="py-24 px-6 max-w-5xl mx-auto">
        <AnimatePresence mode="wait">

          {/* ── Submit Form ── */}
          {tab === 'submit' && !submitted && (
            <motion.div key="submit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
              <div className="gov-card !p-0 overflow-hidden border-slate-200/50">
                <div className="p-12 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div>
                      <h2 className="text-3xl font-bold text-[#0A2A66] tracking-tight">Submission Data</h2>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Institutional Audit Trail Ready</p>
                   </div>
                   <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-blue-600">
                      <Lock className="w-3.5 h-3.5" /> End-to-End Encryption Enabled
                   </div>
                </div>

                <form onSubmit={handleSubmit} className="p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                        <User className="w-3.5 h-3.5" /> Submitter Name
                      </label>
                      <input className="gov-input" placeholder="Rahul Sharma"
                        value={form.submitter_name} onChange={e => setForm({...form, submitter_name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                        <Mail className="w-3.5 h-3.5" /> Official Email
                      </label>
                      <input type="email" className="gov-input" placeholder="sharma.r@gov.in"
                        value={form.submitter_email} onChange={e => setForm({...form, submitter_email: e.target.value})} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      Grievance Subject *
                    </label>
                    <input required className="gov-input !text-xl !font-bold" placeholder="High-level subject of the concern..."
                      value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
                      Full Technical Description & Evidence *
                    </label>
                    <textarea required rows={10} className="gov-input resize-none"
                      placeholder="Please provide specific details, including locations, department names, and previous interaction IDs if applicable..."
                      value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>

                  {submitErr && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-700 text-sm font-bold">
                       <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-6 h-6" />
                       </div>
                       <span>{submitErr}</span>
                    </motion.div>
                  )}

                  <div className="pt-6">
                    <button type="submit" disabled={submitting || !form.title || !form.description}
                      className="w-full gov-gradient-button py-6 text-xl shadow-2xl shadow-blue-600/20">
                      {submitting ? <><Loader2 className="w-6 h-6 animate-spin" /> Verifying Records...</> : <><CheckCircle className="w-6 h-6" /> Dispatch Official Grievance</>}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-8">
                      Authorized by Arvix Digital Security Framework v2.1
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Success Block ── */}
          {tab === 'submit' && submitted && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="gov-card p-20 text-center border-blue-100/50 shadow-2xl shadow-blue-600/10">
              <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-12 bg-blue-50 text-blue-600 shadow-xl shadow-blue-500/10 active:scale-95 transition-transform">
                <CheckCircle className="w-14 h-14" />
              </div>
              <h2 className="text-5xl font-display font-black text-[#0A2A66] mb-4">Submission Verified</h2>
              <p className="text-slate-500 font-medium text-xl mb-16">The concern has been indexed in the state registry and routed to AI triage.</p>
              
              <div className="bg-slate-50 rounded-[2.5rem] p-12 mb-16 border border-slate-100 relative group overflow-hidden">
                 <div className="absolute top-6 right-8 text-[10px] font-black uppercase text-blue-600 bg-white px-4 py-2 rounded-xl border border-blue-100 shadow-sm">Official Protocol Reference</div>
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Unique Ticket ID</p>
                 <p className="text-6xl md:text-7xl font-display font-black text-[#0A2A66] tracking-tighter leading-none">{submitted.ticket_id}</p>
                 <div className="mt-12 flex flex-wrap justify-center gap-8">
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 px-6 py-2.5 bg-white rounded-2xl border border-slate-100">
                       <Zap className="w-5 h-5 text-amber-500 fill-current" /> Priority: <span className="capitalize" style={{ color: PRIORITY_STYLE[submitted.ai_priority]?.color }}>{submitted.ai_priority}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-slate-600 px-6 py-2.5 bg-white rounded-2xl border border-slate-100">
                       <Shield className="w-5 h-5 text-blue-600" /> Category: {submitted.ai_category || 'Triage Pending'}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button onClick={() => { setTab('track'); setTicketInput(submitted.ticket_id) }}
                  className="flex-1 gov-button-outline py-6 text-lg">Track Institutional Resolution</button>
                <button onClick={() => { setSubmitted(null); setForm({ title:'', description:'', submitter_name:'', submitter_email:'' }) }}
                  className="flex-1 gov-gradient-button py-6 text-lg">New Grid Submission</button>
              </div>
            </motion.div>
          )}

          {/* ── Track Block ── */}
          {tab === 'track' && (
            <motion.div key="track" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="space-y-12">
              <div className="gov-card p-12 bg-white border-slate-200/50">
                <h3 className="font-bold text-[#0A2A66] text-2xl mb-10 tracking-tight">System Registry Search</h3>
                <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-6">
                  <input className="gov-input flex-1 !text-2xl !font-bold !py-6" placeholder="Reference ID (e.g. ALX-123456)"
                    value={ticketInput} onChange={e => setTicketInput(e.target.value)} />
                  <button type="submit" disabled={tracking || !ticketInput}
                    className="gov-gradient-button px-12 whitespace-nowrap shadow-2xl shadow-blue-600/10 active:scale-95">
                    {tracking ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Search className="w-6 h-6" /> Locate Record</>}
                  </button>
                </form>
                {trackErr && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} 
                    className="mt-8 p-6 bg-red-50 text-red-700 text-sm font-bold rounded-2xl border border-red-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                       <AlertCircle className="w-6 h-6" />
                    </div>
                    <span>{trackErr}</span>
                  </motion.div>
                )}
              </div>

              {trackResult && (() => {
                const s = STATUS_STYLE[trackResult.status] || STATUS_STYLE.submitted
                const StatusIcon = s.icon
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="gov-card !p-0 overflow-hidden border-blue-100/50 shadow-2xl shadow-blue-900/10">
                    <div className="bg-[#0A2A66] p-12 text-white flex flex-col sm:flex-row justify-between items-center gap-10">
                       <div>
                          <p className="text-[11px] font-black text-blue-300 uppercase tracking-[0.3em] mb-3">Authenticated System Record</p>
                          <p className="text-5xl md:text-6xl font-display font-black tracking-tighter">{trackResult.ticket_id}</p>
                       </div>
                       <div className="flex items-center gap-4 px-8 py-4 rounded-[1.5rem] bg-white text-[#0A2A66] font-black text-sm uppercase tracking-widest shadow-2xl">
                          <StatusIcon className="w-6 h-6" /> {s.label}
                       </div>
                    </div>

                    <div className="p-12 space-y-12">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-slate-100">
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Priority</p>
                             <div className="flex items-center gap-3 font-bold capitalize text-xl" style={{ color: PRIORITY_STYLE[trackResult.ai_priority]?.color }}>
                                <Zap className="w-5 h-5 fill-current" /> {trackResult.ai_priority}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Categorization</p>
                             <div className="flex items-center gap-3 font-bold text-[#0A2A66] text-xl">
                                <Shield className="w-5 h-5 shadow-sm" /> {trackResult.ai_category || 'Detecting...'}
                             </div>
                          </div>
                          <div className="space-y-3">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Resolution</p>
                             <div className="flex items-center gap-3 font-bold text-slate-700 text-xl">
                                <Clock className="w-5 h-5 text-blue-500" /> 24-48 Hours
                             </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Permanent Registry Data</h4>
                          <h5 className="text-3xl font-bold text-[#0A2A66] tracking-tight">{trackResult.title}</h5>
                          <p className="text-slate-500 font-medium leading-relaxed bg-slate-50 p-10 rounded-[2rem] border border-slate-100 italic">
                             "{trackResult.description}"
                          </p>
                       </div>

                       <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-slate-400">
                             <Lock className="w-4 h-4" /> Immutable Administrative Entry
                          </div>
                          <button className="gov-button-outline px-8 py-4 text-xs tracking-widest">
                             Download Verification Receipt <ExternalLink className="w-5 h-5" />
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

      <footer className="bg-white py-16 px-6 border-t border-slate-100 mt-auto text-center">
         <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2024 Arvix Labs — Authorized Institutional Portal Infrastructure</p>
      </footer>

      <ChatBot />
    </div>
  )
}
