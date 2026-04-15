'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag, Plus, Edit2, Trash2, X, Loader2, Save } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Category { id: string; name: string; description?: string; department_id?: string; is_active: boolean }

const TAG_COLORS = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#f97316', '#ef4444']

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editData, setEditData] = useState<Partial<Category>>({})
  const [saving, setSaving] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchCats = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admin/categories`, { headers: headers() })
      setCats(res.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchCats() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editData.id) {
        await axios.put(`${API}/api/v1/admin/categories/${editData.id}`,
          { name: editData.name, description: editData.description },
          { headers: headers() })
      } else {
        await axios.post(`${API}/api/v1/admin/categories`,
          { name: editData.name, description: editData.description },
          { headers: headers() })
      }
      await fetchCats()
      setModal(false)
    } catch { } finally { setSaving(false) }
  }

  const deleteCat = async (id: string) => {
    if (!confirm('Deactivate this category?')) return
    await axios.delete(`${API}/api/v1/admin/categories/${id}`, { headers: headers() })
    setCats(c => c.filter(x => x.id !== id))
  }

  // Fallback demo data
  const displayCats = cats.length ? cats : [
    'Infrastructure', 'Water Supply', 'Electricity', 'Roads & Transport',
    'Sanitation', 'Healthcare', 'Education', 'Law & Order', 'Housing',
    'Environment', 'Revenue', 'Social Welfare', 'Other'
  ].map((name, i) => ({ id: String(i), name, description: `Government complaints related to ${name}`, is_active: true }))

  return (
    <div className="min-h-screen">
      <Topbar title="Complaint Categories" subtitle="Manage issue classification categories" />
      <div className="px-6 py-6 space-y-6">

        <div className="flex justify-between items-center">
          <p className="text-slate-400 text-sm">{displayCats.length} categories active</p>
          <button onClick={() => { setEditData({}); setModal(true) }} className="btn-glow text-white">
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card p-5 space-y-3">
              <div className="h-8 w-8 rounded-lg shimmer" />
              <div className="h-4 rounded shimmer" />
              <div className="h-3 rounded shimmer w-3/4" />
            </div>
          )) : displayCats.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }} className="glass-card-hover p-5 group relative overflow-hidden">
              {/* Color accent strip */}
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: TAG_COLORS[i % TAG_COLORS.length] }} />
              <div className="pl-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${TAG_COLORS[i % TAG_COLORS.length]}18`, border: `1px solid ${TAG_COLORS[i % TAG_COLORS.length]}35` }}>
                    <Tag className="w-4 h-4" style={{ color: TAG_COLORS[i % TAG_COLORS.length] }} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditData(c); setModal(true) }}
                      className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteCat(c.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-500/10 transition-colors">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{c.name}</h3>
                <p className="text-slate-500 text-xs line-clamp-2">{c.description || 'No description'}</p>
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
              onClick={() => setModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="glass-card p-8 w-full max-w-md" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-bold text-lg">{editData.id ? 'Edit' : 'New'} Category</h2>
                  <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Category Name *</label>
                    <input className="input-glass" placeholder="e.g. Water Supply"
                      value={editData.name || ''} onChange={e => setEditData({ ...editData, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1.5">Description</label>
                    <textarea rows={3} className="input-glass resize-none" placeholder="Brief description…"
                      value={editData.description || ''} onChange={e => setEditData({ ...editData, description: e.target.value })} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setModal(false)} className="flex-1 btn-outline-glow justify-center py-2.5">Cancel</button>
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
