'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Shield, Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, Loader2
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const ROLES = ['citizen', 'analyst', 'officer', 'super_admin']
const roleColors: Record<string, string> = {
  super_admin: '#f59e0b',
  officer:     '#3b82f6',
  analyst:     '#a78bfa',
  citizen:     '#10b981',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admin/users`, { headers: headers() })
      setUsers(res.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const updateRole = async (id: string, role: string) => {
    setUpdatingId(id)
    try {
      await axios.patch(`${API}/api/v1/admin/users/${id}/role?role=${role}`, {}, { headers: headers() })
      setUsers(u => u.map(x => x.id === id ? { ...x, role } : x))
    } catch { } finally { setUpdatingId('') }
  }

  const toggleUser = async (id: string) => {
    setUpdatingId(id)
    try {
      const res = await axios.patch(`${API}/api/v1/admin/users/${id}/toggle`, {}, { headers: headers() })
      setUsers(u => u.map(x => x.id === id ? { ...x, is_active: res.data.is_active } : x))
    } catch { } finally { setUpdatingId('') }
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    try {
      await axios.delete(`${API}/api/v1/admin/users/${id}`, { headers: headers() })
      setUsers(u => u.filter(x => x.id !== id))
    } catch { }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Topbar title="User Management" subtitle="Manage system users and roles" />
      <div className="px-6 py-6 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES.map(role => (
            <motion.div key={role} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="stat-card">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 capitalize">{role.replace('_', ' ')}</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === role).length}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${roleColors[role]}, transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-glass pl-10" placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 rounded shimmer" style={{ width: j === 1 ? 180 : 100 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: `${roleColors[u.role]}30`, border: `1px solid ${roleColors[u.role]}50` }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="text-xs px-2 py-1 rounded-lg outline-none cursor-pointer font-medium"
                        style={{ background: `${roleColors[u.role]}15`, border: `1px solid ${roleColors[u.role]}40`, color: roleColors[u.role] }}
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleUser(u.id)} disabled={updatingId === u.id}
                        className="flex items-center gap-1.5 text-xs font-medium transition-colors">
                        {updatingId === u.id
                          ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                          : u.is_active
                            ? <><ToggleRight className="w-4 h-4 text-green-400" /><span className="text-green-400">Active</span></>
                            : <><ToggleLeft className="w-4 h-4 text-red-400" /><span className="text-red-400">Inactive</span></>
                        }
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => deleteUser(u.id)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
