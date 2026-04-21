'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Filter, Eye, ChevronDown, Brain, Clock } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import Link from 'next/link'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const statusStyles: Record<string, string> = {
  submitted:    'badge-submitted',
  under_review: 'badge-in-progress',
  in_progress:  'badge-in-progress',
  resolved:     'badge-resolved',
  closed:       'badge-resolved',
}

const priorityStyles: Record<string, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
}

export default function GrievancesListPage() {
  const [complaints, setComplaints] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    axios.get(`${API}/api/v1/grievances/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => {
      setComplaints(Array.isArray(r.data) ? r.data : [])
    }).catch(() => {
      setComplaints([])
    }).finally(() => setLoading(false))
  }, [])

  const filtered = complaints.filter(c => {
    if (!c) return false
    const matchSearch = search === '' || 
      (c.title || '').toLowerCase().includes(search.toLowerCase()) || 
      (c.ticket_id || '').toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === '' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen bg-[#00040d]">
      <Topbar title="Grievance Repository" subtitle="Neural complaint filtering & resolution node" />
      <div className="px-8 py-8 space-y-8 max-w-[1600px] mx-auto">

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
           <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                className="input-glass pl-12 bg-black/40 border-white/10" 
                placeholder="DECRYPT TICKET ID OR CASE TITLE…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3 w-full lg:w-auto">
                <select 
                    className="input-glass lg:w-48 bg-black/40 border-white/10 cursor-pointer font-black text-[10px] uppercase tracking-widest"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                >
                    <option value="">Status: ALL_NODES</option>
                    <option value="submitted">SUBMITTED</option>
                    <option value="under_review">UNDER_REVIEW</option>
                    <option value="in_progress">IN_PROGRESS</option>
                    <option value="resolved">RESOLVED</option>
                </select>
                <Link href="/dashboard/grievances/submit" className="btn-glow whitespace-nowrap text-xs font-black uppercase tracking-widest">
                    + New Handshake
                </Link>
           </div>
        </div>

        {/* Main Records Table */}
        <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Operational Case Log</h3>
             <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{filtered.length} Entries Synchronized</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {['Ticket', 'Core Directive / Title', 'Execution Status', 'Severity', 'AI Cluster', 'SLA Clock', 'Handshake'].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.03]">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <div className="h-2 rounded shimmer bg-white/5" style={{ width: j === 1 ? 240 : 100 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-24 text-center">
                       <FileText className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                       <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">No Neural Records Found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <span className="font-mono text-blue-500 text-[10px] font-black tracking-widest bg-blue-500/5 px-2 py-1 rounded-lg border border-blue-500/10">#{c.ticket_id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-white font-bold tracking-tight text-sm line-clamp-1">{c.title}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5 truncate max-w-xs">{c.description?.substring(0, 40)}...</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`badge ${statusStyles[c.status] || 'status-pending'} text-[10px] font-black`}>
                          {(c.status || 'SUBMITTED').replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${c.priority === 'critical' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : c.priority === 'high' ? 'bg-orange-500' : 'bg-blue-400'}`} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{c.priority}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2 text-slate-400">
                            <Brain className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-xs font-bold">{c.ai_category || 'UNCLASSIFIED'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-[10px] text-slate-500">
                        {c.sla_deadline ? new Date(c.sla_deadline).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link href={`/dashboard/grievances/${c.id}`}
                          className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/50 flex items-center justify-center transition-all group">
                          <Eye className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </Link>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
