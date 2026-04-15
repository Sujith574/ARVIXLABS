'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Shield, Brain, BarChart3, Globe, Zap, Database, Users, ArrowRight,
  ChevronRight, MessageSquare, Send, Loader2,
  CheckCircle, Star, Menu, X, ExternalLink
} from 'lucide-react'
import dynamic from 'next/dynamic'
import axios from 'axios'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Icon map for CMS-driven icon names
const ICONS: Record<string, any> = {
  Brain, BarChart3, Globe, Zap, Database, Users, Shield, Star, CheckCircle
}

// Fallback defaults (shown before CMS data loads)
const DEFAULT_SETTINGS = {
  hero_title: 'AI-Powered Intelligence for Smarter Governance',
  hero_subtitle: 'Transforming government data into real-time insights and decisions',
  hero_cta_label: 'Try AI Assistant',
  hero_badge: 'AI-Powered Government Intelligence Platform',
  footer_tagline: '© 2024 Arvix Labs. All rights reserved.',
  contact_email: 'hello@arvixlabs.ai',
  navbar_links: [
    { label: 'Home',         href: '/' },
    { label: 'Grievance',    href: '/grievance' },
    { label: 'Technologies', href: '/technologies' },
    { label: 'AI Insights',  href: '/#ai-demo' },
    { label: 'Team',         href: '/founders' },
  ],
}
const DEFAULT_STATS = [
  { id:'1', label:'Data Points Analysed', value:'2.4M+', icon:'Database' },
  { id:'2', label:'AI Query Accuracy',    value:'98.7%', icon:'Brain' },
  { id:'3', label:'Govt. Departments',    value:'24+',   icon:'Globe' },
  { id:'4', label:'Avg. Insight Latency', value:'<1s',   icon:'Zap' },
]
const DEFAULT_FEATURES = [
  { id:'f1', title:'AI Intelligence Engine',      description:'Gemini + RAG pipeline for semantic search, pattern detection, and automated government insights.', icon:'Brain',   color:'#3b82f6' },
  { id:'f2', title:'Data Analytics Dashboard',    description:'Interactive dashboards with real-time trends, departmental metrics and predictive analytics.',    icon:'BarChart3',color:'#22d3ee' },
  { id:'f3', title:'Real‑Time Insights',          description:'Live intelligence feeds with automated alerts, pattern recognition and decision support outputs.', icon:'Zap',     color:'#a78bfa' },
  { id:'f4', title:'Scalable SaaS Architecture',  description:'Cloud-native platform containerised on Google Cloud Run with zero-downtime deployments.',        icon:'Globe',   color:'#10b981' },
]
const DEFAULT_SOLUTIONS = [
  { id:'s1', title:'Public Grievance Intelligence', description:'AI-powered citizen complaint analysis, automatic routing and resolution tracking.',          icon:'Users',    color:'#3b82f6', tags:['AI','Governance'] },
  { id:'s2', title:'Data Analysis Platform',        description:'Ingest, vectorise, and query any government dataset with FAISS semantic search.',           icon:'Database', color:'#10b981', tags:['FAISS','RAG'] },
  { id:'s3', title:'Decision Support System',       description:'Evidence-based intelligence reports to support elected officials and administrators.',       icon:'Shield',   color:'#f59e0b', tags:['Reports','Policy'] },
]

