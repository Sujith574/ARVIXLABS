'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Users, Code2, Star, ExternalLink } from 'lucide-react'
import ChatBot from '@/components/ui/ChatBot'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const mockTeam = {
  founders: [
    {
      id: '1', name: 'Sujit Kumar', role: 'Founder & CEO',
      bio: 'Visionary technologist and AI researcher driving the future of government transparency through intelligent data systems.',
      type: 'founder', linkedin: '#', github: '#', twitter: '#',
    },
  ],
  developers: [
    {
      id: '2', name: 'Lead Engineer', role: 'Full-Stack AI Engineer',
      bio: 'Architect of the RAG pipeline and vector search infrastructure powering the intelligence engine.',
      type: 'developer', linkedin: '#', github: '#', twitter: '#',
    },
    {
      id: '3', name: 'Frontend Dev', role: 'UI/UX Engineer',
      bio: 'Crafting the premium government-tech interface with Three.js and Framer Motion.',
      type: 'developer', linkedin: '#', github: '#',
    },
    {
      id: '4', name: 'Backend Dev', role: 'FastAPI Specialist',
      bio: 'Building scalable microservices, async APIs, and PostgreSQL-backed data pipelines.',
      type: 'developer', linkedin: '#', github: '#',
    },
  ],
}

function PersonCard({ person, isFounder }: { person: any; isFounder: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 group cursor-default"
      style={{ border: isFounder ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(59,130,246,0.15)' }}
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black"
        style={
          person.image_url
            ? { backgroundImage: `url(${person.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {
                background: isFounder
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.1))'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(6,182,212,0.1))',
                border: isFounder ? '2px solid rgba(245,158,11,0.3)' : '2px solid rgba(59,130,246,0.3)',
                color: isFounder ? '#f59e0b' : '#3b82f6',
              }}>
        {!person.image_url && person.name.charAt(0)}
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{
            background: isFounder ? 'rgba(245,158,11,0.1)' : 'rgba(59,130,246,0.1)',
            color: isFounder ? '#f59e0b' : '#3b82f6',
            border: isFounder ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(59,130,246,0.25)',
          }}>
          {isFounder ? '★ Founder' : '⚡ Developer'}
        </span>
      </div>

      <div className="text-center mb-4">
        <h3 className="text-white font-bold text-lg mb-1">{person.name}</h3>
        <p className="text-xs font-medium" style={{ color: isFounder ? '#f59e0b' : '#3b82f6' }}>{person.role}</p>
      </div>

      <p className="text-slate-400 text-sm text-center leading-relaxed mb-5">{person.bio}</p>

      {/* Social links — plain text since lucide social icons aren't available */}
      <div className="flex justify-center gap-3">
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener"
            className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-blue-400 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            LinkedIn <ExternalLink className="w-3 h-3 inline-block ml-1" />
          </a>
        )}
        {person.github && (
          <a href={person.github} target="_blank" rel="noopener"
            className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            GitHub <ExternalLink className="w-3 h-3 inline-block ml-1" />
          </a>
        )}
        {person.twitter && (
          <a href={person.twitter} target="_blank" rel="noopener"
            className="text-xs px-2 py-1 rounded-lg text-slate-400 hover:text-cyan-400 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            X.com <ExternalLink className="w-3 h-3 inline-block ml-1" />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function AboutPage() {
  const [team, setTeam] = useState(mockTeam)

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/v1/founders/founders`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/v1/founders/developers`).catch(() => ({ data: [] })),
    ]).then(([f, d]) => {
      if (f.data.length || d.data.length) {
        setTeam({ founders: f.data.length ? f.data : mockTeam.founders, developers: d.data.length ? d.data : mockTeam.developers })
      }
    })
  }, [])

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(0,8,40,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-wide">ARVIX LABS</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link href="/#ai-demo" className="hover:text-white transition-colors">AI Insights</Link>
            <Link href="/about" className="text-white">About</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-300 mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Users className="w-3.5 h-3.5" /> The Team Behind Arvix Labs
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Built with <span className="gradient-text">Purpose.</span>
              <br />Driven by <span className="gradient-text-gold">Vision.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Arvix Labs was founded on the belief that government data intelligence should be transparent,
              efficient, and citizen-first — powered by cutting-edge AI technology.
            </p>
          </motion.div>

          {/* Mission cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {[
              { icon: Shield, title: 'Our Mission', desc: 'Democratize access to government data and transparent intelligence through AI-powered systems.', color: '#3b82f6' },
              { icon: Star,   title: 'Our Vision',  desc: 'Every government decision backed by real data, every citizen query answered with intelligence.', color: '#f59e0b' },
              { icon: Code2,  title: 'Our Tech',    desc: 'Gemini AI + FAISS RAG pipeline + real-time analytics built for government-grade reliability.', color: '#22d3ee' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: item.color }} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Founders */}
          <section className="mb-20">
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.3em] mb-3">Leadership</p>
              <h2 className="text-3xl font-black text-white">Our Founders</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-6">
              {team.founders.map(p => <PersonCard key={p.id} person={p} isFounder={true} />)}
            </div>
          </section>

          {/* Developers */}
          <section>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.3em] mb-3">Engineering Team</p>
              <h2 className="text-3xl font-black text-white">Our Developers</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.developers.map(p => <PersonCard key={p.id} person={p} isFounder={false} />)}
            </div>
          </section>
        </div>
      </div>

      <ChatBot />
    </div>
  )
}
