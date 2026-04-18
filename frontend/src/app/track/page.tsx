'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, CheckCircle, Clock, AlertCircle, ArrowRight, Shield, Menu, X, Loader2 } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

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
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      <div className="pt-32 pb-48 px-6 overflow-hidden relative">
        <div className="aurora opacity-20" />
        <div className="absolute inset-0 grid-overlay opacity-10 pointer-events-none" />


      <div className="pt-24 px-6 pb-24 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-20">
           <span className="text-arvix-accent text-xs font-black uppercase tracking-[0.5em] mb-8 block">Audit Node</span>
           <h1 className="text-6xl md:text-8xl font-display font-black leading-none tracking-tighter mb-8 arvix-text-gradient">
              Track <br/>
              <span className="arvix-accent-gradient">Resolution</span>
           </h1>
           <p className="text-slate-400 text-lg font-medium leading-relaxed">Enter your reference ticket code to retrieve immutable status updates from the Arvix Core cluster.</p>
        </motion.div>

        {/* Tracking Input */}
        <div className="arvix-card p-10 border-white/5 mb-12">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-2 pointer-events-none ml-2">Audit Reference ID</label>
              <input
                id="ticket-id-input"
                className="arvix-input !text-2xl !font-black !py-6 tracking-tighter"
                placeholder="ALX-XXXXXX"
                value={ticketId}
                onChange={e => setTicketId(e.target.value)}
              />
            </div>
            <button type="submit" disabled={loading || !ticketId} className="arvix-button-primary px-12 self-end py-6">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-5 h-5" /> Locate Record</>}
            </button>
          </form>
          {error && <div className="mt-8 p-6 bg-red-400/10 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-400/20 flex items-center gap-4"><AlertCircle className="w-5 h-5" /> {error}</div>}
        </div>

        {/* Result */}
        {result && statusData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="arvix-card !p-0 overflow-hidden border-white/5 shadow-2xl transition-all">
             <div className="bg-white/5 p-12 flex flex-col sm:flex-row justify-between items-center gap-10 border-b border-white/5">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10">
                      <statusData.icon className="w-8 h-8 text-arvix-accent" />
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Audit Record</p>
                      <p className="text-4xl font-display font-black text-white tracking-tighter">{result.ticket_id}</p>
                   </div>
                </div>
                <div className="px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-white/10 bg-white text-slate-950 shadow-2xl">
                  {statusData.label}
                </div>
             </div>

             <div className="p-12 space-y-12">
                <div>
                   <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3">Log Entry</h4>
                   <p className="text-2xl font-bold text-white tracking-tight">{result.title}</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">
                   <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">AI Node</p>
                      <p className="text-sm font-bold text-white">{result.ai_category}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Priority</p>
                      <p className="text-sm font-bold text-arvix-accent uppercase tracking-widest">{result.ai_priority || result.priority}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Unit</p>
                      <p className="text-sm font-bold text-white">{result.ai_department || 'General'}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Timestamp</p>
                      <p className="text-sm font-bold text-white">{new Date(result.created_at).toLocaleDateString()}</p>
                   </div>
                </div>

                {result.ai_summary && !result.remarks && (
                   <div className="bg-white/5 p-8 rounded-2xl border border-white/5 italic">
                      <p className="text-[8px] font-black text-arvix-accent uppercase tracking-widest mb-4">Neural Summary</p>
                      <p className="text-sm text-slate-400 leading-relaxed font-medium transition-all">"{result.ai_summary}"</p>
                   </div>
                )}

                {result.remarks && (
                   <div className="bg-blue-500/5 p-8 rounded-2xl border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.05)]">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                            <Shield className="w-3 h-3 text-blue-400" />
                         </div>
                         <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Administrative Resolution Remarks</p>
                      </div>
                      <p className="text-base text-white leading-relaxed font-semibold">
                         {result.remarks}
                      </p>
                   </div>
                )}
             </div>
          </motion.div>
        )}
      </div></div>
      <ChatBot />
    </div>
  )
}
