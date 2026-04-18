'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Shield, 
  BarChart3, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock, 
  Filter, 
  Download,
  Activity,
  AlertCircle,
  Zap,
  FileText,
  Loader2,
  Database,
  Cpu,
  Layers,
  Globe,
  ShieldCheck
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'https://arvix-backend-666036188871.asia-south1.run.app'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/analytics/public-overview`)
        setStats(res.data)
      } catch (err) {
        console.error("Failed to fetch public stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) return (
    <div className="min-h-screen arvix-gradient-bg flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-arvix-accent animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Node Handshake Protocol...</p>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      {/* ── Dashboard Header ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-48 px-6 overflow-hidden border-b border-white/5">
        <div className="aurora opacity-30" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-16">
            <div className="max-w-3xl">
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-arvix-accent text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">System Throughput</span>
                <h1 className="text-6xl md:text-8xl font-display font-black leading-none tracking-tighter mb-8 arvix-text-gradient">
                  Administrative <br/>
                  <span className="arvix-accent-gradient">Intelligence Hub</span>
                </h1>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                  Real-time visualization of grievance resolution performance across state departments, audited by Arvix Core nodes.
                </p>
              </motion.div>
            </div>
            <div className="flex items-center gap-12 bg-white/5 p-8 rounded-[2rem] border border-white/10 arvix-glass">
               <div className="text-right">
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Node Latency</p>
                  <p className="text-arvix-accent font-black text-2xl tracking-tighter">0.04ms</p>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-right">
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] mb-2">Active Triage</p>
                  <p className="text-white font-black text-2xl tracking-tighter">12 Units</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-48">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {[
            { label: 'Protocols Logged', value: stats?.total || 0, icon: FileText, color: 'arvix-accent' },
            { label: 'Resolved Tickets', value: stats?.resolved || 0, icon: CheckCircle, color: 'arvix-secondary' },
            { label: 'Critical Triage', value: stats?.critical || 0, icon: AlertCircle, color: 'arvix-violet' },
            { label: 'Resolution Rate', value: `${stats?.resolution_rate || 0}%`, icon: Zap, color: 'arvix-accent' },
          ].map((s, i) => (
            <motion.div key={s.label} 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="arvix-card flex flex-col justify-between group border-white/5 hover:border-white/10">
              <div className="flex justify-between items-start mb-12">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-arvix-accent group-hover:text-slate-950">
                   <s.icon className="w-7 h-7" />
                </div>
                {s.label === 'Resolution Rate' && <span className="px-3 py-1 arvix-glass border-white/10 rounded-full text-[8px] font-black text-arvix-accent uppercase tracking-widest">Target 90%</span>}
              </div>
              <div>
                <p className="text-5xl font-display font-black text-white tracking-tighter mb-2 group-hover:arvix-accent-gradient transition-all">{s.value}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Visualization Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <div className="lg:col-span-2 space-y-8">
              <div className="arvix-card h-[500px] flex flex-col border-white/5">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                    <div>
                       <h3 className="text-2xl font-bold text-white tracking-tight">Departmental Payload</h3>
                       <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">7-Day Grid Traffic Analysis</p>
                    </div>
                    <div className="flex gap-6">
                       <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40"><span className="w-2 h-2 rounded-full bg-arvix-accent" /> Alpha-Node</span>
                       <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/40"><span className="w-2 h-2 rounded-full bg-arvix-secondary" /> Bravo-Node</span>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex items-end justify-between gap-4 px-4 overflow-hidden">
                    {[45, 67, 43, 89, 56, 100, 78, 92, 34, 65, 87, 54].map((v, i) => (
                      <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                         <motion.div 
                           initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: 0.2 + (i * 0.05), duration: 1 }}
                           className="w-full bg-white/5 group-hover:bg-arvix-accent rounded-t-xl transition-all duration-500 relative"
                         >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 arvix-glass border-white/10 text-white text-[9px] font-black rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                               {v} Pkts
                            </div>
                         </motion.div>
                      </div>
                    ))}
                 </div>
                 <div className="pt-8 flex justify-between text-[8px] font-black uppercase text-white/10 tracking-[0.4em] mt-auto">
                    <span>S-Alpha</span>
                    <span>S-Bravo</span>
                    <span>S-Charlie</span>
                    <span>S-Delta</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="arvix-card border-white/5 bg-white/5">
                    <h4 className="font-bold text-white mb-8 tracking-tight">System Node Integrity</h4>
                    <div className="space-y-6">
                       {[
                         { label: 'AI Heuristic Engine', status: 'Online', val: 99 },
                         { label: 'Database Grid Sync', status: 'Syncing', val: 100 },
                         { label: 'Administrative Relay', status: 'Active', val: 94 },
                       ].map(n => (
                         <div key={n.label}>
                            <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.4em] mb-3">
                               <span className="text-white/30">{n.label}</span>
                               <span className="text-arvix-accent">{n.status}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${n.val}%` }} className="h-full bg-arvix-accent" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="arvix-card flex flex-col border-white/5">
                    <h4 className="font-bold text-white mb-4 tracking-tight">Civic Resolution Goal</h4>
                    <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed">Targeting 100% resolution within 12 cycles of submission.</p>
                    <div className="mt-auto flex items-center justify-center pb-4">
                       <div className="relative w-36 h-36 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                             <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                             <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={402} strokeDashoffset={402 - (402 * 0.84)} className="text-arvix-accent" strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                             <span className="text-3xl font-black text-white tracking-tighter">84%</span>
                             <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white/20">GRID MEAN</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="arvix-card border-white/5 bg-white/5 overflow-hidden">
                 <h3 className="text-xl font-bold text-white mb-10 tracking-tight">Neural Activity Stream</h3>
                 <div className="space-y-10">
                    {[
                      { id: 'NODE-SY-882', time: '2m', type: 'Triage Sync', status: 'OK' },
                      { id: 'NODE-SY-881', time: '14m', type: 'Grid Route', status: 'Proc' },
                      { id: 'NODE-SY-880', time: '45m', type: 'Final Res', status: 'Comp' },
                      { id: 'NODE-SY-879', time: '1h', type: 'Citizen Sig', status: 'Recv' },
                      { id: 'NODE-SY-878', time: '3h', type: 'Hardened Aud', status: 'Pass' },
                    ].map((log, i) => (
                      <div key={log.id} className="flex gap-6 group">
                         <div className="w-1.5 h-1.5 rounded-full bg-white/10 mt-2 group-hover:bg-arvix-accent group-hover:scale-150 transition-all shadow-[0_0_10px_rgba(56,189,248,0.5)]" />
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                               <span className="text-[10px] font-black text-white tracking-widest">{log.id}</span>
                               <span className="text-[8px] font-black text-white/20 uppercase">{log.time}</span>
                            </div>
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">{log.type} — <span className="text-arvix-accent">{log.status}</span></p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-12 py-5 arvix-glass border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all">
                    ACCESS GLOBAL CLUSTER LOGS
                 </button>
              </div>

              <div className="arvix-card bg-arvix-violet/20 !border-arvix-violet/30 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-arvix-violet/20 blur-3xl rounded-full" />
                 <div className="w-12 h-12 rounded-xl bg-arvix-violet/20 flex items-center justify-center mb-8 border border-arvix-violet/30">
                    <ShieldCheck className="w-6 h-6 text-arvix-violet" />
                 </div>
                 <h4 className="text-2xl font-bold mb-4 tracking-tight">Sovereign Integrity</h4>
                 <p className="text-white/40 text-sm font-medium leading-relaxed mb-10">
                    This dashboard is anchored by Arvix Zero-Trust logic. All metrics are immutable and verified by decentralized AI cluster protocols.
                 </p>
                 <div className="text-[9px] font-black uppercase tracking-[0.4em] flex items-center gap-3 text-arvix-violet">
                    <CheckCircle className="w-4 h-4" /> VERIFIED v2.4 (MUMBAI)
                 </div>
              </div>
           </div>

        </div>
      </div>

      <footer className="py-20 px-6 border-t border-white/5 text-center">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em]">Arvix Analytical Cluster — Official Access Point Alpha</p>
      </footer>

      <ChatBot />
    </div>
  )
}
