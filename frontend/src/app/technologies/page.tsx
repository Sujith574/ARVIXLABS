'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Zap, CheckCircle, Clock, FlaskConical, ArrowRight, ExternalLink } from 'lucide-react'
import axios from 'axios'
import ChatBot from '@/components/ui/ChatBot'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any }> = {
  Production: { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle },
  Beta:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Zap },
  Prototype:  { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)',icon: FlaskConical },
}

const CATEGORY_COLORS: Record<string, string> = {
  AI: '#3b82f6', Platform: '#22d3ee', Analytics: '#f59e0b',
  Security: '#ef4444', Infrastructure: '#a78bfa', Technology: '#10b981',
}

export default function TechnologiesPage() {
  const [techs, setTechs]       = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    axios.get(`${API}/api/v1/technologies/`)
      .then(r => {
        setTechs(r.data)
        const cats = Array.from(new Set(r.data.map((t: any) => t.category))) as string[]
        setCategories(['All', ...cats])
      })
      .catch(() => {
        // Placeholder when backend is offline
        const fallback = [
          { id:'1', title:'Arvix AI', description:'Context-aware government intelligence engine powered by Gemini 1.5 and FAISS RAG pipeline for instant policy and data Q&A.', use_case:'Real-time citizen query resolution, policy document search, anomaly detection.', status:'Production', category:'AI', image_url:'' },
          { id:'2', title:'Grievance Intelligence', description:'ML-based complaint auto-classification, priority scoring, and department routing system.', use_case:'Government departments, municipalities, civic grievance cells.', status:'Production', category:'Platform', image_url:'' },
          { id:'3', title:'Data Analytics Suite', description:'Real-time dashboards, trend analysis, and visual reporting for government transparency.', use_case:'Department KPI tracking, public accountability reports, audit trails.', status:'Beta', category:'Analytics', image_url:'' },
          { id:'4', title:'FraudGuard AI', description:'AI-powered anomaly and fraud detection in government procurement and financial data.', use_case:'Anti-corruption bureaus, financial auditors, procurement departments.', status:'Prototype', category:'Security', image_url:'' },
        ]
        setTechs(fallback)
        setCategories(['All', 'AI', 'Platform', 'Analytics', 'Security'])
      })
      .finally(() => setLoading(false))
  }, [])

  const visible = filter === 'All' ? techs : techs.filter(t => t.category === filter)

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
            <Link href="/"            className="text-slate-400 hover:text-white transition-colors">Home</Link>
            <Link href="/grievance"   className="text-slate-400 hover:text-white transition-colors">Grievance</Link>
            <Link href="/technologies"className="text-white font-medium">Technologies</Link>
            <Link href="/founders"    className="text-slate-400 hover:text-white transition-colors">About</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-blue-300 mb-6"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <Zap className="w-3.5 h-3.5" /> Built at Arvix Labs
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              Technology <span className="gradient-text">Showcase</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Innovations developed at Arvix Labs — from AI intelligence engines to civic platforms,
              built for real-world government impact.
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === cat ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                style={filter === cat
                  ? { background: cat === 'All' ? 'rgba(59,130,246,0.25)' : `${CATEGORY_COLORS[cat] || '#3b82f6'}25`,
                      border: `1px solid ${cat === 'All' ? 'rgba(59,130,246,0.4)' : `${CATEGORY_COLORS[cat] || '#3b82f6'}50`}`,
                      color: cat === 'All' ? '#93c5fd' : CATEGORY_COLORS[cat] || '#93c5fd' }
                  : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="glass-card p-6 h-60 shimmer rounded-2xl" />)}
            </div>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((tech, i) => {
                const st = STATUS_CONFIG[tech.status] || STATUS_CONFIG.Prototype
                const StatusIcon = st.icon
                const catColor = CATEGORY_COLORS[tech.category] || '#3b82f6'
                return (
                  <motion.div key={tech.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="glass-card p-6 group"
                    style={{ border: `1px solid ${catColor}15` }}>

                    {/* Image / placeholder */}
                    {tech.image_url ? (
                      <img src={tech.image_url} alt={tech.title}
                        className="w-full h-36 object-cover rounded-xl mb-5" />
                    ) : (
                      <div className="w-full h-36 rounded-xl mb-5 flex items-center justify-center text-4xl font-black"
                        style={{ background: `linear-gradient(135deg, ${catColor}15, ${catColor}05)`, color: catColor, border: `1px solid ${catColor}20` }}>
                        {tech.title.charAt(0)}
                      </div>
                    )}

                    {/* Header row */}
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ background: `${catColor}15`, color: catColor, border: `1px solid ${catColor}25` }}>
                        {tech.category}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                        <StatusIcon className="w-3 h-3" /> {tech.status}
                      </span>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-2">{tech.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{tech.description}</p>

                    {tech.use_case && (
                      <div className="p-3 rounded-xl mb-4"
                        style={{ background: `${catColor}06`, border: `1px solid ${catColor}15` }}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: catColor }}>Use Case</p>
                        <p className="text-slate-400 text-xs leading-relaxed">{tech.use_case}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all"
                      style={{ color: catColor }}>
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mt-20 p-12 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(34,211,238,0.05))', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h2 className="text-3xl font-black text-white mb-4">Interested in our technology?</h2>
            <p className="text-slate-400 mb-8">Partner with Arvix Labs to bring AI-powered intelligence to your government operations.</p>
            <Link href="/founders#contact" className="btn-glow text-white px-8 py-3.5 text-sm font-semibold inline-flex">
              Get in Touch <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      <ChatBot />
    </div>
  )
}
