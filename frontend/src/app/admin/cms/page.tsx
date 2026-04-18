'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Plus, Trash2, Edit2, X, Loader2, Settings, FileText, BarChart3, Lightbulb } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

type Tab = 'hero' | 'features' | 'solutions' | 'stats'

const ICON_OPTIONS = ['Brain', 'BarChart3', 'Globe', 'Zap', 'Database', 'Users', 'Shield', 'Star', 'CheckCircle', 'FileText']
const COLORS = ['#3b82f6', '#22d3ee', '#a78bfa', '#10b981', '#f59e0b', '#f97316', '#ef4444']

export default function AdminCMSPage() {
  const [tab, setTab] = useState<Tab>('hero')

  // Hero / site settings
  const [settings, setSettings] = useState<any>({})
  const [settingsSaving, setSettingsSaving] = useState(false)

  // Features
  const [features, setFeatures] = useState<any[]>([])
  const [editFeature, setEditFeature] = useState<any>(null)
  const [featureModal, setFeatureModal] = useState(false)
  const [featureSaving, setFeatureSaving] = useState(false)

  // Solutions
  const [solutions, setSolutions] = useState<any[]>([])
  const [editSolution, setEditSolution] = useState<any>(null)
  const [solutionModal, setSolutionModal] = useState(false)
  const [solutionSaving, setSolutionSaving] = useState(false)

  // Stats
  const [stats, setStats] = useState<any[]>([])
  const [editStat, setEditStat] = useState<any>(null)
  const [statModal, setStatModal] = useState(false)
  const [statSaving, setStatSaving] = useState(false)

  const loadAll = async () => {
    try {
      const [s, f, sol, st] = await Promise.all([
        axios.get(`${API}/api/v1/cms/settings`),
        axios.get(`${API}/api/v1/cms/features`),
        axios.get(`${API}/api/v1/cms/solutions`),
        axios.get(`${API}/api/v1/cms/stats`),
      ])
      setSettings(s.data)
      setFeatures(f.data)
      setSolutions(sol.data)
      setStats(st.data)
    } catch (err) {
      console.error("Failed to load CMS data:", err)
    }
  }

  useEffect(() => { loadAll() }, [])

  // Save hero settings
  const saveSettings = async () => {
    setSettingsSaving(true)
    try {
      await axios.put(`${API}/api/v1/cms/settings`, settings, { headers: headers() })
      alert("Settings updated successfully")
    } catch (err) { 
      console.error("Save settings error:", err)
      alert("Failed to save settings")
    } finally { setSettingsSaving(false) }
  }

  // Features CRUD
  const saveFeature = async () => {
    setFeatureSaving(true)
    try {
      if (editFeature.id && features.find(f => f.id === editFeature.id)) {
        await axios.put(`${API}/api/v1/cms/features/${editFeature.id}`, editFeature, { headers: headers() })
        setFeatures(f => f.map(x => x.id === editFeature.id ? editFeature : x))
      } else {
        const res = await axios.post(`${API}/api/v1/cms/features`, editFeature, { headers: headers() })
        setFeatures(f => [...f, res.data])
      }
      setFeatureModal(false)
    } catch (err) {
      console.error("Save feature error:", err)
      alert("Failed to save feature")
    } finally { setFeatureSaving(false) }
  }
  const delFeature = async (id: string) => {
    await axios.delete(`${API}/api/v1/cms/features/${id}`, { headers: headers() })
    setFeatures(f => f.filter(x => x.id !== id))
  }

  // Solutions CRUD
  const saveSolution = async () => {
    setSolutionSaving(true)
    try {
      if (editSolution.id && solutions.find(s => s.id === editSolution.id)) {
        await axios.put(`${API}/api/v1/cms/solutions/${editSolution.id}`, editSolution, { headers: headers() })
        setSolutions(s => s.map(x => x.id === editSolution.id ? editSolution : x))
      } else {
        const res = await axios.post(`${API}/api/v1/cms/solutions`, editSolution, { headers: headers() })
        setSolutions(s => [...s, res.data])
      }
      setSolutionModal(false)
    } catch { } finally { setSolutionSaving(false) }
  }
  const delSolution = async (id: string) => {
    await axios.delete(`${API}/api/v1/cms/solutions/${id}`, { headers: headers() })
    setSolutions(s => s.filter(x => x.id !== id))
  }

  // Stats CRUD
  const saveStat = async () => {
    setStatSaving(true)
    try {
      if (editStat.id && stats.find(s => s.id === editStat.id)) {
        await axios.put(`${API}/api/v1/cms/stats/${editStat.id}`, editStat, { headers: headers() })
        setStats(s => s.map(x => x.id === editStat.id ? editStat : x))
      } else {
        const res = await axios.post(`${API}/api/v1/cms/stats`, editStat, { headers: headers() })
        setStats(s => [...s, res.data])
      }
      setStatModal(false)
    } catch { } finally { setStatSaving(false) }
  }
  const delStat = async (id: string) => {
    await axios.delete(`${API}/api/v1/cms/stats/${id}`, { headers: headers() })
    setStats(s => s.filter(x => x.id !== id))
  }

  const TABS: { id: Tab; label: string; icon: any }[] = [
    { id: 'hero',      label: 'Hero / Settings', icon: Settings },
    { id: 'features',  label: 'Features',        icon: Lightbulb },
    { id: 'solutions', label: 'Solutions',       icon: FileText },
    { id: 'stats',     label: 'Stats Bar',       icon: BarChart3 },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-white">Content Manager</h1>

      {/* Tab bar */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
              style={tab === t.id ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' } : {}}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── Hero Settings ─────────────────────────────────────────────────── */}
      {tab === 'hero' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold">Hero Section & Site Settings</h2>
            <button onClick={saveSettings} disabled={settingsSaving} className="btn-glow text-white px-5 py-2.5">
              {settingsSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
            </button>
          </div>
          {[
            { key: 'hero_title',    label: 'Hero Title',          type: 'text' },
            { key: 'hero_subtitle', label: 'Hero Subtitle',       type: 'text' },
            { key: 'hero_cta_label',label: 'CTA Button Text',     type: 'text' },
            { key: 'hero_badge',    label: 'Badge Text',          type: 'text' },
            { key: 'contact_email', label: 'Contact Email',       type: 'email' },
            { key: 'footer_tagline',label: 'Footer Tagline',      type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{f.label}</label>
              <input type={f.type} className="input-glass"
                value={settings[f.key] || ''} onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} />
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Features ───────────────────────────────────────────────────────── */}
      {tab === 'features' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">{features.length} features on homepage</p>
            <button onClick={() => { setEditFeature({ title:'', description:'', icon:'Zap', color:'#3b82f6' }); setFeatureModal(true) }}
              className="btn-glow text-white"><Plus className="w-4 h-4" /> Add Feature</button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={f.id || i} className="glass-card p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30`, color: f.color }}>
                  {f.icon?.[0] || 'F'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">{f.description}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditFeature(f); setFeatureModal(true) }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => delFeature(f.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Solutions ──────────────────────────────────────────────────────── */}
      {tab === 'solutions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">{solutions.length} solutions on homepage</p>
            <button onClick={() => { setEditSolution({ title:'', description:'', icon:'Shield', color:'#22d3ee', tags:[] }); setSolutionModal(true) }}
              className="btn-glow text-white"><Plus className="w-4 h-4" /> Add Solution</button>
          </div>
          <div className="space-y-3">
            {solutions.map((s, i) => (
              <div key={s.id || i} className="glass-card p-5 flex gap-4 items-start">
                <div className="flex-1">
                  <p className="text-white font-semibold">{s.title}</p>
                  <p className="text-slate-500 text-sm mt-1">{s.description}</p>
                  <div className="flex gap-2 mt-2">
                    {(s.tags || []).map((t: string) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full text-slate-400"
                        style={{ border: '1px solid rgba(255,255,255,0.1)' }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEditSolution(s); setSolutionModal(true) }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => delSolution(s.id)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      {tab === 'stats' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-slate-400 text-sm">{stats.length} stats on homepage</p>
            <button onClick={() => { setEditStat({ label:'', value:'', icon:'Zap' }); setStatModal(true) }}
              className="btn-glow text-white"><Plus className="w-4 h-4" /> Add Stat</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={s.id || i} className="glass-card p-5 text-center relative group">
                <p className="text-2xl font-black gradient-text mb-1">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditStat(s); setStatModal(true) }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10">
                    <Edit2 className="w-3 h-3" /></button>
                  <button onClick={() => delStat(s.id)}
                    className="p-1 rounded text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Feature Modal ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {featureModal && editFeature && (
          <Modal title={editFeature.id ? 'Edit Feature' : 'New Feature'} onClose={() => setFeatureModal(false)}>
            <FormGroup label="Title"><input className="input-glass" value={editFeature.title || ''} onChange={e => setEditFeature({...editFeature, title: e.target.value})} /></FormGroup>
            <FormGroup label="Description"><textarea rows={3} className="input-glass resize-none" value={editFeature.description || ''} onChange={e => setEditFeature({...editFeature, description: e.target.value})} /></FormGroup>
            <FormGroup label="Icon">
              <select className="input-glass" value={editFeature.icon || 'Zap'} onChange={e => setEditFeature({...editFeature, icon: e.target.value})}>
                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Color">
              <div className="flex gap-2 flex-wrap"><input type="color" className="w-10 h-10 rounded-lg cursor-pointer" value={editFeature.color || '#3b82f6'} onChange={e => setEditFeature({...editFeature, color: e.target.value})} />
                {COLORS.map(c => <button key={c} onClick={() => setEditFeature({...editFeature, color: c})} className="w-7 h-7 rounded-lg border-2 transition-all" style={{ background: c, borderColor: editFeature.color === c ? 'white' : 'transparent' }} />)}
              </div>
            </FormGroup>
            <ModalFooter onClose={() => setFeatureModal(false)} onSave={saveFeature} saving={featureSaving} />
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Solution Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {solutionModal && editSolution && (
          <Modal title={editSolution.id ? 'Edit Solution' : 'New Solution'} onClose={() => setSolutionModal(false)}>
            <FormGroup label="Title"><input className="input-glass" value={editSolution.title || ''} onChange={e => setEditSolution({...editSolution, title: e.target.value})} /></FormGroup>
            <FormGroup label="Description"><textarea rows={3} className="input-glass resize-none" value={editSolution.description || ''} onChange={e => setEditSolution({...editSolution, description: e.target.value})} /></FormGroup>
            <FormGroup label="Tags (comma separated)"><input className="input-glass" value={(editSolution.tags || []).join(', ')} onChange={e => setEditSolution({...editSolution, tags: e.target.value.split(',').map((t: string) => t.trim())})} /></FormGroup>
            <FormGroup label="Icon">
              <select className="input-glass" value={editSolution.icon || 'Shield'} onChange={e => setEditSolution({...editSolution, icon: e.target.value})}>
                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </FormGroup>
            <FormGroup label="Color">
              <div className="flex gap-2">
                {COLORS.map(c => <button key={c} onClick={() => setEditSolution({...editSolution, color: c})} className="w-7 h-7 rounded-lg border-2 transition-all" style={{ background: c, borderColor: editSolution.color === c ? 'white' : 'transparent' }} />)}
              </div>
            </FormGroup>
            <ModalFooter onClose={() => setSolutionModal(false)} onSave={saveSolution} saving={solutionSaving} />
          </Modal>
        )}
      </AnimatePresence>

      {/* ── Stat Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {statModal && editStat && (
          <Modal title={editStat.id ? 'Edit Stat' : 'New Stat'} onClose={() => setStatModal(false)}>
            <FormGroup label="Label"><input className="input-glass" value={editStat.label || ''} onChange={e => setEditStat({...editStat, label: e.target.value})} /></FormGroup>
            <FormGroup label="Value"><input className="input-glass" placeholder="e.g. 98.7%" value={editStat.value || ''} onChange={e => setEditStat({...editStat, value: e.target.value})} /></FormGroup>
            <FormGroup label="Icon">
              <select className="input-glass" value={editStat.icon || 'Zap'} onChange={e => setEditStat({...editStat, icon: e.target.value})}>
                {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </FormGroup>
            <ModalFooter onClose={() => setStatModal(false)} onSave={saveStat} saving={statSaving} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Reusable modal helpers ──────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="glass-card p-8 w-full max-w-md space-y-4" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-lg">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
          {children}
        </div>
      </motion.div>
    </>
  )
}
function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{label}</label>
      {children}
    </div>
  )
}
function ModalFooter({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex gap-3 pt-2">
      <button onClick={onClose} className="flex-1 btn-outline-glow justify-center py-2.5">Cancel</button>
      <button onClick={onSave} disabled={saving} className="flex-1 btn-glow text-white justify-center py-2.5">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
      </button>
    </div>
  )
}
