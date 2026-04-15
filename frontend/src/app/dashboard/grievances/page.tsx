'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Search, Filter, Eye, ChevronDown } from 'lucide-react'
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
    const token = localStorage.getItem('token')
    axios.get(`${API}/api/v1/grievances/?limit=50`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setComplaints(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = complaints.filter(c => {
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase()) || c.ticket_id.includes(search)
    const matchStatus = statusFilter === '' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="min-h-screen">
      <Topbar title="All Grievances" subtitle="Manage and review complaints" />
      <div className="px-6 py-6 space-y-6">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              className="input-glass pl-10"
              placeholder="Search by title or ticket ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-glass w-full sm:w-48"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <Link href="/dashboard/grievances/submit" className="btn-glow text-white whitespace-nowrap">
            + New Complaint
          </Link>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Ticket', 'Title', 'Status', 'Priority', 'AI Category', 'SLA Deadline', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 rounded shimmer" style={{ width: j === 0 ? 80 : j === 1 ? 200 : 100 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-600">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p>No complaints found</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                    >
                      <td className="px-4 py-3 font-mono text-blue-400 text-xs">{c.ticket_id}</td>
                      <td className="px-4 py-3 text-white max-w-xs">
                        <span className="truncate block">{c.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusStyles[c.status] || ''}`}>
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityStyles[c.priority] || ''}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{c.ai_category || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">
                        {c.sla_deadline ? new Date(c.sla_deadline).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/grievances/${c.id}`}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium">
                          <Eye className="w-3.5 h-3.5" /> View
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
