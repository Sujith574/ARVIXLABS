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
  Activity,
  Brain,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  founder:   { label: '★ Leadership',  color: '#0A2A66' },
  developer: { label: '⚡ Engineering', color: '#3B82F6' },
  advisor:   { label: '◈ Advisory',   color: '#6B46C1' },
}

function PersonCard({ person }: { person: any }) {
  const cfg = TYPE_CONFIG[person.type] || TYPE_CONFIG.developer
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="gov-card p-10 bg-white flex flex-col items-center text-center">

      <div className="w-24 h-24 rounded-full mb-6 border-2 border-slate-100 p-1">
        {person.image_url ? (
          <img src={person.image_url} alt={person.name}
            className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-black bg-slate-50 text-[#0A2A66]">
            {person.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-slate-100 bg-slate-50 text-slate-500">
          {cfg.label}
        </span>
      </div>

      <h3 className="text-xl font-bold text-[#0A2A66] mb-1">{person.name}</h3>
      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">{person.role}</p>
      <p className="text-slate-500 text-sm leading-relaxed mb-8">{person.bio}</p>

      <div className="mt-auto pt-6 border-t w-full flex justify-center gap-4">
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener" className="text-slate-400 hover:text-blue-700 transition-colors">
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
        {person.github && (
          <a href={person.github} target="_blank" rel="noopener" className="text-slate-400 hover:text-black transition-colors">
            <Globe className="w-5 h-5" />
          </a>
        )}
        {person.twitter && (
          <a href={person.twitter} target="_blank" rel="noopener" className="text-slate-400 hover:text-blue-400 transition-colors">
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`} className="text-slate-400 hover:text-red-500 transition-colors">
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const [team, setTeam] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/v1/founders/`)
      .then(r => setTeam(r.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')

  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      <section className="pt-32 pb-48 px-6 relative overflow-hidden">
        <div className="aurora opacity-30" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-48 relative z-10">
          
          {/* Organization Mission Header */}
          <div className="text-center max-w-4xl mx-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full arvix-glass border-white/10 text-arvix-accent text-[10px] font-black uppercase tracking-[0.5em] mb-10"
             >
                <Shield className="w-4 h-4" /> Node Authorization: Arvix Labs
             </motion.div>
             <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-7xl md:text-[100px] font-display font-black leading-[0.9] tracking-tighter mb-10 arvix-text-gradient"
             >
                Ethical AI <br/>
                <span className="arvix-accent-gradient">Sovereignty</span>
             </motion.h1>
             <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-3xl mx-auto mb-16">
                Arvix Labs is a decentralized intelligence collective dedicated to the ethical implementation of state-scale automation. We engineer trust into the foundation of civil administration.
             </p>
          </div>

          {/* Pillars of the Organization */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
               { icon: Activity, title: 'Total Transparency', desc: 'Every administrative decision is auditable and immutable via the Arvix Trust Protocol.' },
               { icon: Brain, title: 'Adaptive Intelligence', desc: 'Neural networks that evolve with regional needs to provide zero-latency civil support.' },
               { icon: ShieldCheck, title: 'Inherent Security', desc: 'Advanced AES-512 encryption and decentralized logic protect all sovereign data nodes.' },
             ].map((p, i) => (
                <motion.div 
                  key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="arvix-card space-y-8 group border-white/5 hover:bg-white/[0.03] transition-all"
                >
                   <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-arvix-accent group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all duration-500">
                      <p.icon className="w-8 h-8" />
                   </div>
                   <h3 className="text-2xl font-bold text-white tracking-tight">{p.title}</h3>
                   <p className="text-slate-500 leading-relaxed font-medium">{p.desc}</p>
                </motion.div>
             ))}
          </div>

          {/* Detailed Statistics Section */}
          <div className="arvix-card !p-0 overflow-hidden border-white/5">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-white/5 md:border-white/5">
                {[
                  { label: 'Global Nodes', val: '128' },
                  { label: 'Identity Clusters', val: '42' },
                  { label: 'Uptime Integrity', val: '99.99%' },
                  { label: 'Citizens Served', val: '2.4M+' },
                ].map((s, i) => (
                   <div key={i} className="p-16 text-center space-y-4 bg-white/[0.01] hover:bg-white/[0.04] transition-all cursor-default">
                      <p className="text-5xl font-display font-black text-white tracking-tighter">{s.val}</p>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{s.label}</p>
                   </div>
                ))}
             </div>
          </div>

          {/* Team Call to Action */}
          <div className="relative arvix-card bg-arvix-accent/5 border-arvix-accent/10 flex flex-col items-center text-center space-y-12 py-24">
             <div className="absolute top-0 right-0 w-64 h-64 bg-arvix-accent/10 blur-[120px] -mr-32 -mt-32" />
             <div className="max-w-2xl space-y-6 relative z-10">
                <h2 className="text-5xl font-display font-black text-white tracking-tighter">Meet the <span className="arvix-accent-gradient">Engineers</span></h2>
                <p className="text-slate-400 font-medium leading-relaxed">
                   Arvix Labs is powered by a global collective of architects and strategists. Explore the directory of those pioneering sovereign intelligence.
                </p>
             </div>
             <Link href="/founders" className="arvix-button-primary px-16 py-6 text-base group relative z-10">
                Founding Council <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
             </Link>
          </div>

        </div>
      </section>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">© 2026 Arvix Labs — Authorized Global Directory</p>
      </footer>

      <ChatBot />
    </div>
  )
}
