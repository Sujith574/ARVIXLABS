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
  Menu, 
  X, 
  Mail, 
  Globe,
  ArrowRight
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  founder:   { label: 'Founding Member',  color: '#0A2A66', bg: '#EFF6FF' },
  developer: { label: 'System Architect', color: '#6366F1', bg: '#EEF2FF' },
  advisor:   { label: 'Strategic Advisor', color: '#059669', bg: '#ECFDF5' },
}

function PersonCard({ person }: { person: any }) {
  const cfg = TYPE_CONFIG[person.type] || TYPE_CONFIG.developer
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true }}
      className="gov-card p-0 overflow-hidden group hover:shadow-2xl transition-all duration-500 border-slate-200">
      
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        {person.image_url ? (
          <img src={person.image_url} alt={person.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-black bg-slate-50 text-[#0A2A66]">
            {person.name.charAt(0)}
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 text-[10px] font-black uppercase tracking-widest text-[#0A2A66] shadow-sm">
           {cfg.label}
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-bold text-[#0A2A66] mb-1">{person.name}</h3>
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">{person.role}</p>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 h-20 overflow-hidden text-ellipsis line-clamp-3">
          {person.bio}
        </p>

        <div className="pt-6 border-t w-full flex justify-between items-center">
           <div className="flex gap-4">
              {person.linkedin && (
                <a href={person.linkedin} target="_blank" rel="noopener" className="text-slate-400 hover:text-blue-600 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
              {person.github && (
                <a href={person.github} target="_blank" rel="noopener" className="text-slate-400 hover:text-black transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
           </div>
           {person.email && (
             <a href={`mailto:${person.email}`} className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 uppercase tracking-widest">
               <Mail className="w-4 h-4" /> Message
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
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Contact form
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent]     = useState(false)
  const [sendErr, setSendErr] = useState('')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    
    axios.get(`${API}/api/v1/founders/`)
      .then(r => setTeam(r.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSendErr('')
    try {
      await axios.post(`${API}/api/v1/contact/`, form)
      setSent(true)
    } catch {
      setSendErr('Administrative dispatch failed. Please verify your connection.')
    } finally { setSending(false) }
  }

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <span className="font-display font-black text-[#0A2A66] text-2xl tracking-tighter">ARVIX LABS</span>
          </Link>
          <div className="hidden lg:flex items-center gap-10">
            {['Home', 'Grievance', 'Technologies', 'Analytics', 'Founders'].map(l => (
              <Link key={l} href={l === 'Home' ? '/' : `/${l.toLowerCase()}`} className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-colors">
                {l}
              </Link>
            ))}
          </div>
          <Link href="/grievance" className="hidden lg:block gov-gradient-button px-6 py-2.5 text-sm">Submit Grievance</Link>
        </div>
      </nav>

      <div className="pt-20 pb-32 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-32 relative z-10">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
             <h1 className="text-5xl md:text-7xl font-display font-black text-[#0A2A66] mb-8 tracking-tight leading-[1.1]">
                Visionary <span className="gradient-text">Leadership</span> behind Arvix
             </h1>
             <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Our Founding Council and System Architects are dedicated to bridging the gap between public service and frontier AI intelligence.
             </p>
          </motion.div>

          {/* Pillars */}
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: Shield, title: 'Institutional Trust',  desc: 'Auditable transparency in every transaction.', color: '#0A2A66' },
              { icon: Users,   title: 'Human-Centric',   desc: 'Design that prioritizes ease of access for all citizens.', color: '#3B82F6' },
              { icon: Code2,  title: 'Engineering Rigor',    desc: 'Powered by Gemini 2.0 and state-of-the-art RAG.', color: '#6366F1' },
            ].map((c, i) => (
              <div key={i} className="text-center p-12 gov-card border-slate-100 hover:bg-white hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-slate-50 group-hover:bg-blue-50 transition-colors" style={{ color: c.color }}>
                  <c.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-4">{c.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Leadership */}
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
               <div>
                  <h2 className="text-4xl font-display font-black tracking-tight">Founding Council</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Executive Leadership & Strategic Direction</p>
               </div>
               <div className="px-4 py-2 bg-blue-50 rounded-lg text-blue-600 text-xs font-bold uppercase tracking-widest">
                  Board Certified 2024
               </div>
            </div>
            
            {loading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[1,2,3].map(i => <div key={i} className="h-[400px] rounded-2xl bg-slate-100 shimmer" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {founders.map(person => <PersonCard key={person.name} person={person} />)}
              </div>
            )}
          </div>

          {/* Engineering */}
          {!loading && developers.length > 0 && (
            <div className="space-y-16">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b pb-8">
                 <div>
                    <h2 className="text-4xl font-display font-black tracking-tight">Technical Team</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">System Architects & Intelligence Engineers</p>
                 </div>
              </div>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {developers.map(person => <PersonCard key={person.name} person={person} />)}
              </div>
            </div>
          )}

          {/* Inquiry Center */}
          <div className="max-w-4xl mx-auto">
             <div className="gov-card p-0 overflow-hidden bg-white shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                   <div className="p-16 bg-[#0A2A66] text-white space-y-8">
                      <h2 className="text-4xl font-display font-black tracking-tight">Official Inquiry Center</h2>
                      <p className="text-white/60 font-medium">For corporate partnerships, media consultations, or institutional requirements.</p>
                      
                      <div className="space-y-6 pt-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-400" /></div>
                            <span className="text-sm font-bold">hq@arvixlabs.gov.in</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center"><Globe className="w-5 h-5 text-blue-400" /></div>
                            <span className="text-sm font-bold">Administrative Block, Cyberabad</span>
                         </div>
                      </div>
                   </div>

                   <div className="p-16">
                      {sent ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                           <div className="w-20 h-20 rounded-full bg-green-50 text-green-600 flex items-center justify-center"><CheckCircle className="w-10 h-10" /></div>
                           <h3 className="text-2xl font-bold">Dispatch Confirmed</h3>
                           <p className="text-slate-500 font-medium text-sm">Our administration will respond within 48 business hours.</p>
                           <button onClick={() => setSent(false)} className="gov-button-outline px-8">New Message</button>
                        </div>
                      ) : (
                        <form onSubmit={handleContact} className="space-y-6">
                           <input required className="gov-input" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                           <input required type="email" className="gov-input" placeholder="Official Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                           <textarea required rows={5} className="gov-input resize-none" placeholder="Administrative or Technical requirements..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                           <button type="submit" disabled={sending} className="w-full gov-gradient-button py-4 text-lg">
                              {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Official Inquiry'}
                           </button>
                        </form>
                      )}
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      <footer className="bg-white py-12 px-6 border-t mt-auto text-center font-display font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
         © 2024 Arvix Labs — Official Leadership Directory
      </footer>

      <ChatBot />
    </div>
  )
}
