'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  Cpu, 
  Database, 
  Zap, 
  Lock, 
  Globe, 
  ArrowRight, 
  Menu, 
  X,
  Code2,
  Layers,
  Activity,
  Server,
  CheckCircle
} from 'lucide-react'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

export default function TechnologiesPage() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const technologies = [
    {
      title: 'Gemini 2.0 Flash',
      description: 'Ultra-low latency inference engine for real-time grievance classification and citizen intelligence.',
      status: 'Active',
      color: '#3B82F6',
      icon: Zap
    },
    {
      title: 'Vector Intelligence',
      description: 'FAISS-powered semantic search allows for high-accuracy retrieval-augmented generation (RAG).',
      status: 'Stable',
      color: '#6366F1',
      icon: Database
    },
    {
      title: 'Immutable Audit Ledger',
      description: 'Every interaction and redressal is logged into an immutable decentralized record for integrity.',
      status: 'Production',
      color: '#0A2A66',
      icon: Shield
    },
    {
      title: 'Cloud Run V2',
      description: 'Containerized microservices architecture ensuring 99.9% availability and global scaling capabilities.',
      status: 'Live',
      color: '#10B981',
      icon: Server
    },
    {
      title: 'FastAPI Micro-Framework',
      description: 'High-performance asynchronous backend services optimized for heavy I/O and AI workloads.',
      status: 'Active',
      color: '#06B6D4',
      icon: Zap
    },
    {
      title: 'Reactive Frontend',
      description: 'Next.js 14 based interface with server-side rendering for optimal speed and SEO performance.',
      status: 'Latest',
      color: '#F97316',
      icon: Code2
    }
  ]

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
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-6">
                <Layers className="w-3.5 h-3.5" /> Core Infrastructure
             </span>
             <h1 className="text-5xl md:text-7xl font-display font-black text-[#0A2A66] mb-8 tracking-tight leading-[1.1]">
                Technological <span className="gradient-text">Excellence</span>
             </h1>
             <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
                Arvix Labs utilizes a state-of-the-art stack to deliver government-grade reliability and security at internet speed.
             </p>
          </motion.div>

          {/* Tech Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, i) => (
              <motion.div key={tech.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gov-card group hover:shadow-2xl transition-all duration-500 border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:bg-blue-50 transition-colors" style={{ color: tech.color }}>
                   <tech.icon className="w-7 h-7" />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold tracking-tight">{tech.title}</h3>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded bg-white border border-slate-100 text-slate-400 group-hover:text-blue-500 cursor-default transition-colors">
                     {tech.status}
                  </span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                  {tech.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 group-hover:text-primary transition-all">
                   View Documentation <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Deep Stack Visualization */}
          <div className="relative pt-16">
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl opacity-5 blur-3xl pointer-events-none" />
             <div className="gov-card p-16 bg-white shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                   <div className="space-y-8">
                      <h2 className="text-4xl font-display font-black tracking-tight">The Arvix AI Framework (v1.0)</h2>
                      <p className="text-slate-500 font-medium leading-relaxed">
                         Our framework is designed for absolute data sovereignty. We process citizen data through local vector stores before querying frontier models, ensuring privacy-by-design.
                      </p>
                      <div className="space-y-6">
                         {[
                           { title: 'Zero-Trust Architecture', desc: 'Secure by default. Every request is verified.' },
                           { title: 'Multimodal Processing', desc: 'Accepting voice, text, and visual evidence.' },
                           { title: 'Distributed Intelligence', desc: 'Edge-optimized for remote rural access.' },
                         ].map(item => (
                           <div key={item.title} className="flex gap-4">
                              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                                 <CheckCircle className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                 <p className="font-bold text-[#0A2A66]">{item.title}</p>
                                 <p className="text-slate-400 text-sm">{item.desc}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                   <div className="relative h-[300px] bg-slate-50 rounded-2xl flex items-center justify-center p-8 overflow-hidden">
                      <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                      <div className="relative z-10 w-full space-y-4">
                         <div className="h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-4 justify-between translate-x-4">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Public Layer</span>
                            <div className="flex gap-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-red-400" /><div className="w-1.5 h-1.5 rounded-full bg-yellow-400" /><div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            </div>
                         </div>
                         <div className="h-16 bg-[#0A2A66] text-white rounded-lg shadow-2xl flex items-center px-6 justify-between transform -translate-x-4 scale-105 border border-white/10">
                            <div className="flex items-center gap-3">
                               <Cpu className="w-5 h-5 text-blue-400" />
                               <span className="text-sm font-bold tracking-tight">AI Orchestration Core</span>
                            </div>
                            <div className="w-12 h-1.5 bg-blue-500/30 rounded-full overflow-hidden">
                               <div className="w-2/3 h-full bg-blue-400 animate-[shimmer_2s_infinite]" />
                            </div>
                         </div>
                         <div className="h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center px-4 justify-between translate-x-2">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Data Sovereignty Box</span>
                            <Lock className="w-3.5 h-3.5 text-slate-300" />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      <footer className="bg-white py-12 px-6 border-t mt-auto text-center font-display font-black uppercase tracking-[0.2em] text-[10px] text-slate-400">
         © 2024 Arvix Labs — Technological Integrity Dashboard
      </footer>

      <ChatBot />
    </div>
  )
}
