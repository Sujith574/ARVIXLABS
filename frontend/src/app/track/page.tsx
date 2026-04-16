'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, CheckCircle, Clock, AlertCircle, ArrowRight, Shield, Menu, X } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const statusInfo: Record<string, { label: string; color: string; icon: any; bg: string; border: string }> = {
  submitted:    { label: 'Submitted',    color: '#2B6CB0', bg: '#EBF8FF', border: '#BEE3F8', icon: FileText },
  under_review: { label: 'Under Review', color: '#B7791F', bg: '#FFFBEB', border: '#FDE68A', icon: Clock },
  in_progress:  { label: 'In Progress',  color: '#C05621', bg: '#FFFAF0', border: '#FEEBC8', icon: AlertCircle },
  resolved:     { label: 'Resolved',     color: '#2F855A', bg: '#F0FFF4', border: '#C6F6D5', icon: CheckCircle },
  closed:       { label: 'Closed',       color: '#4A5568', bg: '#F7FAFC', border: '#E2E8F0', icon: CheckCircle },
}

export default function TrackPage() {
  const [ticketId, setTicketId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

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
      setError('Official Record not found. Please verify the Ticket ID and retry.')
    } finally {
      setLoading(false)
    }
  }

  const statusData = result ? (statusInfo[result.status] || statusInfo.submitted) : null

  return (
    <div className="min-h-screen bg-white">
      
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="gov-strip hidden md:flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-600" />
           <span>Arvix Labs — Official Tracking Portal</span>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <a href="#" className="hover:text-primary transition-colors">Support Center</a>
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-[#0A2A66] tracking-tight text-xl uppercase">ARVIX LABS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-600 hover:text-primary transition-colors font-semibold">Home</Link>
            <Link href="/grievance" className="text-sm text-slate-600 hover:text-primary transition-colors font-semibold">Grievance Portal</Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white px-6 pb-6 space-y-4 border-b">
            <Link href="/" className="block text-sm font-semibold text-slate-600 py-2 border-b">Home</Link>
            <Link href="/grievance" className="block text-sm font-semibold text-slate-600 py-2">Grievance Portal</Link>
          </motion.div>
        )}
      </nav>

      <div className="pt-24 px-6 pb-24 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#0A2A66] mb-6">Track Your Grievance</h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Enter your assigned Ticket ID below to retrieve the current administrative status and AI-driven resolution insights.</p>
        </motion.div>

        {/* Tracking Input */}
        <div className="gov-card p-10 bg-white mb-12">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 pointer-events-none">Reference Ticket ID</label>
              <input
                id="ticket-id-input"
                className="gov-input py-4 font-mono font-bold text-lg text-[#0A2A66] placeholder:text-slate-200"
                placeholder="ALX-XXXXXX"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading || !ticketId} className="gov-button px-10 self-end py-4">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Retreive Status</>}
            </button>
          </form>
          {error && <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}
        </div>

        {/* Result */}
        {result && statusData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-10 bg-white overflow-hidden">
             <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                <div className="flex items-center gap-5">
                   <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-secondary border border-slate-200">
                      <statusData.icon className="w-7 h-7" style={{ color: statusData.color }} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Docket Reference</p>
                      <p className="text-2xl font-black text-[#0A2A66] tracking-tight">{result.ticket_id}</p>
                   </div>
                </div>
                <div className="px-4 py-2 rounded-md font-bold text-xs uppercase tracking-[0.1em] border"
                  style={{ background: statusData.bg, color: statusData.color, borderColor: statusData.border }}>
                  {statusData.label}
                </div>
             </div>

             <div className="space-y-8">
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Matter</h4>
                   <p className="text-xl font-bold text-slate-800 leading-tight">{result.title}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-slate-100">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">AI Category</p>
                      <p className="text-sm font-bold text-slate-700">{result.ai_category}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Priority</p>
                      <p className="text-sm font-bold text-slate-700 capitalize">{result.ai_priority || result.priority}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Department</p>
                      <p className="text-sm font-bold text-slate-700">{result.ai_department || 'General'}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Filed Date</p>
                      <p className="text-sm font-bold text-slate-700">{new Date(result.created_at).toLocaleDateString()}</p>
                   </div>
                </div>

                {result.ai_summary && (
                   <div className="bg-secondary p-6 rounded-md border border-slate-200">
                      <p className="text-[10px] font-black text-[#0A2A66] uppercase tracking-widest mb-3">AI Case Summary</p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{result.ai_summary}"</p>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </div>

      <ChatBot />
    </div>
  )
}
