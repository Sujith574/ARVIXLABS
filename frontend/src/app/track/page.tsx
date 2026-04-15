'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, CheckCircle, Clock, AlertCircle, ArrowRight, Shield } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import ChatBot from '@/components/ui/ChatBot'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const statusInfo: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  submitted:    { label: 'Submitted',    color: '#3b82f6', icon: FileText,     bg: 'rgba(59,130,246,0.1)' },
  under_review: { label: 'Under Review', color: '#f59e0b', icon: Clock,        bg: 'rgba(245,158,11,0.1)' },
  in_progress:  { label: 'In Progress',  color: '#f97316', icon: AlertCircle,  bg: 'rgba(249,115,22,0.1)' },
  resolved:     { label: 'Resolved',     color: '#10b981', icon: CheckCircle,  bg: 'rgba(16,185,129,0.1)' },
  closed:       { label: 'Closed',       color: '#6b7280', icon: CheckCircle,  bg: 'rgba(107,114,128,0.1)' },
}

export default function TrackPage() {
  const [ticketId, setTicketId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketId.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await axios.get(`${API}/api/v1/grievances/track/${ticketId.trim().toUpperCase()}`)
      setResult(res.data)
    } catch {
      setError('Ticket not found. Please check your ticket ID and try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusData = result ? (statusInfo[result.status] || statusInfo.submitted) : null

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(0,8,40,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm">ARVIX LABS</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/portal" className="btn-outline-glow text-xs px-4 py-2">File Complaint</Link>
            <Link href="/auth/login" className="btn-glow text-xs px-4 py-2 text-white">Sign In</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6 pb-16 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Search className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Track Your <span className="gradient-text">Complaint</span>
          </h1>
          <p className="text-slate-400">Enter your ticket ID to check the current status of your grievance.</p>
        </motion.div>

        {/* Search form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <form onSubmit={handleTrack} className="flex gap-3">
            <input
              id="ticket-id-input"
              type="text"
              className="input-glass flex-1 font-mono uppercase"
              placeholder="e.g. ALX-123456"
              value={ticketId}
              onChange={e => setTicketId(e.target.value)}
            />
            <button type="submit" disabled={loading || !ticketId} id="track-submit"
              className="btn-glow text-white px-6 disabled:opacity-50 whitespace-nowrap">
              {loading ? 'Searching…' : 'Track'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}
        </motion.div>

        {/* Result */}
        {result && statusData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8" style={{ border: `1px solid ${statusData.color}33` }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: statusData.bg, border: `1px solid ${statusData.color}40` }}>
                <statusData.icon className="w-7 h-7" style={{ color: statusData.color }} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-mono">{result.ticket_id}</p>
                <h2 className="text-xl font-bold text-white">{result.title}</h2>
                <span className="inline-block mt-1 px-3 py-1 rounded-lg text-xs font-semibold"
                  style={{ background: statusData.bg, color: statusData.color, border: `1px solid ${statusData.color}40` }}>
                  {statusData.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Priority',    value: result.priority || '—' },
                { label: 'AI Category', value: result.ai_category || 'Processing…' },
                { label: 'SLA Deadline', value: result.sla_deadline ? new Date(result.sla_deadline).toLocaleDateString() : '—' },
                { label: 'Filed On',    value: new Date(result.created_at).toLocaleDateString() },
              ].map(f => (
                <div key={f.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-slate-500 mb-1">{f.label}</p>
                  <p className="text-white font-medium text-sm capitalize">{f.value}</p>
                </div>
              ))}
            </div>

            {result.ai_summary && (
              <div className="p-4 rounded-xl text-sm text-slate-400 leading-relaxed"
                style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <p className="text-xs text-blue-400 font-medium mb-2">AI Summary</p>
                {result.ai_summary}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <ChatBot />
    </div>
  )
}
