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

const mockTrend = [
  { month: 'Oct', count: 48 },
  { month: 'Nov', count: 62 },
  { month: 'Dec', count: 55 },
  { month: 'Jan', count: 78 },
  { month: 'Feb', count: 91 },
  { month: 'Mar', count: 84 },
]

const mockByPriority = [
  { priority: 'Critical', count: 12 },
  { priority: 'High',     count: 34 },
  { priority: 'Medium',   count: 67 },
  { priority: 'Low',      count: 45 },
]

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_complaints: 0, resolved: 0, pending: 0, resolution_rate: 0 })
  const [departmentData, setDepartmentData] = useState<any[]>([])
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    setUserName(localStorage.getItem('name') || 'User')
    const token = localStorage.getItem('token')
    const headers = token ? { Authorization: `Bearer ${token}` } : {}

    axios.get(`${API}/api/v1/ai/stats`).then(r => setStats(r.data)).catch(() => {})
    axios.get(`${API}/api/v1/analytics/by-department`, { headers }).then(r => setDepartmentData(r.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen">
      <Topbar title={`Welcome back, ${userName}`} subtitle="Here's what's happening today" />

      <div className="px-6 py-6 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Complaints" value={stats.total_complaints.toLocaleString()} icon={FileText} color="blue" trend={12} delay={0} />
          <StatCard title="Resolved"         value={stats.resolved.toLocaleString()}          icon={CheckCircle} color="green" trend={8} delay={0.1} />
          <StatCard title="Pending Review"   value={stats.pending.toLocaleString()}            icon={Clock}   color="orange" trend={-3} delay={0.2} />
          <StatCard title="Resolution Rate"  value={`${stats.resolution_rate}%`}              icon={TrendingUp} color="cyan" trend={5} delay={0.3} />
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Trend area chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold">Complaint Trends</h3>
                <p className="text-xs text-slate-500">Monthly overview — last 6 months</p>
              </div>
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'rgba(0,8,40,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }}
                  cursor={{ stroke: 'rgba(59,130,246,0.3)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Priority pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-semibold">By Priority</h3>
                <p className="text-xs text-slate-500">Distribution overview</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={mockByPriority} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                  dataKey="count" nameKey="priority" paddingAngle={3}>
                  {mockByPriority.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(0,8,40,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {mockByPriority.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-slate-400">{d.priority}</span>
                  </div>
                  <span className="text-white font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Department bar + 3D network */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-white font-semibold mb-1">Department Load</h3>
            <p className="text-xs text-slate-500 mb-6">Complaints per department</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={departmentData.length ? departmentData : [
                { department: 'Public Works', count: 34 },
                { department: 'Water Dept', count: 28 },
                { department: 'Transport', count: 19 },
                { department: 'Health', count: 22 },
                { department: 'Education', count: 15 },
              ]} layout="vertical">
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" width={90} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(0,8,40,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '12px', color: '#e2e8f0' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 6, 6, 0]}>
                  {(departmentData.length ? departmentData : []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-semibold">AI Data Network</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Live complaint node visualization</p>
            <NetworkVisualization />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
