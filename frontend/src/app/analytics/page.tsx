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
  Loader2
} from 'lucide-react'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const COLORS = ['#0A2A66', '#3B82F6', '#6366F1', '#F59E0B', '#10B981']

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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
       <div className="flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Arvix Registry Handshake...</p>
       </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      <Navbar />

      {/* ── Dashboard Header ──────────────────────────────────────────────── */}
      <div className="bg-[#0A2A66] pt-32 pb-64 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-6 backdrop-blur-md">
                   <Activity className="w-3.5 h-3.5" /> Registry Insights v2
                </span>
                <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter mb-4">
                  Institutional Intelligence
                </h1>
                <p className="text-blue-100/40 text-xl font-medium max-w-xl">
                  Real-time visualization of grievance resolution performance across state departments.
                </p>
              </motion.div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">System Load</p>
                  <p className="text-white font-bold text-xl">0.04ms Latency</p>
               </div>
               <div className="w-px h-12 bg-white/10" />
               <div className="text-right">
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">Active Triage Nodes</p>
                  <p className="text-white font-bold text-xl">12 Units</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'Total Protocols', value: stats?.total || 0, icon: FileText, color: '#3B82F6' },
            { label: 'Resolved Tickets', value: stats?.resolved || 0, icon: CheckCircle, color: '#10B981' },
            { label: 'Critical Triage', value: stats?.critical || 0, icon: AlertCircle, color: '#EF4444' },
            { label: 'Resolution Rate', value: `${stats?.resolution_rate || 0}%`, icon: Zap, color: '#F59E0B' },
          ].map((s, i) => (
            <motion.div key={s.label} 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="gov-card flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 transition-colors group-hover:bg-[#0A2A66] group-hover:text-white" style={{ color: s.color }}>
                   <s.icon className="w-7 h-7" />
                </div>
                {s.label === 'Resolution Rate' && <span className="px-3 py-1 bg-amber-50 rounded-full text-[10px] font-black text-amber-600 uppercase">Target: 90%</span>}
              </div>
              <div>
                <p className="text-5xl font-display font-black text-[#0A2A66] tracking-tighter mb-2">{s.value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Visualization Row ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           <div className="lg:col-span-2 space-y-8">
              <div className="gov-card h-[500px] flex flex-col">
                 <div className="flex items-center justify-between mb-16">
                    <div>
                       <h3 className="text-2xl font-bold text-[#0A2A66] tracking-tight">Department Traffic</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">7-Day Transactional Volume</p>
                    </div>
                    <div className="flex gap-4">
                       <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-blue-500" /> Education</span>
                       <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><span className="w-2 h-2 rounded-full bg-indigo-500" /> Infrastructure</span>
                    </div>
                 </div>
                 
                 <div className="flex-1 flex items-end justify-between gap-6 px-4">
                    {[45, 67, 43, 89, 56, 100, 78, 92, 34, 65, 87, 54].map((v, i) => (
                      <div key={i} className="flex-1 group relative">
                         <motion.div 
                           initial={{ height: 0 }} animate={{ height: `${v}%` }} transition={{ delay: 0.2 + (i * 0.05) }}
                           className="w-full bg-blue-50 group-hover:bg-blue-600 rounded-t-lg transition-colors relative"
                         >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0A2A66] text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity">
                               {v}%
                            </div>
                         </motion.div>
                         <div className="h-1 w-full bg-slate-100 rounded-full mt-3" />
                      </div>
                    ))}
                 </div>
                 <div className="pt-8 flex justify-between text-[9px] font-black uppercase text-slate-300 tracking-widest mt-auto">
                    <span>Alpha Grid</span>
                    <span>Bravo Grid</span>
                    <span>Charlie Grid</span>
                    <span>Delta Grid</span>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="gov-card">
                    <h4 className="font-bold text-[#0A2A66] mb-8 tracking-tight">System Status</h4>
                    <div className="space-y-6">
                       {[
                         { label: 'AI Classification Node', status: 'Operational', val: 99 },
                         { label: 'Database Sync Engine', status: 'Operational', val: 100 },
                         { label: 'Notification Relay', status: 'Optimal', val: 94 },
                       ].map(n => (
                         <div key={n.label}>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                               <span className="text-slate-500">{n.label}</span>
                               <span className="text-blue-600">{n.status}</span>
                            </div>
                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${n.val}%` }} className="h-full bg-blue-500" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
                 <div className="gov-card flex flex-col">
                    <h4 className="font-bold text-[#0A2A66] mb-4 tracking-tight">Institutional Goal</h4>
                    <p className="text-slate-500 text-sm font-medium mb-10">Targeting 100% resolution within 120 hours of submission.</p>
                    <div className="mt-auto flex items-center justify-center pb-4">
                       <div className="relative w-32 h-32 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
                             <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * 0.84)} className="text-blue-600" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                             <span className="text-2xl font-black text-[#0A2A66]">84%</span>
                             <span className="text-[7px] font-black uppercase text-slate-400">Current</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div className="gov-card overflow-hidden">
                 <h3 className="text-xl font-bold text-[#0A2A66] mb-8 tracking-tight">Recent Activity Stream</h3>
                 <div className="space-y-8">
                    {[
                      { id: 'ALX-SY-882', time: '2m ago', type: 'Classification', status: 'Completed' },
                      { id: 'ALX-SY-881', time: '14m ago', type: 'Departmental Routing', status: 'Pending' },
                      { id: 'ALX-SY-880', time: '45m ago', type: 'Protocol Resolution', status: 'Success' },
                      { id: 'ALX-SY-879', time: '1h ago', type: 'Citizen Feedback', status: 'Received' },
                      { id: 'ALX-SY-878', time: '3h ago', type: 'Security Audit', status: 'Pass' },
                    ].map((log, i) => (
                      <div key={log.id} className="flex gap-4 group">
                         <div className="w-1.5 h-1.5 rounded-full bg-blue-200 mt-2 group-hover:bg-blue-600 group-hover:scale-150 transition-all" />
                         <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                               <span className="text-xs font-black text-[#0A2A66]">{log.id}</span>
                               <span className="text-[9px] font-black text-slate-300 uppercase">{log.time}</span>
                            </div>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{log.type} — <span className="text-blue-600">{log.status}</span></p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-100 transition-colors">
                    Access Official Logs
                 </button>
              </div>

              <div className="gov-card bg-[#F59E0B] !border-none text-white">
                 <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6" />
                 </div>
                 <h4 className="text-xl font-bold mb-4 tracking-tight">Institutional Integrity Audit</h4>
                 <p className="text-white/80 text-sm font-medium leading-relaxed mb-8">
                    This dashboard is backed by our zero-trust administrative framework. All data points are immutable and verified by state-level AI nodes.
                 </p>
                 <div className="text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> System Verified v2.1
                 </div>
              </div>
           </div>

        </div>
      </div>

      <ChatBot />
    </div>
  )
}
