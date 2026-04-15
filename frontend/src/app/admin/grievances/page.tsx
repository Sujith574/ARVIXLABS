'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, RefreshCw, Eye, CheckCircle, AlertCircle, Clock, Zap, Trash2, ChevronDown } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

const STATUSES = ['submitted', 'in-review', 'resolved', 'rejected']
const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  'submitted':  { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
  'in-review':  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  'resolved':   { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  'rejected':   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}
const PRIORITY_COLOR: Record<string, string> = {
  low:'#10b981', medium:'#f59e0b', high:'#f97316', critical:'#ef4444'
}

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('all')
  const [search, setSearch]         = useState('')
  const [selected, setSelected]     = useState<any>(null)
  const [updating, setUpdating]     = useState(false)
  const [newStatus, setNewStatus]   = useState('')
  const [note, setNote]             = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/v1/grievances/admin/all`, { headers: headers() })
      setGrievances(res.data)
    } catch { setGrievances([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const visible = grievances.filter(g => {
    const matchFilter = filter === 'all' || g.status === filter
    const matchSearch = !search || [g.ticket_id, g.title, g.ai_category, g.submitter_name]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return
    setUpdating(true)
    try {
      const res = await axios.patch(
        `${API}/api/v1/grievances/admin/${selected.id}/status`,
        { status: newStatus, note },
        { headers: headers() }
      )
      setGrievances(prev => prev.map(g => g.id === selected.id ? res.data : g))
      setSelected(res.data)
    } catch { } finally { setUpdating(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this grievance?')) return
    await axios.delete(`${API}/api/v1/grievances/admin/${id}`, { headers: headers() })
    setGrievances(prev => prev.filter(g => g.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const Stats = () => {
    const counts: Record<string, number> = { submitted:0, 'in-review':0, resolved:0, rejected:0 }
    grievances.forEach(g => { if (counts[g.status] !== undefined) counts[g.status]++ })
    return (
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(counts).map(([k, v]) => {
          const s = STATUS_CONFIG[k]
          return (
            <button key={k} onClick={() => setFilter(filter === k ? 'all' : k)}
              className="glass-card p-4 text-center cursor-pointer transition-all"
              style={{ border: `1px solid ${filter === k ? s.color : 'rgba(255,255,255,0.06)'}40` }}>
              <p className="text-xl font-black" style={{ color: s.color }}>{v}</p>
              <p className="text-xs text-slate-500 capitalize mt-1">{k}</p>
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Grievance Management</h1>
        <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <Stats />

      {/* Search + filter bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input className="input-glass pl-9 w-full" placeholder="Search ticket ID, title, category…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input-glass w-40" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Status</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* List */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="glass-card p-4 h-20 shimmer rounded-xl" />)
          ) : visible.length === 0 ? (
            <div className="glass-card p-10 text-center text-slate-500">No grievances found</div>
          ) : visible.map(g => {
            const s = STATUS_CONFIG[g.status] || STATUS_CONFIG.submitted
            return (
              <motion.div key={g.id} layout
                onClick={() => { setSelected(g); setNewStatus(g.status); setNote('') }}
                className={`glass-card p-4 cursor-pointer transition-all ${selected?.id === g.id ? 'ring-1' : ''}`}
                style={{ borderColor: selected?.id === g.id ? s.color : undefined, ringColor: s.color }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: '#93c5fd' }}>{g.ticket_id}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: s.bg, color: s.color }}>{g.status}</span>
                      <span className="text-xs font-medium capitalize" style={{ color: PRIORITY_COLOR[g.ai_priority] || '#ccc' }}>
                        {g.ai_priority}
                      </span>
                    </div>
                    <p className="text-white text-sm font-medium truncate">{g.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{g.ai_category} · {g.submitter_name || 'Anonymous'}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); handleDelete(g.id) }}
                    className="p-1 rounded text-red-400 hover:bg-red-400/10 shrink-0 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Detail panel */}
        <div>
          {selected ? (
            <div className="glass-card p-6 space-y-5 sticky top-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Ticket</p>
                  <p className="text-xl font-black gradient-text">{selected.ticket_id}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: STATUS_CONFIG[selected.status]?.bg, color: STATUS_CONFIG[selected.status]?.color }}>
                  {selected.status}
                </span>
              </div>

              <div>
                <p className="text-white font-bold text-lg mb-2">{selected.title}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{selected.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { l:'Submitter', v: selected.submitter_name || 'Anonymous' },
                  { l:'Email',     v: selected.submitter_email || '—' },
                  { l:'Category',  v: selected.ai_category },
                  { l:'Priority',  v: selected.ai_priority, color: PRIORITY_COLOR[selected.ai_priority] },
                  { l:'Department',v: selected.ai_department },
                  { l:'Date',      v: new Date(selected.created_at).toLocaleDateString() },
                ].map(f => (
                  <div key={f.l} className="p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-slate-500 mb-0.5">{f.l}</p>
                    <p className={`text-white font-medium capitalize`} style={f.color ? { color: f.color } : {}}>{f.v}</p>
                  </div>
                ))}
              </div>

              {selected.ai_summary && (
                <div className="p-3 rounded-xl text-sm text-slate-400 italic"
                  style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
                  <span className="text-blue-400 font-medium not-italic">AI: </span>{selected.ai_summary}
                </div>
              )}

              {/* Status Update */}
              <div className="border-t pt-5" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Update Status</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {STATUSES.map(s => (
                    <button key={s} onClick={() => setNewStatus(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${newStatus === s ? 'text-white' : 'text-slate-500'}`}
                      style={newStatus === s
                        ? { background: STATUS_CONFIG[s].bg, border: `1px solid ${STATUS_CONFIG[s].color}50`, color: STATUS_CONFIG[s].color }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {s}
                    </button>
                  ))}
                </div>
                <textarea rows={2} className="input-glass resize-none w-full mb-3" placeholder="Optional admin note…"
                  value={note} onChange={e => setNote(e.target.value)} />
                <button onClick={handleStatusUpdate} disabled={updating || newStatus === selected.status}
                  className="w-full btn-glow text-white py-2.5 justify-center disabled:opacity-50">
                  {updating ? 'Updating…' : 'Update Status'}
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-16 text-center text-slate-600 h-full flex flex-col items-center justify-center">
              <Eye className="w-8 h-8 mb-3" />
              <p>Select a grievance to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
