'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Brain, Database, Users, Image, Activity, RefreshCw, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const QUICK_ACTIONS = [
  { label: 'Edit Homepage',  href: '/admin/cms',      color: '#3b82f6', icon: FileText },
  { label: 'Manage Team',    href: '/admin/team',     color: '#f59e0b', icon: Users },
  { label: 'Upload Dataset', href: '/admin/datasets', color: '#10b981', icon: Database },
  { label: 'AI Knowledge',   href: '/admin/ai',       color: '#a78bfa', icon: Brain },
  { label: 'Upload Media',   href: '/admin/media',    color: '#22d3ee', icon: Image },
]

const RECENT_ACTIVITY = [
  { label: 'Hero section updated',        time: '2 min ago', type: 'cms' },
  { label: 'New founder profile added',   time: '1h ago',    type: 'team' },
  { label: 'Dataset ingested (1.2k rows)',time: '3h ago',    type: 'data' },
  { label: 'AI knowledge base refreshed',time: '5h ago',    type: 'ai' },
  { label: 'Banner image uploaded',       time: '1d ago',    type: 'media' },
]

const typeColors: Record<string, string> = {
  cms: '#3b82f6', team: '#f59e0b', data: '#10b981', ai: '#a78bfa', media: '#22d3ee'
}

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ features: 0, solutions: 0, founders: 0, stats: 0 })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    const h = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })
    try {
      const [f, s, fo, st] = await Promise.allSettled([
        axios.get(`${API}/api/v1/cms/features`, { headers: h() }),
        axios.get(`${API}/api/v1/cms/solutions`, { headers: h() }),
        axios.get(`${API}/api/v1/founders/`, { headers: h() }),
        axios.get(`${API}/api/v1/cms/stats`, { headers: h() }),
      ])
      setCounts({
        features:  f.status  === 'fulfilled' ? f.value.data.length  : 4,
        solutions: s.status  === 'fulfilled' ? s.value.data.length  : 3,
        founders:  fo.status === 'fulfilled' ? fo.value.data.length : 2,
        stats:     st.status === 'fulfilled' ? st.value.data.length : 4,
      })
    } catch { } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const STAT_CARDS = [
    { label: 'Features',  value: counts.features,  color: '#3b82f6', icon: FileText },
    { label: 'Solutions', value: counts.solutions, color: '#22d3ee', icon: Brain },
    { label: 'Team',      value: counts.founders,  color: '#f59e0b', icon: Users },
    { label: 'Stats',     value: counts.stats,     color: '#10b981', icon: Database },
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 perspective-1000">
        {STAT_CARDS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={i} 
              initial={{ opacity: 0, y: 16 }} 
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ rotateY: 10, rotateX: 5, translateZ: 10, scale: 1.02 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }} 
              className="stat-card preserve-3d cursor-default"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-500 uppercase tracking-widest">{s.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <Icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-4xl font-black text-white">{s.value}</p>
              <div className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
            </motion.div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3 glass-card p-6 perspective-1000">
          <h2 className="text-white font-bold mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((a, i) => {
              const Icon = a.icon
              return (
                <Link key={i} href={a.href}
                  className="flex flex-col items-center gap-3 p-4 rounded-xl transition-all hover:scale-105 active:scale-95 group preserve-3d"
                  style={{ background: `${a.color}0a`, border: `1px solid ${a.color}25` }}>
                  <motion.div 
                    whileHover={{ scale: 1.1, rotateZ: 5 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all bg-white/5 group-hover:bg-white/10"
                    style={{ border: `1px solid ${a.color}35` }}>
                    <Icon className="w-5 h-5" style={{ color: a.color }} />
                  </motion.div>
                  <span className="text-xs font-medium text-white text-center">{a.label}</span>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 glass-card p-6">
          <h2 className="text-white font-bold mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"
                  style={{ background: typeColors[a.type] || '#64748b' }} />
                <div>
                  <p className="text-sm text-white group-hover:text-blue-400 transition-colors">{a.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Links to sections */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'Content Manager', desc: 'Edit hero, features, solutions, stats', href: '/admin/cms', color: '#3b82f6' },
          { title: 'AI Knowledge',    desc: 'Upload data, manage RAG pipeline',      href: '/admin/ai',  color: '#a78bfa' },
          { title: 'Team Profiles',   desc: 'Add/Edit founders and developers',      href: '/admin/team',color: '#f59e0b' },
        ].map((card, i) => (
          <Link key={i} href={card.href}
            className="glass-card p-5 flex items-center justify-between group hover:scale-[1.02] transition-all"
            style={{ border: `1px solid ${card.color}20` }}>
            <div>
              <p className="text-white font-semibold mb-1">{card.title}</p>
              <p className="text-xs text-slate-500">{card.desc}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
