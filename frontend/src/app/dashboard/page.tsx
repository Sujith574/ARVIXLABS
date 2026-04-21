'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, CheckCircle, Clock, AlertTriangle, Brain, TrendingUp, BarChart3, Users } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import Topbar from '@/components/layout/Topbar'
import dynamic from 'next/dynamic'
import axios from 'axios'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, CartesianGrid
} from 'recharts'

const NetworkVisualization = dynamic(() => import('@/components/three/NetworkVisualization'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const COLORS = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#f97316']

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_complaints: 0, resolved: 0, pending: 0, resolution_rate: 0 })
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [priorityData, setPriorityData] = useState<any[]>([])
  const [userName, setUserName] = useState('User')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserName(localStorage.getItem('name') || 'User')
    const fetchAll = async () => {
      setLoading(true)
      const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      axios.get(`${API}/api/v1/analytics/overview`, { headers }).then(r => {
        const data = r.data
        setStats({
          total_complaints: data.total || 0,
          resolved: data.resolved || 0,
          pending: data.pending || 0,
          resolution_rate: data.resolution_rate || 0
        })
      }).catch(() => {})
      axios.get(`${API}/api/v1/analytics/by-department`, { headers }).then(r => setDepartmentData(r.data)).catch(() => {})
      axios.get(`${API}/api/v1/analytics/trend`, { headers }).then(r => setTrendData(r.data)).catch(() => {})
      axios.get(`${API}/api/v1/analytics/by-priority`, { headers }).then(r => setPriorityData(r.data)).catch(() => {})
      setLoading(false)
    }
    fetchAll()
  }, [])

  return (
    <div className="min-h-screen bg-[#00040d]">
      <Topbar title="Neural Command Center" subtitle={`Welcome back, Operator ${userName}`} />

      <div className="px-8 py-8 space-y-8 max-w-[1600px] mx-auto">
        
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Handshakes" value={stats.total_complaints.toLocaleString()} icon={FileText} color="blue" trend={12} delay={0} />
          <StatCard title="Resolved Nodes"   value={stats.resolved.toLocaleString()}          icon={CheckCircle} color="green" trend={8} delay={0.1} />
          <StatCard title="Pending Review"   value={stats.pending.toLocaleString()}            icon={Clock}   color="orange" trend={-3} delay={0.2} />
          <StatCard title="Res. Efficiency"  value={`${stats.resolution_rate}%`}              icon={TrendingUp} color="cyan" trend={5} delay={0.3} />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend area chart */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-8 border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Intelligence Flux</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Monthly complaint trajectory</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Flow</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData.length ? trendData : [{ month: 'Syncing', count: 0 }]}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fill: '#475569', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#0a1125', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fill="url(#colorCount)" dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Priority pie */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-8 border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">Severity Cluster</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Priority distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={priorityData.length ? priorityData : [{ priority: 'Syncing', count: 1 }]} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                  dataKey="count" nameKey="priority" paddingAngle={4}>
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0a1125', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-8">
              {priorityData.length ? priorityData.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-white/[0.03] p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{d.priority}</span>
                  </div>
                  <span className="text-white font-black tabular-nums">{d.count}</span>
                </div>
              )) : (
                <div className="text-center py-6">
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black animate-pulse">Synchronizing Nodes…</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Department bar + 3D network */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-8 border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">Departmental Load</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Resource allocation monitor</p>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={departmentData} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="department" width={100} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0a1125', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20}>
                  {(departmentData.length ? departmentData : []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-card p-8 border-white/5 bg-white/[0.02]"
          >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight uppercase">Neural Topology</h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Real-time data synchronization</p>
                    </div>
                </div>
            </div>
            <div className="h-[260px] rounded-2xl overflow-hidden border border-white/5">
                <NetworkVisualization />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
