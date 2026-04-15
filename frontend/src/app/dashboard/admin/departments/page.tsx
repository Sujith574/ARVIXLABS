'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Dept { id: string; name: string; description?: string; sla_hours: number; is_active: boolean; created_at: string }

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = useState<Dept[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editData, setEditData] = useState<Partial<Dept>>({})
  const [saving, setSaving] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchDepts = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admin/departments`, { headers: headers() })
      setDepts(res.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchDepts() }, [])

  const openCreate = () => { setEditData({ sla_hours: 72 }); setModal(true) }
  const openEdit = (d: Dept) => { setEditData(d); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { name: editData.name, description: editData.description, sla_hours: editData.sla_hours }
      if (editData.id) {
        await axios.put(`${API}/api/v1/admin/departments/${editData.id}`, payload, { headers: headers() })
      } else {
        await axios.post(`${API}/api/v1/admin/departments`, payload, { headers: headers() })
      }
      await fetchDepts()
      setModal(false)
    } catch { } finally { setSaving(false) }
  }

  const deleteDept = async (id: string) => {
    if (!confirm('Deactivate this department?')) return
    await axios.delete(`${API}/api/v1/admin/departments/${id}`, { headers: headers() })
    setDepts(d => d.filter(x => x.id !== id))
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Departments" subtitle="Manage government departments" />
      <div className="px-6 py-6 space-y-6">

        {/* Action bar */}
        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">{depts.length} departments configured</p>
          <button onClick={openCreate} className="btn-glow text-white">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-6 space-y-3">
              <div className="h-5 rounded shimmer" />
              <div className="h-3 rounded shimmer w-3/4" />
              <div className="h-3 rounded shimmer w-1/2" />
            </div>
          )) : depts.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }} className="glass-card-hover p-6 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Building className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(d)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteDept(d.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">{d.name}</h3>
              <p className="text-slate-500 text-xs mb-3 line-clamp-2">{d.description || 'No description'}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-lg text-blue-400" style={{ background: 'rgba(59,130,246,0.1)' }}>
                  SLA: {d.sla_hours}h
                </span>
                <span className="text-xs px-2 py-1 rounded-lg text-green-400" style={{ background: 'rgba(16,185,129,0.1)' }}>
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="glass-card p-8 w-full max-w-md" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">{editData.id ? 'Edit' : 'New'} Department</h2>
                  <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Department Name *</label>
                    <input className="input-glass" placeholder="e.g. Public Works Department"
                      value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Description</label>
                    <textarea rows={3} className="input-glass resize-none" placeholder="Brief description…"
                      value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">SLA Hours</label>
                    <input type="number" className="input-glass" min={1}
                      value={editData.sla_hours || 72} onChange={e => setEditData({ ...editData, sla_hours: +e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModal(false)}
                    className="flex-1 btn-outline-glow justify-center py-2.5">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !editData.name}
                    className="flex-1 btn-glow text-white justify-center py-2.5">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
