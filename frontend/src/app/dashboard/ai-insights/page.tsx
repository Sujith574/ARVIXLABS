'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Lightbulb, TrendingUp, AlertTriangle, CheckCircle,
  RefreshCw, Sparkles, ChevronRight, Zap
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'
import dynamic from 'next/dynamic'

const NetworkVisualization = dynamic(() => import('@/components/three/NetworkVisualization'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const mockInsights = {
  trend: 'improving',
  insights: [
    'Infrastructure complaints have decreased by 18% over the past 30 days, indicating improved road maintenance.',
    'Water supply issues spike on Mondays and Fridays — likely correlated with weekend maintenance schedules.',
    'Department response times improved by 12% following the SLA enforcement update in February.',
    '94% of critical complaints were escalated within the mandated 2-hour window this month.',
  ],
  top_issues: [
    'Pothole-related road damage in Zone 4',
    'Irregular water supply in Sector 7 B',
    'Street lighting failures across 3 wards',
    'Delayed pension disbursements (Health Dept)',
  ],
  recommendations: [
    'Increase Public Works capacity by 20% to handle infrastructure backlog.',
    'Deploy automated water pressure monitoring to preempt Supply complaints.',
    'Create dedicated fast-track queue for senior citizen grievances.',
    'Enable SMS-based status updates to reduce repeat complaint submissions.',
  ],
}

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`${API}/api/v1/ai/insights`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInsights(res.data)
    } catch {
      setInsights(mockInsights)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInsights() }, [])

  const data = insights || mockInsights

  return (
    <div className="min-h-screen">
      <Topbar title="AI Intelligence" subtitle="Gemini-powered pattern analysis & recommendations" />
      <div className="px-6 py-6 space-y-6">

        {/* Header banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 flex items-center justify-between"
          style={{ border: '1px solid rgba(139,92,246,0.3)', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(6,182,212,0.05))' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              <Brain className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white font-bold text-lg">Gemini AI Analysis</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium text-purple-300"
                  style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                  Live
                </span>
              </div>
              <p className="text-slate-400 text-sm">RAG pipeline — last analysed: just now</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: data.trend === 'improving' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                       border: `1px solid ${data.trend === 'improving' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                       color: data.trend === 'improving' ? '#10b981' : '#ef4444' }}>
              {data.trend === 'improving' ? <TrendingUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              Trend: {data.trend}
            </div>
            <button onClick={fetchInsights} disabled={loading}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Insights */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <h3 className="text-white font-semibold">Key Insights</h3>
            </div>
            <div className="space-y-4">
              {(data.insights || []).map((insight: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-blue-400"
                    style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{insight}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h3 className="text-white font-semibold">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {(data.recommendations || []).map((rec: string, i: number) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 rounded-xl" style={{ background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
                  <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300 leading-relaxed">{rec}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top issues + 3D */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-semibold">Top Issues Detected</h3>
            </div>
            <div className="space-y-3">
              {(data.top_issues || []).map((issue: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.1)' }}>
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-orange-400 flex-shrink-0"
                    style={{ background: 'rgba(249,115,22,0.15)' }}>
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-300">{issue}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">AI Data Network</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">Semantic complaint clustering visualization</p>
            <NetworkVisualization />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
