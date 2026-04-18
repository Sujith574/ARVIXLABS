'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  Users, 
  Code2, 
  Star, 
  Send, 
  CheckCircle, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  Mail, 
  Globe,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TYPE_CONFIG: Record<string, { label: string; accent: string }> = {
  founder:   { label: 'Founding Architect',  accent: 'cyan' },
  developer: { label: 'System Engineer', accent: 'indigo' },
  advisor:   { label: 'Strategic Envoy', accent: 'violet' },
}

function PersonCard({ person }: { person: any }) {
  const cfg = TYPE_CONFIG[person.type] || TYPE_CONFIG.developer
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="arvix-card !p-0 overflow-hidden group border-white/5 hover:border-arvix-accent/30 transition-all duration-500">
      
      <div className="relative h-72 bg-slate-900/50 overflow-hidden">
        {person.image_url ? (
          <img src={person.image_url} alt={person.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-black bg-arvix-bg text-white/5 relative">
            <div className="absolute inset-0 grid-overlay opacity-30" />
            <span className="relative z-10">{person.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-6 right-6 arvix-glass px-4 py-2 rounded-xl border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-arvix-accent shadow-2xl">
           {cfg.label}
        </div>
      </div>

      <div className="p-8 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <h3 className="text-2xl font-bold text-white mb-1 tracking-tight">{person.name}</h3>
        <p className="text-[10px] font-black text-arvix-accent/60 uppercase tracking-[0.4em] mb-4">{person.role}</p>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 h-20 overflow-hidden text-ellipsis line-clamp-3">
          {person.bio}
        </p>

        <div className="pt-6 border-t border-white/5 w-full flex justify-between items-center">
           <div className="flex gap-5">
              {person.linkedin && (
                <a href={person.linkedin} target="_blank" rel="noopener" className="text-white/20 hover:text-arvix-accent transition-all hover:scale-110">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {person.github && (
                <a href={person.github} target="_blank" rel="noopener" className="text-white/20 hover:text-white transition-all hover:scale-110">
                  <Globe className="w-5 h-5" />
                </a>
              )}
           </div>
           {person.email && (
             <a href={`mailto:${person.email}`} className="text-[9px] font-black text-white/20 hover:text-arvix-accent transition-all uppercase tracking-[0.3em] flex items-center gap-2">
               <Mail className="w-4 h-4" /> SECURE LINK
             </a>
           )}
        </div>
      </div>
    </motion.div>
  )
}

export default function FoundersPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Contact form
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)
  const [sendErr, setSendErr] = useState('')

  useEffect(() => {
    axios.get(`${API}/api/v1/founders/`)
      .then(r => setTeam(r.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSendErr('')
    try {
      await axios.post(`${API}/api/v1/contact/`, form)
      setSent(true)
    } catch {
      setSendErr('Dispatch Error: Neural link failure in sector 7.')
    } finally { setSending(false) }
  }

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')

  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      <section className="pt-32 pb-48 px-6 overflow-hidden relative border-b border-white/5">
        <div className="aurora opacity-30" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-48 relative z-10">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
             <span className="text-arvix-accent text-xs font-black uppercase tracking-[0.5em] mb-10 block">System Architects</span>
             <h1 className="text-7xl md:text-9xl font-display font-black leading-none tracking-tighter mb-10 arvix-text-gradient">
                Visionary <br/>
                <span className="arvix-accent-gradient">Sovereignty</span>
             </h1>
             <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                The Architects and Engineers behind the Arvix Core infrastructure, dedicated to pioneering the next evolution of sovereign intelligence.
             </p>
          </motion.div>

          {/* Pillars */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Administrative Trust',  desc: 'Auditable transparency in every system transaction.', color: 'arvix-accent' },
              { icon: Cpu,   title: 'Heuristic Logic',   desc: 'Design that prioritizes ease of access via ALX-2 nodes.', color: 'arvix-secondary' },
              { icon: Database,  title: 'Global SCM',    desc: 'Powered by Arvix AI and state-of-the-art redundancy.', color: 'arvix-violet' },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="arvix-card text-center !p-12 border-white/5 hover:bg-white/5 transition-all group">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white/5 border border-white/10 group-hover:scale-110 group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all duration-500`}>
                  <c.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white tracking-tight">{c.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Leadership */}
          <div className="space-y-20">
            <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
               <div>
                  <h2 className="text-5xl font-display font-black tracking-tighter text-white">Founding Council</h2>
                  <p className="text-arvix-accent text-[10px] font-black uppercase tracking-[0.4em] mt-3">Strategic Direction & System Oversight</p>
               </div>
               <div className="px-5 py-2 arvix-glass border-white/10 text-white/50 text-[9px] font-black uppercase tracking-widest">
                  EST. 2026 CLUSTER-1
               </div>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-[500px] rounded-3xl bg-white/5 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {founders.map(person => <PersonCard key={person.name} person={person} />)}
              </div>
            )}
          </div>

          {/* Engineering */}
          {!loading && developers.length > 0 && (
            <div className="space-y-20">
              <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
                 <div>
                    <h2 className="text-5xl font-display font-black tracking-tighter text-white">System Architects</h2>
                    <p className="text-arvix-accent text-[10px] font-black uppercase tracking-[0.4em] mt-3">Neural Engineering & Frontend Core</p>
                 </div>
              </div>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {developers.map(person => <PersonCard key={person.name} person={person} />)}
              </div>
            </div>
          )}

          {/* Inquiry Center */}
          <div className="max-w-5xl mx-auto pt-32">
             <div className="arvix-card !p-0 overflow-hidden border-white/5 shadow-2xl relative">
                <div className="absolute inset-0 grid-overlay opacity-10" />
                <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                   <div className="p-16 bg-white/5 border-r border-white/5 space-y-10">
                      <h2 className="text-5xl font-display font-black tracking-tighter text-white">Secure Inquiry <br/><span className="arvix-accent-gradient">Node</span></h2>
                      <p className="text-slate-400 font-medium leading-relaxed">For strategic partnerships, sovereign alignment, or cross-node integrations.</p>
                      
                      <div className="space-y-8 pt-8">
                         <a href="mailto:arvixlabs@gmail.com" className="flex items-center gap-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-arvix-accent/10 border border-arvix-accent/20 flex items-center justify-center text-arvix-accent group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all"><Mail className="w-6 h-6" /></div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Communications</p>
                               <span className="text-sm font-bold text-white group-hover:text-arvix-accent transition-colors">arvixlabs@gmail.com</span>
                            </div>
                         </a>
                         <div className="flex items-center gap-6 group">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-white group-hover:text-slate-950 transition-all"><Globe className="w-6 h-6" /></div>
                            <div className="space-y-1">
                               <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Physical Cluster</p>
                               <span className="text-sm font-bold text-white">Sector Alpha-1, Neo District</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-16 bg-arvix-bg/50">
                      {sent ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                           <div className="w-24 h-24 rounded-full bg-arvix-accent/10 text-arvix-accent border border-arvix-accent/20 flex items-center justify-center animate-pulse"><CheckCircle className="w-10 h-10" /></div>
                           <div className="space-y-2">
                              <h3 className="text-3xl font-bold text-white tracking-tight">Node Sync Complete</h3>
                              <p className="text-slate-500 font-medium text-sm">Response scheduled within 48 cycles.</p>
                           </div>
                           <button onClick={() => setSent(false)} className="arvix-button-outline px-10 py-4 text-xs">NEW TRANSMISSION</button>
                        </div>
                      ) : (
                        <form onSubmit={handleContact} className="space-y-6">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Identity Protocol</label>
                              <input required className="arvix-input" placeholder="Name / Organization" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Contact Node</label>
                              <input required type="email" className="arvix-input" placeholder="secure-node@gov.in" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black text-white/20 uppercase tracking-widest ml-1">Payload Content</label>
                              <textarea required rows={5} className="arvix-input resize-none" placeholder="Provide inquiry details..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                           </div>
                           <button type="submit" disabled={sending} className="w-full arvix-button-primary py-5 text-sm tracking-[0.2em]">
                              {sending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'DISPATCH PROTOCOL'}
                           </button>
                        </form>
                      )}
                   </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 Arvix Labs — Authorized Council Directory</p>
      </footer>

      <ChatBot />
    </div>
  )
}
