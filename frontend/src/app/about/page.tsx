'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Users, Code2, Star, Send, CheckCircle, Loader2, AlertCircle, ExternalLink, Menu, X, Mail, Globe } from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'

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
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    axios.get(`${API}/api/v1/founders/`)
      .then(r => setTeam(r.data))
      .catch(() => setTeam([]))
      .finally(() => setLoading(false))
  }, [])

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')
  const advisors   = team.filter(p => p.type === 'advisor')

  return (
    <div className="min-h-screen bg-white">
      
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="gov-strip hidden md:flex justify-between items-center">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-600" />
           <span>Arvix Labs — Official Administration Portal</span>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <a href="#" className="hover:text-primary transition-colors">Documentation</a>
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-[#0A2A66] tracking-tight text-xl uppercase">ARVIX LABS</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-slate-600 hover:text-primary transition-colors font-semibold">Home</Link>
            <Link href="/grievance" className="text-sm text-slate-600 hover:text-primary transition-colors font-semibold">Grievance Portal</Link>
            <Link href="/technologies" className="text-sm text-slate-600 hover:text-primary transition-colors font-semibold">Technologies</Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white px-6 pb-6 space-y-4 border-b">
            <Link href="/" className="block text-sm font-semibold text-slate-600 py-2 border-b">Home</Link>
            <Link href="/grievance" className="block text-sm font-semibold text-slate-600 py-2 border-b">Grievance Portal</Link>
            <Link href="/technologies" className="block text-sm font-semibold text-slate-600 py-2">Technologies</Link>
          </motion.div>
        )}
      </nav>

      <div className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto space-y-32">

          {/* Hero Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-[#0A2A66] mb-8 leading-tight">
              About Arvix Labs
            </h1>
            <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
              Arvix Labs is an organization dedicated to the ethical implementation of AI in state administration. We build tools that prioritize citizen trust and institutional transparency.
            </p>
          </motion.div>

          {/* Leadership Section */}
          {(loading || founders.length > 0) && (
            <div className="space-y-12">
              <div className="text-center">
                 <h2 className="text-3xl font-black text-[#0A2A66]">Leadership</h2>
                 <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-[0.2em]">Founding Council</p>
              </div>
              {loading ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {[1,2,3].map(i => <div key={i} className="gov-card h-80 shimmer" />)}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {founders.map(p => <PersonCard key={p.id} person={p} />)}
                </div>
              )}
            </div>
          )}

          {/* Engineering Section */}
          {!loading && developers.length > 0 && (
            <div className="space-y-12">
              <div className="text-center">
                 <h2 className="text-3xl font-black text-[#0A2A66]">Our Team</h2>
                 <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-[0.2em]">System Architects & Developers</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {developers.map(p => <PersonCard key={p.id} person={p} />)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-secondary py-12 px-6 border-t mt-auto">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-semibold text-xs uppercase tracking-widest">
            <p>© 2024 Arvix Labs — Dedicated to Open Governance</p>
            <div className="flex gap-8">
               <a href="#" className="hover:text-primary transition-colors">Legal</a>
               <a href="#" className="hover:text-primary transition-colors">Press</a>
               <a href="#" className="hover:text-primary transition-colors">Transparency</a>
            </div>
         </div>
      </footer>

      <ChatBot />
    </div>
  )
}
