'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Loader2, Save, CheckCircle, Zap, FlaskConical } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

const STATUS_OPTIONS = ['Prototype', 'Beta', 'Production']
const CATEGORY_OPTIONS = ['AI', 'Platform', 'Analytics', 'Security', 'Infrastructure', 'Technology']
const STATUS_ICON: Record<string, any> = { Production: CheckCircle, Beta: Zap, Prototype: FlaskConical }
const STATUS_COLOR: Record<string, string> = { Production: '#10b981', Beta: '#f59e0b', Prototype: '#a78bfa' }

const EMPTY = { title: '', description: '', use_case: '', status: 'Prototype', image_url: '', category: 'Technology' }

export default function AdminTechnologiesPage() {
  const [techs, setTechs]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [editData, setEditData] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const r = await axios.get(`${API}/api/v1/technologies/`)
      setTechs(r.data)
    } catch { setTechs([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editData.id) {
        const r = await axios.put(`${API}/api/v1/technologies/${editData.id}`, editData, { headers: headers() })
        setTechs(t => t.map(x => x.id === editData.id ? r.data : x))
      } else {
        const r = await axios.post(`${API}/api/v1/technologies/`, editData, { headers: headers() })
        setTechs(t => [...t, r.data])
      }
      setModal(false)
    } catch (err) {
      console.error("Save technology error:", err)
      alert("Failed to save technology record")
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this technology?')) return
    await axios.delete(`${API}/api/v1/technologies/${id}`, { headers: headers() })
    setTechs(t => t.filter(x => x.id !== id))
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Technology Showcase</h1>
          <p className="text-slate-500 text-sm mt-1">{techs.length} technologies displayed on public page</p>
        </div>
        <button onClick={() => { setEditData(EMPTY); setModal(true) }} className="btn-glow text-white">
          <Plus className="w-4 h-4" /> Add Technology
        </button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="glass-card p-5 h-48 shimmer rounded-xl" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {techs.map((t, i) => {
            const StatusIcon = STATUS_ICON[t.status] || FlaskConical
            const sc = STATUS_COLOR[t.status] || '#a78bfa'
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }} className="glass-card p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium text-slate-400"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}>{t.category}</span>
                  <div className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${sc}12`, color: sc, border: `1px solid ${sc}30` }}>
                    <StatusIcon className="w-3 h-3" />{t.status}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg mb-1.5">{t.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">{t.description}</p>
                {t.use_case && (
                  <p className="text-slate-600 text-xs mb-4 line-clamp-1">↳ {t.use_case}</p>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditData(t); setModal(true) }}
                    className="flex-1 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)}
                    className="flex-1 py-2 rounded-xl text-xs text-red-400 hover:bg-red-400/10 transition-colors flex items-center justify-center gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
              <div className="glass-card p-8 w-full max-w-lg space-y-4 my-8"
                style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">{editData.id ? 'Edit' : 'Add'} Technology</h2>
                  <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {[
                  { key: 'title',       label: 'Title *',        ph: 'e.g. Arvix AI' },
                  { key: 'description', label: 'Description *',  ph: 'What this technology does…', multi: true },
                  { key: 'use_case',    label: 'Use Case',       ph: 'Who uses it and how…', multi: true },
                  { key: 'image_url',   label: 'Image URL',      ph: 'https://…' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{f.label}</label>
                    {f.multi
                      ? <textarea rows={3} className="input-glass resize-none" placeholder={f.ph}
                          value={editData[f.key] || ''} onChange={e => setEditData({...editData, [f.key]: e.target.value})} />
                      : <input type="text" className="input-glass" placeholder={f.ph}
                          value={editData[f.key] || ''} onChange={e => setEditData({...editData, [f.key]: e.target.value})} />
                    }
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                    <select className="input-glass" value={editData.category}
                      onChange={e => setEditData({...editData, category: e.target.value})}>
                      {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                    <select className="input-glass" value={editData.status}
                      onChange={e => setEditData({...editData, status: e.target.value})}>
                      {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(false)} className="flex-1 btn-outline-glow justify-center py-2.5">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !editData.title || !editData.description}
                    className="flex-1 btn-glow text-white justify-center py-2.5 disabled:opacity-50">
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
