'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Loader2, Save, Upload, Link as LinkIcon } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

const EMPTY: any = {
  name: '', role: '', bio: '', image_url: '', linkedin: '', github: '', twitter: '', type: 'founder'
}

export default function AdminTeamPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editData, setEditData] = useState<any>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/founders/`)
      setTeam(res.data)
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { fetchTeam() }, [])

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return editData.image_url || ''
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', imageFile)
      form.append('category', 'team')
      const res = await axios.post(`${API}/api/v1/media/upload`, form, {
        headers: { ...headers(), 'Content-Type': 'multipart/form-data' }
      })
      return res.data.url
    } catch { return editData.image_url || '' } finally { setUploading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const image_url = await uploadImage()
      const payload = { ...editData, image_url }
      if (editData.id) {
        await axios.put(`${API}/api/v1/founders/${editData.id}`, payload, { headers: headers() })
        setTeam(t => t.map(x => x.id === editData.id ? { ...x, ...payload } : x))
      } else {
        const res = await axios.post(`${API}/api/v1/founders/`, payload, { headers: headers() })
        setTeam(t => [...t, res.data])
      }
      setModal(false)
      setImageFile(null)
    } catch { } finally { setSaving(false) }
  }

  const deletePerson = async (id: string) => {
    if (!confirm('Remove this person?')) return
    await axios.delete(`${API}/api/v1/founders/${id}`, { headers: headers() })
    setTeam(t => t.filter(x => x.id !== id))
  }

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')

  const PersonCard = ({ p, isFounder }: { p: any; isFounder: boolean }) => (
    <div className="glass-card p-5 relative group">
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => { setEditData(p); setImageFile(null); setModal(true) }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
          <Edit2 className="w-3.5 h-3.5" /></button>
        <button onClick={() => deletePerson(p.id)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0"
          style={p.image_url
            ? { backgroundImage: `url(${p.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: isFounder ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
                border: `2px solid ${isFounder ? 'rgba(245,158,11,0.3)' : 'rgba(59,130,246,0.3)'}`,
                color: isFounder ? '#f59e0b' : '#3b82f6' }}>
          {!p.image_url && p.name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold">{p.name}</p>
          <p className="text-xs font-medium" style={{ color: isFounder ? '#f59e0b' : '#3b82f6' }}>{p.role}</p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{p.bio}</p>
        </div>
      </div>
      <div className="flex gap-3 mt-4 text-xs text-slate-600">
        {p.linkedin && <a href={p.linkedin} target="_blank" rel="noopener" className="hover:text-blue-400 transition-colors">LinkedIn</a>}
        {p.github   && <a href={p.github}   target="_blank" rel="noopener" className="hover:text-white transition-colors">GitHub</a>}
        {p.twitter  && <a href={p.twitter}  target="_blank" rel="noopener" className="hover:text-cyan-400 transition-colors">Twitter</a>}
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">Founders & Team</h1>
        <button onClick={() => { setEditData(EMPTY); setImageFile(null); setModal(true) }}
          className="btn-glow text-white"><Plus className="w-4 h-4" /> Add Person</button>
      </div>

      {/* Founders */}
      <section>
        <p className="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-4">Founders ({founders.length})</p>
        <div className="grid md:grid-cols-2 gap-4">
          {loading ? Array(2).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-5"><div className="h-14 rounded-xl shimmer" /></div>
          )) : founders.map(p => <PersonCard key={p.id} p={p} isFounder={true} />)}
        </div>
      </section>

      {/* Developers */}
      <section>
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-4">Developers ({developers.length})</p>
        <div className="grid md:grid-cols-2 gap-4">
          {developers.map(p => <PersonCard key={p.id} p={p} isFounder={false} />)}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModal(false)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-y-auto">
              <div className="glass-card p-8 w-full max-w-lg space-y-4 my-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">{editData.id ? 'Edit' : 'Add'} Person</h2>
                  <button onClick={() => setModal(false)} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-4 h-4" /></button>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Type</label>
                  <div className="flex gap-3">
                    {['founder', 'developer'].map(t => (
                      <button key={t} type="button" onClick={() => setEditData({...editData, type: t})}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize ${editData.type === t ? 'text-white' : 'text-slate-500'}`}
                        style={editData.type === t
                          ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }
                          : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {[
                  { key: 'name',  label: 'Full Name *',  ph: 'Sujit Kumar' },
                  { key: 'role',  label: 'Role *',       ph: 'Founder & CEO' },
                  { key: 'bio',   label: 'Bio',          ph: 'Brief biography…' },
                  { key: 'linkedin', label: 'LinkedIn URL', ph: 'https://linkedin.com/in/…' },
                  { key: 'github',   label: 'GitHub URL',   ph: 'https://github.com/…' },
                  { key: 'twitter',  label: 'Twitter/X URL',ph: 'https://twitter.com/…' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{f.label}</label>
                    {f.key === 'bio'
                      ? <textarea rows={2} className="input-glass resize-none" placeholder={f.ph}
                          value={editData[f.key] || ''} onChange={e => setEditData({...editData, [f.key]: e.target.value})} />
                      : <input type="text" className="input-glass" placeholder={f.ph}
                          value={editData[f.key] || ''} onChange={e => setEditData({...editData, [f.key]: e.target.value})} />
                    }
                  </div>
                ))}

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Profile Image</label>
                  <label className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                    style={{ border: '2px dashed rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.04)' }}>
                    <Upload className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-slate-400">{imageFile ? imageFile.name : 'Upload image or paste URL below'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  </label>
                  <input type="text" className="input-glass mt-2" placeholder="Or paste image URL…"
                    value={editData.image_url || ''} onChange={e => setEditData({...editData, image_url: e.target.value})} />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setModal(false)} className="flex-1 btn-outline-glow justify-center py-2.5">Cancel</button>
                  <button onClick={handleSave} disabled={saving || uploading || !editData.name || !editData.role}
                    className="flex-1 btn-glow text-white justify-center py-2.5">
                    {saving || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
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
