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
  const [admins, setAdmins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminRole, setNewAdminRole] = useState('officer')
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('admin_token')}` })

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admin/users`, { headers: headers() })
      setUsers(res.data)
    } catch { } finally { setLoading(false) }
  }

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/auth/admins`, { headers: headers() })
      setAdmins(res.data)
    } catch { }
  }

  useEffect(() => { 
    setCurrentEmail(localStorage.getItem('email') || '')
    fetchUsers() 
    fetchAdmins()
  }, [])

  const addAdmin = async () => {
    if (!newAdminEmail) return
    setAddingAdmin(true)
    try {
      await axios.post(`${API}/api/v1/auth/admins`, { email: newAdminEmail, role: newAdminRole }, { headers: headers() })
      setNewAdminEmail('')
      fetchAdmins()
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to authorize admin')
    } finally { setAddingAdmin(false) }
  }

  const updateAdminRole = async (id: number, role: string) => {
    setUpdatingId(id.toString())
    try {
      await axios.patch(`${API}/api/v1/auth/admins/${id}/role?role=${role}`, {}, { headers: headers() })
      setAdmins(a => a.map(x => x.id === id ? { ...x, role } : x))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to update admin role')
    } finally { setUpdatingId('') }
  }

  const deleteAdmin = async (id: number) => {
    if (!confirm('Remove this administrative node?')) return
    try {
      await axios.delete(`${API}/api/v1/auth/admins/${id}`, { headers: headers() })
      setAdmins(a => a.filter(x => x.id !== id))
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Deletion block active.')
    }
  }

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
    <div className="min-h-screen bg-[#00040d]">
      <Topbar title="Identity Management" subtitle="Neural access control & user verification" />
      <div className="px-8 py-8 space-y-8 max-w-[1600px] mx-auto">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {ROLES.map((role, i) => (
            <motion.div key={role} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 border-white/5 relative group overflow-hidden bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{role.replace('_', ' ')}</p>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: roleColors[role] }} />
              </div>
              <p className="text-4xl font-black text-white tracking-tighter tabular-nums">
                {users.filter(u => u.role === role).length}
              </p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.02]" />
              <div className="absolute bottom-0 left-0 h-1 transition-all duration-500"
                style={{ background: roleColors[role], width: `${Math.min((users.filter(u => u.role === role).length / (users.length || 1)) * 100, 100)}%` }} />
            </motion.div>
          ))}
        </div>

        {/* Main Controls & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input className="input-glass pl-12 bg-black/40 border-white/10" placeholder="DECRYPT USER ENTITY FROM REGISTRY…" value={search} onChange={e => setSearch(e.target.value)} />
           </div>
           <div className="flex items-center gap-2">
               <button onClick={fetchUsers} className="btn-secondary px-4 py-2 text-xs uppercase font-black tracking-widest">Refresh Node</button>
           </div>
        </div>

        {/* Global User Registry */}
        <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Global User Registry</h3>
             <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{filtered.length} Entities Indexed</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  {['Entity', 'Identifier/Email', 'Access Level', 'Handshake Status', 'Node Joined', 'Directives'].map(h => (
                    <th key={h} className="px-6 py-4 text-left font-black">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/[0.03]">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-6 py-5">
                          <div className="h-2 rounded shimmer bg-white/5" style={{ width: j === 1 ? 200 : 100 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.03] transition-colors border-b border-white/[0.03]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg"
                          style={{ background: `${roleColors[u.role]}20`, border: `1px solid ${roleColors[u.role]}40`, color: roleColors[u.role] }}>
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="text-white font-bold tracking-tight">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-slate-400 font-mono text-xs">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        className="text-[10px] px-3 py-1.5 rounded-lg outline-none cursor-pointer font-black uppercase tracking-widest transition-all bg-black/40 border border-white/10"
                        style={{ color: roleColors[u.role] }}
                        value={u.role}
                        onChange={e => updateRole(u.id, e.target.value)}
                        disabled={updatingId === u.id}
                      >
                        {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-widest">
                      <button onClick={() => toggleUser(u.id)} disabled={updatingId === u.id}
                        className={`flex items-center gap-2 transition-all px-3 py-1.5 rounded-lg border ${u.is_active ? 'border-green-500/20 text-green-400 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}>
                        {updatingId === u.id
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : u.is_active
                            ? <><ToggleRight className="w-4 h-4" /> System Active</>
                            : <><ToggleLeft className="w-4 h-4" /> Node Offline</>
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => deleteUser(u.id)}
                        className="w-8 h-8 rounded-lg text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all border border-transparent hover:border-red-500/20 group">
                        <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Authorized Admins Section */}
        <div className="space-y-8 pt-12 border-t border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">Admin Authorization Core</h2>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Root-level clearance required for node authorization.</p>
                </div>

                {currentEmail === 'arvixlabs@gmail.com' && (
                    <div className="flex items-center gap-3 p-2 bg-white/[0.03] border border-white/10 rounded-2xl">
                        <input 
                            className="input-glass border-none bg-transparent min-w-[300px]" 
                            placeholder="AUTHORIZE DISPATCH ADDRESS…" 
                            value={newAdminEmail}
                            onChange={e => setNewAdminEmail(e.target.value)}
                        />
                        <select 
                            className="text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white p-2 rounded-xl cursor-pointer outline-none"
                            value={newAdminRole}
                            onChange={e => setNewAdminRole(e.target.value)}
                        >
                            <option value="super_admin">Super Admin</option>
                            <option value="officer">Officer</option>
                            <option value="analyst">Analyst</option>
                            <option value="admin">Generic Admin</option>
                        </select>
                        <button 
                            onClick={addAdmin}
                            disabled={addingAdmin}
                            className="btn-glow px-6 py-2 h-full"
                        >
                            {addingAdmin ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Node'}
                        </button>
                    </div>
                )}
            </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {admins.map(a => (
                <motion.div 
                  key={a.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-6 flex items-center justify-between group bg-white/[0.02] border-white/5"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl transition-all group-hover:scale-105"
                        style={{ background: `${roleColors[a.role || 'admin'] || '#3b82f6'}10`, borderColor: `${roleColors[a.role || 'admin'] || '#3b82f6'}30` }}>
                         <Shield className="w-6 h-6" style={{ color: roleColors[a.role || 'admin'] || '#3b82f6' }} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-base font-black text-white tracking-tight">{a.email}</p>
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded">Handshake Verified</span>
                            {currentEmail === 'arvixlabs@gmail.com' && a.email !== 'arvixlabs@gmail.com' ? (
                              <select 
                                className="text-[10px] bg-transparent text-blue-400 font-black uppercase tracking-[0.2em] outline-none border-none p-0 cursor-pointer"
                                value={a.role || 'admin'}
                                onChange={e => updateAdminRole(a.id, e.target.value)}
                              >
                                 <option value="super_admin">Super Admin</option>
                                 <option value="officer">Officer</option>
                                 <option value="analyst">Analyst</option>
                                 <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">{a.role || 'admin'}</p>
                            )}
                         </div>
                      </div>
                   </div>
                   {currentEmail === 'arvixlabs@gmail.com' && a.email !== 'arvixlabs@gmail.com' && (
                     <button 
                      onClick={() => deleteAdmin(a.id)}
                      className="w-10 h-10 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                   )}
                </motion.div>
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