function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3b82f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)', animation: 'pulse 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)', animation: 'pulse 8s ease-in-out infinite 2s' }} />
      {/* Floating data particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400 opacity-40"
          style={{ left: `${(i * 8.3) % 100}%`, top: `${(i * 7.7 + 10) % 90}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const [settings, setSettings]   = useState<any>(DEFAULT_SETTINGS)
  const [stats, setStats]         = useState<any[]>(DEFAULT_STATS)
  const [features, setFeatures]   = useState<any[]>(DEFAULT_FEATURES)
  const [solutions, setSolutions] = useState<any[]>(DEFAULT_SOLUTIONS)
  const [founders, setFounders]   = useState<any[]>([])
  const [mobileMenu, setMobileMenu] = useState(false)

  // AI Demo state
  const [query, setQuery]     = useState('')
  const [aiResp, setAiResp]   = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, st, f, sol, found] = await Promise.allSettled([
          axios.get(`${API}/api/v1/cms/settings`),
          axios.get(`${API}/api/v1/cms/stats`),
          axios.get(`${API}/api/v1/cms/features`),
          axios.get(`${API}/api/v1/cms/solutions`),
          axios.get(`${API}/api/v1/founders/founders`),
        ])
        if (s.status === 'fulfilled')     setSettings(s.value.data)
        if (st.status === 'fulfilled')    setStats(st.value.data)
        if (f.status === 'fulfilled')     setFeatures(f.value.data)
        if (sol.status === 'fulfilled')   setSolutions(sol.value.data)
        if (found.status === 'fulfilled') setFounders(found.value.data)
      } catch { /* use defaults */ }
    }
    load()
  }, [])

  const handleAIQuery = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setAiLoading(true)
    setAiResp('')
    try {
      const res = await axios.post(`${API}/api/v1/ai/chat`, { message: query })
      setAiResp(res.data.response || res.data.reply || 'No response from AI.')
    } catch {
      setAiResp('I can help you with government data intelligence, policy insights, and real-time analytics. While I\'m connecting to the knowledge base, please try a more specific question about governance, data trends, or policy decisions.')
    } finally {
      setAiLoading(false)
    }
  }

  const navLinks = settings.navbar_links || DEFAULT_SETTINGS.navbar_links

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(0,8,40,0.88)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-wide text-lg">ARVIX LABS</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l: any) => (
              <a key={l.label} href={l.href}
                className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a href="#ai-demo" className="btn-glow text-white text-sm px-5 py-2.5">
              Explore AI <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden px-6 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {navLinks.map((l: any) => (
              <a key={l.label} href={l.href} onClick={() => setMobileMenu(false)}
                className="block text-sm text-slate-400 hover:text-white py-2">
                {l.label}
              </a>
            ))}
            <a href="#ai-demo" onClick={() => setMobileMenu(false)} className="btn-glow text-white text-sm px-5 py-2.5 w-full justify-center">
              Explore AI
            </a>
          </motion.div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <AnimatedGrid />

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-300 mb-8"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            {settings.hero_badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            {settings.hero_title.split('Governance').map((part: string, i: number) =>
              i === 0
                ? <span key={i}>{part}<span className="gradient-text">Governance</span></span>
                : <span key={i}>{part}</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {settings.hero_subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#ai-demo" className="btn-glow text-white font-semibold px-8 py-4 text-base">
              {settings.hero_cta_label} <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#solutions" className="btn-outline-glow font-semibold px-8 py-4 text-base text-blue-400">
              Explore Solutions
            </a>
          </motion.div>

          {/* Scroll cue */}
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
            className="mt-16 text-slate-600 flex justify-center">
            <ChevronRight className="w-5 h-5 rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s: any, i: number) => {
            const Icon = ICONS[s.icon] || Zap
            return (
              <motion.div key={s.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-6 text-center">
                <Icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <p className="text-3xl font-black gradient-text mb-1">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Features Section ───────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.3em] mb-4">Platform Capabilities</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="gradient-text">Govern Smarter</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              A complete end-to-end platform built for scale, security, and actionable intelligence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f: any, i: number) => {
              const Icon = ICONS[f.icon] || Zap
              return (
                <motion.div key={f.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card-hover p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${f.color}18`, border: `1px solid ${f.color}33` }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="text-white font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── AI Demo Section ────────────────────────────────────────────────── */}
      <section id="ai-demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-[0.3em] mb-4">AI Intelligence Engine</p>
            <h2 className="text-4xl font-black text-white mb-4">
              Ask the <span className="gradient-text">Government AI</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Powered by Gemini + FAISS RAG pipeline. Ask questions about governance, policy, or data trends.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
            {/* Chat history */}
            {aiResp && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="max-w-xs md:max-w-md px-4 py-3 rounded-2xl text-sm text-white"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                    {query}
                  </div>
                </div>
                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                    <Brain className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1 px-4 py-3 rounded-2xl text-sm text-slate-300 leading-relaxed"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {aiResp}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input form */}
            <form onSubmit={handleAIQuery} className="flex gap-3">
              <input
                id="ai-query-input"
                className="input-glass flex-1"
                placeholder="e.g. What are the main infrastructure challenges in urban governance?"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button type="submit" disabled={aiLoading || !query}
                id="ai-query-submit"
                className="btn-glow text-white px-5 py-3 disabled:opacity-50 flex-shrink-0">
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>

            <div className="flex flex-wrap gap-2 mt-4">
              {[
                'Key governance challenges in India?',
                'Analyse water infrastructure trends',
                'Top policy recommendations for smart cities',
              ].map(q => (
                <button key={q} onClick={() => setQuery(q)}
                  className="text-xs px-3 py-1.5 rounded-full text-slate-400 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Analytics Preview ──────────────────────────────────────────────── */}
      <section id="analytics" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold text-purple-400 uppercase tracking-[0.3em] mb-4">Analytics</p>
            <h2 className="text-4xl font-black text-white mb-4">
              Real-Time <span className="gradient-text">Data Insights</span>
            </h2>
          </motion.div>

          {/* Mock analytics cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { title: 'Monthly Data Queries', value: '48,291', change: '+23%', color: '#3b82f6' },
              { title: 'Knowledge Base Entries', value: '12,847', change: '+8%',  color: '#22d3ee' },
              { title: 'Dept. Reports Generated', value: '3,204',  change: '+41%', color: '#a78bfa' },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6">
                <p className="text-sm text-slate-500 mb-2">{card.title}</p>
                <p className="text-3xl font-black text-white mb-1">{card.value}</p>
                <span className="text-xs font-medium text-green-400">{card.change} this month</span>
                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${60 + i * 15}%` }}
                    viewport={{ once: true }} transition={{ delay: 0.4, duration: 1.2 }}
                    className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual bars */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="glass-card p-8">
            <p className="text-sm font-semibold text-white mb-6">Query Volume — Last 7 Days</p>
            <div className="flex items-end gap-3 h-32">
              {[62, 85, 49, 78, 95, 71, 88].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div initial={{ height: 0 }} whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.8 }}
                    className="w-full rounded-t-lg" style={{ background: `linear-gradient(180deg, #3b82f6, rgba(59,130,246,0.3))` }} />
                  <p className="text-xs text-slate-600">
                    {['M','T','W','T','F','S','S'][i]}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Solutions Section ──────────────────────────────────────────────── */}
      <section id="solutions" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-center mb-16">
            <p className="text-xs font-semibold text-green-400 uppercase tracking-[0.3em] mb-4">Solutions</p>
            <h2 className="text-4xl font-black text-white mb-4">
              Government <span className="gradient-text">Problem Solvers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((s: any, i: number) => {
              const Icon = ICONS[s.icon] || Shield
              return (
                <motion.div key={s.id || i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                    style={{ background: `radial-gradient(circle, ${s.color}, transparent)`, transform: 'translate(30%, -30%)' }} />
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}33` }}>
                    <Icon className="w-7 h-7" style={{ color: s.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{s.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(s.tags || []).map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded-full text-slate-400"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── About / Founders Preview ───────────────────────────────────────── */}
      {founders.length > 0 && (
        <section id="about" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} className="text-center mb-16">
              <p className="text-xs font-semibold text-yellow-400 uppercase tracking-[0.3em] mb-4">The Team</p>
              <h2 className="text-4xl font-black text-white mb-4">
                Built with <span className="gradient-text-gold">Purpose</span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Arvix Labs is led by technologists who believe AI can make government genuinely work for citizens.
              </p>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-6">
              {founders.slice(0, 3).map((f: any, i: number) => (
                <motion.div key={f.id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="glass-card p-6 w-72 text-center"
                  style={{ border: '1px solid rgba(245,158,11,0.15)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '2px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}>
                    {f.name.charAt(0)}
                  </div>
                  <h3 className="text-white font-bold text-lg mb-1">{f.name}</h3>
                  <p className="text-yellow-400 text-xs font-medium mb-3">{f.role}</p>
                  <p className="text-slate-400 text-sm">{f.bio}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/about" className="btn-outline-glow px-8 py-3">
                Meet the Full Team
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Contact / CTA ──────────────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} className="glass-card p-12 text-center"
            style={{ border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 0 80px rgba(59,130,246,0.08)' }}>
            <p className="text-xs font-semibold text-blue-400 uppercase tracking-[0.3em] mb-4">Get in Touch</p>
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to <span className="gradient-text">Get Started?</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Explore how Arvix Labs can transform governance at your institution.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href={`mailto:${settings.contact_email}`} className="btn-glow text-white px-8 py-4">
                Contact Us <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#ai-demo" className="btn-outline-glow px-8 py-4">
                Try the AI <Brain className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-black tracking-wide">ARVIX LABS</span>
              </div>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                AI-powered government intelligence platform for smarter governance and data-driven decisions.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Platform</p>
              <div className="space-y-2">
                {['Solutions', 'AI Insights', 'Analytics', 'About'].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                    className="block text-sm text-slate-500 hover:text-white transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-4">Company</p>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-slate-500 hover:text-white transition-colors">About</Link>
                <a href={`mailto:${settings.contact_email}`} className="block text-sm text-slate-500 hover:text-white transition-colors">Contact</a>
              </div>
              <div className="flex gap-3 mt-6">
                <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">X / Twitter</a>
                <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
          </div>
          <div className="divider mb-6" />
          <p className="text-xs text-slate-600 text-center">{settings.footer_tagline}</p>
        </div>
      </footer>

      <ChatBot />
    </div>
  )
}
