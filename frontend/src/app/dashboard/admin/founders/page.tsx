'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Plus, Trash2, Edit3, Shield, Mail, Globe, 
  Linkedin, Github, Twitter, Save, X, Loader2, Search,
  ArrowRight, ShieldCheck, CheckCircle, Info
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image_url: string
  linkedin: string
  github: string
  twitter: string
  type: string
}

export default function AdminFoundersPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [form, setForm] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    linkedin: '',
    github: '',
    twitter: '',
    type: 'founder'
  })

  useEffect(() => {
    fetchTeam()
  }, [])

  const fetchTeam = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/v1/founders/`)
      setTeam(res.data)
    } catch (err) {
      console.error("Failed to fetch team:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      if (editing) {
        await axios.put(`${API}/api/v1/founders/${editing.id}`, form, config)
      } else {
        await axios.post(`${API}/api/v1/founders/`, form, config)
      }
      setIsModalOpen(false)
      fetchTeam()
      setEditing(null)
    } catch (err) {
      alert("Unauthorized: Executive Override Required.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to purge this record from existence?")) return
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    try {
      await axios.delete(`${API}/api/v1/founders/${id}`, config)
      fetchTeam()
    } catch (err) {
      alert("Unauthorized: Access Denied.")
    }
  }

  const openEdit = (m: TeamMember) => {
    setEditing(m)
    setForm(m)
    setIsModalOpen(true)
  }

  const openAdd = () => {
    setEditing(null)
    setForm({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      linkedin: '',
      github: '',
      twitter: '',
      type: 'founder'
    })
    setIsModalOpen(true)
  }

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen pb-24 bg-[#00040d]">
      <Topbar title="Foundation Control" subtitle="Manage your sovereign council & architects" />
      
      <div className="px-8 py-8 space-y-8">
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 glass-card p-6 border-white/5 bg-white/[0.02]">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                 className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs font-black uppercase tracking-widest text-white focus:border-blue-500/50 transition-all outline-none"
                 placeholder="Search Council Members..."
                 value={search}
                 onChange={e => setSearch(e.target.value)}
              />
           </div>
           <button 
              onClick={openAdd}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
           >
              <Plus className="w-4 h-4" /> Recruit Architect
           </button>
        </div>

        {/* Members Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="h-80 rounded-[2rem] bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeam.map((member) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={member.id}
                className="glass-card group overflow-hidden border-white/5 hover:border-blue-500/20 transition-all duration-500 flex flex-col"
              >
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                     {member.image_url ? (
                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-gradient-to-br from-[#00040d] to-blue-900/40 text-white/5">
                           {member.name[0]}
                        </div>
                     )}
                     <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 backdrop-blur-md">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest leading-none pt-0.5">{member.type}</p>
                     </div>
                  </div>

                  <div className="p-8 flex-1 space-y-4">
                     <div className="flex justify-between items-start">
                        <div>
                           <h3 className="text-xl font-black text-white tracking-tighter leading-none">{member.name}</h3>
                           <p className="text-[10px] font-black text-blue-500/60 uppercase tracking-widest mt-2">{member.role}</p>
                        </div>
                        <div className="flex gap-2">
                           <button onClick={() => openEdit(member)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600/20 hover:border-blue-500/30 transition-all">
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(member.id)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                        {member.bio || "No biometric data available for this operative."}
                     </p>
                  </div>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredTeam.length === 0 && (
          <div className="py-40 text-center space-y-6">
             <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-10 h-10 text-white/10" />
             </div>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">No Personnel Found in Secondary Cluster</p>
          </div>
        )}

      </div>

      {/* Modal / Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="relative w-full max-w-2xl glass-card !p-0 overflow-hidden border-white/10 shadow-3xl bg-slate-900"
            >
              <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{editing ? 'Optimize Operative' : 'Recruit Architect'}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Founding Council Protocol</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Full Identity</label>
                       <input 
                          required className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
                          placeholder="Arjun Sharma"
                          value={form.name}
                          onChange={e => setForm({...form, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Strategic Role</label>
                       <input 
                          required className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
                          placeholder="Lead Architect"
                          value={form.role}
                          onChange={e => setForm({...form, role: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Structural Type</label>
                    <select 
                       className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                       value={form.type}
                       onChange={e => setForm({...form, type: e.target.value})}
                    >
                       <option value="founder">Founding Council</option>
                       <option value="developer">System Architect</option>
                       <option value="advisor">Strategic Advisor</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Neural Narrative (Bio)</label>
                    <textarea 
                       rows={4}
                       className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all resize-none"
                       placeholder="Deep tech visionary with focus on AI-driven governance..."
                       value={form.bio}
                       onChange={e => setForm({...form, bio: e.target.value})}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Biometric Uplink (Image URL)</label>
                    <input 
                       className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 text-sm font-bold text-white focus:border-blue-500/50 outline-none transition-all"
                       placeholder="https://..."
                       value={form.image_url}
                       onChange={e => setForm({...form, image_url: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 flex items-center gap-2"><Linkedin className="w-3 h-3"/> LinkedIn</label>
                       <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white" value={form.linkedin} onChange={e => setForm({...form, linkedin: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 flex items-center gap-2"><Github className="w-3 h-3"/> Github</label>
                       <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white" value={form.github} onChange={e => setForm({...form, github: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-2 flex items-center gap-2"><Twitter className="w-3 h-3"/> Twitter</label>
                       <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-xs text-white" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} />
                    </div>
                 </div>
              </form>

              <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all">Cancel</button>
                 <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="px-10 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                 >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {editing ? 'Update Registry' : 'Initialize Node'}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
