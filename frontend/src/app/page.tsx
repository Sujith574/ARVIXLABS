'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  ArrowRight, 
  FileText, 
  Search, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Zap, 
  MessageSquare,
  Activity,
  Layers,
  Database,
  Mail
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-48 px-6 overflow-hidden">
        <div className="aurora opacity-30" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full arvix-glass border-white/20 text-arvix-accent text-xs font-black uppercase tracking-[0.3em] animate-pulse-cyan">
                <Zap className="w-4 h-4 fill-current" /> Quantum Governance OS v2.4
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl lg:text-[120px] font-display font-black leading-[0.9] tracking-tighter mb-10 arvix-text-gradient"
            >
              Intelligence for the <br/>
              <span className="arvix-accent-gradient">Sovereign Era</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-slate-400 font-medium max-w-3xl mb-16 leading-relaxed"
            >
              A high-integrity platform for sovereign grievance management, 
              AI-driven administrative oversight, and citizen-state synergy.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link href="/grievance" className="arvix-button-primary text-base px-12 py-6 group">
                Access Portal <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link href="/technologies" className="arvix-button-outline text-base px-12 py-6">
                System Specs
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Operational Grid ─────────────────────────────────────────────── */}
      <section className="px-6 relative z-20 -mt-24 mb-48">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: 'Submission', desc: 'Securely log official grievances with real-time AI classification.', href: '/grievance', accent: 'cyan' },
              { icon: Search, title: 'Tracking', desc: 'Immutable audit trails for all active system protocols.', href: '/track', accent: 'indigo' },
              { icon: MessageSquare, title: 'ALX-2 Assistant', desc: '24/7 localized intelligence and administrative support.', href: '/ai', accent: 'violet' },
              { icon: Activity, title: 'Analytics', desc: 'Real-time throughput metrics and regional performance.', href: '/analytics', accent: 'sky' },
            ].map((card, i) => (
              <motion.div key={card.title} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="arvix-card arvix-glass-hover group cursor-pointer border-white/5"
                onClick={() => window.location.href = card.href}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white/5 transition-all duration-500 group-hover:scale-110 group-hover:bg-arvix-accent group-hover:text-slate-950`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-white">{card.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{card.desc}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 group-hover:text-arvix-accent transition-colors">
                  Enter Module <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Intelligence Layer ────────────────────────────────────────────── */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            
            <div className="space-y-12">
               <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <span className="text-arvix-accent text-xs font-black uppercase tracking-[0.4em] mb-4 block">Platform Core</span>
                  <h2 className="text-6xl lg:text-7xl font-display font-black leading-none tracking-tighter mb-8">
                    Autonomic <br/>
                    <span className="arvix-accent-gradient">Infrastructure</span>
                  </h2>
                  <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-xl">
                    Arvix Core utilizes decentralized logic and Arvix AI-powered heuristics to manage civil grievances with zero-latency response.
                  </p>
               </motion.div>

               <div className="space-y-8">
                  {[
                    { icon: Cpu, title: 'Heuristic Routing', desc: 'Complaints are interpreted, validated, and assigned to optimal state nodes automatically.' },
                    { icon: Layers, title: 'Multi-Layer Verification', desc: 'Secure, cross-referenced identity management via Arvix Trust Protocol.' },
                    { icon: Database, title: 'Persistent Persistence', desc: 'Redundant SQL cores ensuring grievance data integrity across all global nodes.' }
                  ].map((feat, i) => (
                    <motion.div key={feat.title} 
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
                      className="flex gap-6 group">
                       <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-arvix-accent group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all duration-500">
                          <feat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h3 className="text-lg font-bold mb-1 tracking-tight text-white">{feat.title}</h3>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">{feat.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, rotate: -2 }} 
                 whileInView={{ opacity: 1, scale: 1, rotate: 0 }} 
                 viewport={{ once: true }}
                 className="relative arvix-card border-white/10 shadow-[0_40px_100px_rgba(56,189,248,0.15)] overflow-hidden p-0"
               >
                  <div className="aspect-square bg-slate-900/50 flex flex-col items-center justify-center relative">
                     <div className="absolute inset-0 grid-overlay opacity-30" />
                     <div className="w-64 h-64 rounded-full bg-arvix-accent/10 flex items-center justify-center border border-arvix-accent/20 animate-orbit">
                        <div className="w-32 h-32 rounded-full bg-arvix-accent/20 blur-2xl animate-pulse" />
                     </div>
                     <ShieldCheck className="w-24 h-24 text-arvix-accent relative z-10" />
                     <div className="mt-12 text-center z-10">
                        <p className="text-xs font-black tracking-[0.4em] uppercase text-white/40 mb-2">Integrity Status</p>
                        <p className="text-3xl font-black text-white">SYSTEM ACTIVE</p>
                     </div>
                  </div>
               </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── System Metrics ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative border-y border-white/5 overflow-hidden">
         <div className="aurora opacity-10 reverse" />
         <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-16 md:gap-32">
            {[
              { label: 'Sovereign Users', val: '2.4M' },
              { label: 'Latency (Avg)', val: '14.2ms' },
              { label: 'AI Accuracy', val: '98.2%' },
              { label: 'Global Nodes', val: '128' },
            ].map(s => (
              <div key={s.label} className="text-center group">
                 <p className="text-6xl md:text-7xl font-display font-black text-white mb-2 tracking-tighter group-hover:arvix-accent-gradient transition-all">{s.val}</p>
                 <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.4em]">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-arvix-bg text-white py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32 border-b border-white/5 pb-32">
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <Shield className="w-10 h-10 text-arvix-accent" />
                <span className="font-display font-black text-3xl tracking-tighter">ARVIX LABS</span>
              </div>
              <p className="text-white/40 font-medium text-base leading-relaxed">
                Official Arvix Core Infrastructure Portal. Designing the future of sovereign digital interactions.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Intelligence Hub</h4>
              <ul className="space-y-5 text-slate-400 font-bold text-sm">
                <li><Link href="/grievance" className="hover:text-arvix-accent transition-colors">Portal Access</Link></li>
                <li><Link href="/track" className="hover:text-arvix-accent transition-colors">Audit Node</Link></li>
                <li><Link href="/ai" className="hover:text-arvix-accent transition-colors">Core Assistant</Link></li>
                <li><Link href="/technologies" className="hover:text-arvix-accent transition-colors">Core Specs</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Council</h4>
              <ul className="space-y-5 text-slate-400 font-bold text-sm">
                <li><Link href="/about" className="hover:text-arvix-accent transition-colors">Organization</Link></li>
                <li><Link href="/founders" className="hover:text-arvix-accent transition-colors">Architects</Link></li>
                <li><Link href="/contact" className="hover:text-arvix-accent transition-colors">Support</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Connect</h4>
              <div className="text-slate-400 text-sm font-bold space-y-5">
                <p>Arvix HQ, Central District<br/>Cyber Corridor Alpha</p>
                <a href="mailto:arvixlabs@gmail.com" className="flex items-center gap-3 hover:text-arvix-accent transition-colors group">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-arvix-accent group-hover:bg-arvix-accent group-hover:text-slate-950 transition-all">
                     <Mail className="w-4 h-4" />
                   </div>
                   arvixlabs@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
            <p>© 2026 Arvix Labs. All systems verified and encrypted. Node Mumbai-1</p>
            <div className="flex gap-12">
               <a href="#" className="hover:text-white transition-colors">Privacy Protcol</a>
               <a href="#" className="hover:text-white transition-colors">Audit Trail</a>
               <a href="#" className="hover:text-white transition-colors">System Ops</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  )
}
