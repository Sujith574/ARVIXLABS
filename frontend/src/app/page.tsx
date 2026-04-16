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
  Users, 
  CheckCircle, 
  Globe, 
  Zap, 
  Menu, 
  X,
  MessageSquare,
  Activity
} from 'lucide-react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <Navbar />

      {/* ── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-36 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-blue-900/5 text-blue-600 text-xs font-black uppercase tracking-widest mb-10">
                <Zap className="w-4 h-4 fill-current animate-pulse" /> Frontier Governance v2.1
              </span>
              <h1 className="text-6xl lg:text-[100px] font-display font-black text-[#0A2A66] leading-[0.95] tracking-tighter mb-10">
                AI Intelligence for <br/>
                <span className="gradient-text pb-2">Modern States</span>
              </h1>
              <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-3xl mb-14 tracking-tight">
                A unified platform for high-integrity grievance management, AI citizens' intelligence, and administrative innovation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <Link href="/grievance" className="gov-gradient-button text-xl px-12 py-6 group">
                  Submit Grievance <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link href="/technologies" className="gov-button-outline text-xl px-12 py-6">
                  Explore Infrastructure
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Quick Action Panel ─────────────────────────────────────────────── */}
      <section className="px-6 relative z-20 -mt-12 mb-32 perspective-1000">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileText, title: 'Submit Protocol', desc: 'Securely log official grievances with automated AI triage.', href: '/grievance', color: '#0A2A66' },
              { icon: Search, title: 'Track Status', desc: 'Real-time auditable tracking for all active system tickets.', href: '/track', color: '#3B82F6' },
              { icon: MessageSquare, title: 'AI Assistant', desc: '24/7 technical intelligence and policy guidance.', href: '/ai', color: '#6366F1' },
              { icon: Activity, title: 'State Analytics', desc: 'Live resolution metrics and department performance.', href: '/analytics', color: '#F59E0B' },
            ].map((card, i) => (
              <motion.div key={card.title} 
                initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }} 
                whileHover={{ 
                  rotateX: 10, 
                  rotateY: 10, 
                  scale: 1.05,
                  translateZ: 20
                }}
                transition={{ 
                  delay: 0.15 * i, 
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 300
                }}
                className="gov-card p-10 group cursor-pointer hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 preserve-3d"
                onClick={() => window.location.href = card.href}>
                <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center mb-8 bg-slate-50 transition-all duration-500 group-hover:bg-[#0A2A66] group-hover:text-white" style={{ color: card.color }}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">{card.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{card.desc}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-[#0A2A66] transition-colors">
                  Access Section <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Corporate Trust ────────────────────────────────────────────────── */}
      <section className="py-40 px-6 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            <div className="space-y-16">
               <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <h2 className="text-5xl lg:text-7xl font-display font-black text-[#0A2A66] mb-8 leading-none tracking-tighter">Precision Built for <br/><span className="gradient-text">Public Service</span></h2>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                    Arvix integrates startup-speed innovation with enterprise-grade security for the next generation of government digital infrastructure.
                  </p>
               </motion.div>

               <div className="space-y-12">
                  {[
                    { icon: Cpu, title: 'AI-Powered Triage', desc: 'Gemini 2.0 pipelines automatically classify, prioritize, and route complaints within seconds.' },
                    { icon: BarChart3, title: 'Network Transparency', desc: 'Real-time dashboards provide immutable visibility into state-wide resolution performance.' },
                    { icon: Shield, title: 'Hardened Security', desc: 'Zero-trust architecture ensuring citizen data integrity and auditable administrative trails.' }
                  ].map((feat, i) => (
                    <motion.div key={feat.title} 
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 * i }}
                      className="flex gap-8 group">
                       <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#0A2A66] group-hover:bg-blue-50 transition-colors border border-slate-100">
                          <feat.icon className="w-8 h-8" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold mb-2 tracking-tight">{feat.title}</h3>
                          <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">{feat.desc}</p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="relative">
               <div className="absolute -inset-10 bg-blue-100/50 rounded-full blur-[100px] animate-pulse" />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                 className="relative gov-card !p-6 bg-slate-50 border-slate-200 shadow-[0_40px_100px_-20px_rgba(10,42,102,0.15)] rounded-[3rem] overflow-hidden">
                  <div className="aspect-[4/5] bg-white rounded-[2.5rem] p-10 flex flex-col justify-between shimmer">
                     <div className="space-y-6">
                        <div className="flex justify-between items-center">
                           <div className="w-12 h-12 rounded-xl bg-blue-50" />
                           <div className="w-24 h-4 bg-slate-50 rounded-full" />
                        </div>
                        <div className="h-10 w-3/4 bg-slate-50 rounded-2xl" />
                        <div className="h-32 w-full bg-slate-50 rounded-3xl" />
                        <div className="grid grid-cols-2 gap-4">
                           <div className="h-24 bg-blue-50/30 rounded-2xl" />
                           <div className="h-24 bg-blue-50/30 rounded-2xl" />
                        </div>
                     </div>
                     <div className="pt-10 flex gap-4">
                        <div className="flex-1 h-14 bg-slate-50 rounded-2xl" />
                        <div className="w-14 h-14 bg-[#0A2A66] rounded-2xl" />
                     </div>
                  </div>
               </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Statistics / Social Proof ─────────────────────────────────────── */}
      <section className="py-32 px-6 bg-[#0A2A66]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center gap-20 text-center">
            {[
              { label: 'Platform Users', val: '2.4M+' },
              { label: 'Uptime SLA', val: '99.9%' },
              { label: 'AI Resolution', val: '84%' },
              { label: 'Regional Hubs', val: '12' },
            ].map(s => (
              <div key={s.label}>
                 <p className="text-6xl font-display font-black text-white mb-2 tracking-tighter">{s.val}</p>
                 <p className="text-blue-300/60 text-xs font-black uppercase tracking-[0.3em]">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#030E22] text-white py-32 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-4 mb-10">
                <Shield className="w-10 h-10 text-blue-400" />
                <span className="font-display font-black text-3xl tracking-tighter">ARVIX LABS</span>
              </div>
              <p className="text-white/40 font-medium text-base leading-relaxed mb-10">
                Official Intelligence Infrastructure Portal. Designing the future of citizen-state digital interactions.
              </p>
              <div className="flex gap-4">
                 {[1,2,3,4].map(i => <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all cursor-pointer" />)}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black uppercase tracking-widest text-blue-400">Platform</h4>
              <ul className="space-y-5 text-white/50 font-bold text-sm">
                <li><Link href="/grievance" className="hover:text-white transition-colors">Grievance Portal</Link></li>
                <li><Link href="/analytics" className="hover:text-white transition-colors">System Analytics</Link></li>
                <li><Link href="/ai" className="hover:text-white transition-colors">AI Engine ALX-2</Link></li>
                <li><Link href="/technologies" className="hover:text-white transition-colors">Framework Specs</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black uppercase tracking-widest text-blue-400">Organization</h4>
              <ul className="space-y-5 text-white/50 font-bold text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Council</Link></li>
                <li><Link href="/founders" className="hover:text-white transition-colors">System Architects</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Institutional Support</Link></li>
                <li><Link href="/legal" className="hover:text-white transition-colors">Regulatory Compliance</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-lg font-black uppercase tracking-widest text-blue-400">Contact HQ</h4>
              <div className="text-white/40 text-sm font-bold space-y-5">
                <p className="leading-relaxed">Arvix Intelligence Square<br/>Digital District, Tech Corridor</p>
                <p>dispatch@arvixlabs.gov.in</p>
                <p className="text-white text-base">Administrative: +91 1800 2410 94</p>
              </div>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
            <p>© 2024 Arvix Labs. Audited Official Portal. Ref: ALX-SY-PR-24</p>
            <div className="flex gap-12">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Audit Trail</a>
               <a href="#" className="hover:text-white transition-colors">Reporting</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  )
}
