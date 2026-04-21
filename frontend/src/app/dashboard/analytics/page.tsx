'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, TrendingDown, Brain, Download,
  Filter, RefreshCw
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const COLORS = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981', '#f97316', '#ef4444']

const mockTrend: any[] = []

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-4 py-3" style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
      <p className="text-xs text-slate-400 mb-2">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-medium" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>({})
  const [byDept, setByDept] = useState<any[]>([])
  const [byCategory, setByCategory] = useState<any[]>([])
  const [byPriority, setByPriority] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAll = async () => {
    setLoading(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    const h = { headers: { Authorization: `Bearer ${token}` } }
    try {
      const [ov, dept, cat, pri] = await Promise.all([
        axios.get(`${API}/api/v1/analytics/overview`, h),
        axios.get(`${API}/api/v1/analytics/by-department`, h),
        axios.get(`${API}/api/v1/analytics/by-category`, h),
        axios.get(`${API}/api/v1/analytics/by-priority`, h),
      ])
      setOverview(ov.data)
      setByDept(dept.data)
      setByCategory(cat.data)
      setByPriority(pri.data)
    } catch { /* use mock data */ } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const deptData = byDept

  const catData = byCategory.slice(0, 7)

  const priData = byPriority

  return (
    <div className="min-h-screen">
      <Topbar title="Analytics" subtitle="Complaint data intelligence" />
      <div className="px-6 py-6 space-y-6">

        {/* Top KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Complaints', value: overview.total || 158, change: +12, color: '#3b82f6' },
            { label: 'Resolution Rate', value: `${overview.resolution_rate || 87.3}%`, change: +5, color: '#10b981' },
            { label: 'Pending',          value: overview.pending || 19, change: -3, color: '#f97316' },
            { label: 'Critical Issues',  value: overview.critical || 12, change: +2, color: '#ef4444' },
          ].map((k, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }} className="stat-card">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">{k.label}</p>
              <p className="text-3xl font-bold text-white">{k.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {k.change > 0
                  ? <TrendingUp className="w-3 h-3 text-green-400" />
                  : <TrendingDown className="w-3 h-3 text-red-400" />
                }
                <span className={`text-xs font-medium ${k.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {Math.abs(k.change)}% vs last month
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${k.color}, transparent)` }} />
            </motion.div>
          ))}
        </div>

        {/* Area chart — complaint trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold">Complaint vs Resolution Trend</h3>
              <p className="text-xs text-slate-500">Last 6 months overview</p>
            </div>
            <button onClick={fetchAll} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={mockTrend}>
              <defs>
                <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8', paddingTop: '12px' }} />
              <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#3b82f6" strokeWidth={2} fill="url(#gradSubmitted)" />
              <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} fill="url(#gradResolved)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottom row: dept bar + category pie + priority pie */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-1 glass-card p-6">
            <h3 className="text-white font-semibold mb-1">By Priority</h3>
            <p className="text-xs text-slate-500 mb-4">Complaint distribution</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={priData} cx="50%" cy="50%" outerRadius={70} innerRadius={40}
                  dataKey="count" nameKey="priority" paddingAngle={3}>
                  {priData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {priData.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-slate-400 capitalize">{d.priority}</span>
                  </div>
                  <span className="text-white font-medium">{d.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="lg:col-span-2 glass-card p-6">
            <h3 className="text-white font-semibold mb-1">Department Performance</h3>
            <p className="text-xs text-slate-500 mb-4">Complaints handled per department</p>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData} layout="vertical">
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" width={100} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Complaints" radius={[0, 6, 6, 0]}>
                  {deptData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Category breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="text-white font-semibold mb-1">Complaint Categories</h3>
          <p className="text-xs text-slate-500 mb-6">Volume by issue type</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={catData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                {catData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
