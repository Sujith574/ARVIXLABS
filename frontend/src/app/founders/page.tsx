'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Users, Code2, Star, Send, CheckCircle, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import axios from 'axios'
import ChatBot from '@/components/ui/ChatBot'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const TYPE_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  founder:   { label: '★ Founder',  color: '#f59e0b', emoji: '★' },
  developer: { label: '⚡ Developer',color: '#3b82f6', emoji: '⚡' },
  advisor:   { label: '◈ Advisor',  color: '#a78bfa', emoji: '◈' },
}

function PersonCard({ person }: { person: any }) {
  const cfg = TYPE_CONFIG[person.type] || TYPE_CONFIG.developer
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      whileHover={{ y: -6 }} transition={{ duration: 0.35 }}
      className="glass-card p-6 group"
      style={{ border: `1px solid ${cfg.color}18` }}>

      {/* Avatar */}
      <div className="relative w-20 h-20 mx-auto mb-4">
        {person.image_url ? (
          <img src={person.image_url} alt={person.name}
            className="w-20 h-20 rounded-2xl object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
            style={{ background: `linear-gradient(135deg, ${cfg.color}20, ${cfg.color}08)`, border: `2px solid ${cfg.color}30`, color: cfg.color }}>
            {person.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-3">
        <span className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
          {cfg.label}
        </span>
      </div>

      <h3 className="text-white font-bold text-lg text-center mb-1">{person.name}</h3>
      <p className="text-xs font-medium text-center mb-3" style={{ color: cfg.color }}>{person.role}</p>
      <p className="text-slate-400 text-sm text-center leading-relaxed mb-5">{person.bio}</p>

      {/* Social links */}
      <div className="flex justify-center gap-3 flex-wrap">
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener"
            className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-blue-400 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(59,130,246,0.05)' }}>
            LinkedIn <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
          </a>
        )}
        {person.github && (
          <a href={person.github} target="_blank" rel="noopener"
            className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
            GitHub <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
          </a>
        )}
        {person.twitter && (
          <a href={person.twitter} target="_blank" rel="noopener"
            className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-cyan-400 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(34,211,238,0.04)' }}>
            X.com <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
          </a>
        )}
        {person.email && (
          <a href={`mailto:${person.email}`}
            className="text-xs px-3 py-1.5 rounded-lg text-slate-400 hover:text-green-400 transition-all"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(16,185,129,0.04)' }}>
            Email <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-60" />
          </a>
        )}
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

  const founders   = team.filter(p => p.type === 'founder')
  const developers = team.filter(p => p.type === 'developer')
  const advisors   = team.filter(p => p.type === 'advisor')

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSendErr('')
    try {
      await axios.post(`${API}/api/v1/contact/`, form)
      setSent(true)
    } catch {
      setSendErr('Failed to send message. Please try again or email us directly.')
    } finally { setSending(false) }
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ background: 'rgba(0,8,40,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-wide">ARVIX LABS</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/"             className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/grievance"    className="text-slate-400 hover:text-white transition-colors">Grievance</Link>
            <Link href="/technologies" className="text-slate-400 hover:text-white transition-colors">Technologies</Link>
            <Link href="/founders"     className="text-white font-medium">About</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto space-y-24">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-300 mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Users className="w-3.5 h-3.5" /> The Arvix Labs Team
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Built with <span className="gradient-text">Purpose.</span><br />
              Driven by <span className="gradient-text-gold">Vision.</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Arvix Labs was founded on the belief that AI should democratize access to government data
              and make institutions more transparent, accountable, and efficient.
            </p>
          </motion.div>

          {/* Mission */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Our Mission',  desc: 'Democratize access to government intelligence through AI-powered data systems and platforms.', color: '#3b82f6' },
              { icon: Star,   title: 'Our Vision',   desc: 'Every government decision backed by real-time data. Every citizen query resolved with intelligence.', color: '#f59e0b' },
              { icon: Code2,  title: 'Our Stack',    desc: 'Gemini AI + FAISS RAG pipeline + real-time analytics — built for government-grade reliability and scale.', color: '#22d3ee' },
            ].map((c, i) => {
              const Icon = c.icon
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                    <Icon className="w-6 h-6" style={{ color: c.color }} />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Founders Section */}
          {(loading || founders.length > 0) && (
            <section>
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-yellow-400 uppercase tracking-[0.3em] mb-3">Leadership</p>
                <h2 className="text-3xl font-black text-white">Our Founders</h2>
              </div>
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1,2].map(i => <div key={i} className="glass-card p-6 h-72 shimmer rounded-2xl" />)}
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-6">
                  {founders.map(p => <div key={p.id} className="w-full md:w-80"><PersonCard person={p} /></div>)}
                </div>
              )}
            </section>
          )}

          {/* Developers */}
          {!loading && developers.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-3">Engineering</p>
                <h2 className="text-3xl font-black text-white">Our Developers</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers.map(p => <PersonCard key={p.id} person={p} />)}
              </div>
            </section>
          )}

          {/* Advisors */}
          {!loading && advisors.length > 0 && (
            <section>
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-purple-400 uppercase tracking-[0.3em] mb-3">Advisory Board</p>
                <h2 className="text-3xl font-black text-white">Our Advisors</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {advisors.map(p => <PersonCard key={p.id} person={p} />)}
              </div>
            </section>
          )}

          {/* Empty state */}
          {!loading && team.length === 0 && (
            <div className="glass-card p-16 text-center">
              <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">Team profiles coming soon.</p>
            </div>
          )}

          {/* Contact Form */}
          <section id="contact">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-3">Get in Touch</p>
                <h2 className="text-3xl font-black text-white">Contact Us</h2>
                <p className="text-slate-400 mt-3">Have a question, partnership idea, or want to collaborate?</p>
              </div>

              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-12 text-center" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.4)' }}>
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Message Received!</h3>
                  <p className="text-slate-400">We'll get back to you as soon as possible.</p>
                  <button onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }) }}
                    className="mt-6 btn-outline-glow px-6 py-2.5">Send Another</button>
                </motion.div>
              ) : (
                <div className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                  <form onSubmit={handleContact} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Name *</label>
                        <input required className="input-glass" placeholder="Your name"
                          value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Email *</label>
                        <input required type="email" className="input-glass" placeholder="your@email.com"
                          value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Subject</label>
                      <input className="input-glass" placeholder="Partnership / General / Career"
                        value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Message *</label>
                      <textarea required rows={5} className="input-glass resize-none"
                        placeholder="Tell us how we can help or collaborate…"
                        value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                    </div>
                    {sendErr && (
                      <p className="text-red-400 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />{sendErr}
                      </p>
                    )}
                    <button type="submit" disabled={sending || !form.name || !form.email || !form.message}
                      className="w-full btn-glow text-white justify-center py-3.5 disabled:opacity-50">
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</> : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

        </div>
      </div>

      <ChatBot />
    </div>
  )
}
