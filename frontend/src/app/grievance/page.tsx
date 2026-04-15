'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Shield, FileText, Search, CheckCircle, AlertCircle, Loader2, Upload, ArrowRight, ChevronRight, Clock, Zap } from 'lucide-react'
import axios from 'axios'
import ChatBot from '@/components/ui/ChatBot'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_STYLE: Record<string, any> = {
  submitted:   { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  label: 'Submitted',   icon: Clock },
  'in-review': { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'In Review',   icon: Zap },
  resolved:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Resolved',    icon: CheckCircle },
  rejected:    { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Rejected',    icon: AlertCircle },
}

const PRIORITY_COLOR: Record<string, string> = {
  low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444'
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
    } catch {
      setSubmitErr('Failed to submit. Please try again.')
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
      setTrackErr('Ticket not found. Please check your ticket ID.')
    } finally { setTracking(false) }
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(0,8,40,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-wide">ARVIX LABS</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/technologies" className="text-sm text-slate-400 hover:text-white transition-colors">Technologies</Link>
            <Link href="/founders" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-28 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-300 mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <FileText className="w-3.5 h-3.5" /> Grievance Intelligence Platform
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Submit & Track <span className="gradient-text">Your Grievance</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              AI automatically classifies, prioritizes, and routes your complaint to the right department.
            </p>
          </motion.div>

          {/* Tab Switcher */}
          <div className="flex gap-3 justify-center mt-8 mb-10">
            {[
              { id: 'submit', label: 'Submit Grievance', icon: FileText },
              { id: 'track',  label: 'Track Status',    icon: Search },
            ].map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'text-white' : 'text-slate-400 hover:text-white'}`}
                  style={tab === t.id
                    ? { background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(34,211,238,0.15))', border: '1px solid rgba(59,130,246,0.4)' }
                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Icon className="w-4 h-4" /> {t.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">

            {/* ── Submit Form ──────────────────────────────────────────────────── */}
            {tab === 'submit' && !submitted && (
              <motion.div key="submit" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Your Name</label>
                        <input className="input-glass" placeholder="Optional"
                          value={form.submitter_name} onChange={e => setForm({...form, submitter_name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email</label>
                        <input type="email" className="input-glass" placeholder="Optional"
                          value={form.submitter_email} onChange={e => setForm({...form, submitter_email: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Grievance Title *</label>
                      <input required className="input-glass" placeholder="Brief description of the issue"
                        value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Detailed Description *</label>
                      <textarea required rows={5} className="input-glass resize-none"
                        placeholder="Provide full details — location, dates, impact, what resolution you expect…"
                        value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                    </div>
                    {submitErr && (
                      <p className="text-red-400 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{submitErr}</p>
                    )}
                    <button type="submit" disabled={submitting || !form.title || !form.description}
                      className="w-full btn-glow text-white justify-center py-3.5 text-sm font-semibold disabled:opacity-50">
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting & Classifying…</> : <><ArrowRight className="w-4 h-4" /> Submit Grievance</>}
                    </button>
                    <p className="text-center text-xs text-slate-600">Powered by Gemini AI — auto-classification & priority detection</p>
                  </form>
                </div>
              </motion.div>
            )}

            {/* ── Submitted Success ─────────────────────────────────────────── */}
            {tab === 'submit' && submitted && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.4)' }}>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Grievance Submitted!</h2>
                <p className="text-slate-400 mb-6">Your ticket ID — save this to track your complaint</p>
                <div className="text-3xl font-black gradient-text mb-6">{submitted.ticket_id}</div>
                <div className="grid grid-cols-3 gap-4 mb-8 text-center">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs text-slate-500 mb-1">AI Category</p>
                    <p className="text-white font-semibold text-sm">{submitted.ai_category}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs text-slate-500 mb-1">Priority</p>
                    <p className="font-semibold text-sm capitalize" style={{ color: PRIORITY_COLOR[submitted.ai_priority] || '#3b82f6' }}>
                      {submitted.ai_priority}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-xs text-slate-500 mb-1">Routed To</p>
                    <p className="text-white font-semibold text-sm">{submitted.ai_department}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setTab('track'); setTicketInput(submitted.ticket_id) }}
                    className="flex-1 btn-outline-glow py-2.5 justify-center">Track Status</button>
                  <button onClick={() => { setSubmitted(null); setForm({ title:'', description:'', submitter_name:'', submitter_email:'' }) }}
                    className="flex-1 btn-glow text-white py-2.5 justify-center">Submit Another</button>
                </div>
              </motion.div>
            )}

            {/* ── Track ────────────────────────────────────────────────────── */}
            {tab === 'track' && (
              <motion.div key="track" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="glass-card p-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                  <form onSubmit={handleTrack} className="flex gap-3">
                    <input className="input-glass flex-1" placeholder="Enter Ticket ID — e.g. ALX-123456"
                      value={ticketInput} onChange={e => setTicketInput(e.target.value)} />
                    <button type="submit" disabled={tracking || !ticketInput}
                      className="btn-glow text-white px-6 whitespace-nowrap disabled:opacity-50">
                      {tracking ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Search className="w-4 h-4" /> Track</>}
                    </button>
                  </form>
                  {trackErr && <p className="text-red-400 text-sm mt-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" />{trackErr}</p>}
                </div>

                {trackResult && (() => {
                  const s = STATUS_STYLE[trackResult.status] || STATUS_STYLE.submitted
                  const StatusIcon = s.icon
                  return (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="glass-card p-6" style={{ border: `1px solid ${s.color}30` }}>
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Ticket ID</p>
                          <p className="text-xl font-black gradient-text">{trackResult.ticket_id}</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                          style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40` }}>
                          <StatusIcon className="w-4 h-4" /> {s.label}
                        </div>
                      </div>
                      <h3 className="text-white font-bold mb-2">{trackResult.title}</h3>
                      <p className="text-slate-400 text-sm mb-5">{trackResult.description}</p>
                      <div className="grid grid-cols-3 gap-3 text-xs">
                        {[
                          { label:'AI Category', value: trackResult.ai_category },
                          { label:'Priority',    value: trackResult.ai_priority, color: PRIORITY_COLOR[trackResult.ai_priority] },
                          { label:'Department',  value: trackResult.ai_department },
                        ].map(f => (
                          <div key={f.label} className="p-3 rounded-xl text-center" style={{ background:'rgba(255,255,255,0.03)' }}>
                            <p className="text-slate-500 mb-1">{f.label}</p>
                            <p className="text-white font-semibold capitalize" style={f.color ? {color: f.color} : {}}>{f.value}</p>
                          </div>
                        ))}
                      </div>
                      {trackResult.ai_summary && (
                        <div className="mt-4 p-3 rounded-xl text-sm text-slate-400 italic"
                          style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                          <span className="text-blue-400 font-medium not-italic">AI Summary: </span>{trackResult.ai_summary}
                        </div>
                      )}
                    </motion.div>
                  )
                })()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <ChatBot />
    </div>
  )
}
