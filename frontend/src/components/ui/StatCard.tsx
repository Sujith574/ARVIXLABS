'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  color?: 'blue' | 'cyan' | 'purple' | 'green' | 'orange' | 'red'
  delay?: number
}

const colorMap = {
  blue:   { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', icon: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  cyan:   { bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.25)',  icon: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  purple: { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)', icon: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
  green:  { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', icon: '#10b981', glow: 'rgba(16,185,129,0.15)' },
  orange: { bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', icon: '#f97316', glow: 'rgba(249,115,22,0.15)' },
  red:    { bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.25)',  icon: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
}

export default function StatCard({ title, value, icon: Icon, trend, trendLabel, color = 'blue', delay = 0 }: StatCardProps) {
  const c = colorMap[color]
  const trendPositive = trend !== undefined && trend > 0
  const trendNeutral  = trend === undefined || trend === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="stat-card glass-card-hover"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-widest mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trendNeutral ? (
                <Minus className="w-3 h-3 text-slate-500" />
              ) : trendPositive ? (
                <TrendingUp className="w-3 h-3 text-green-400" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-xs font-medium ${trendPositive ? 'text-green-400' : trendNeutral ? 'text-slate-500' : 'text-red-400'}`}>
                {Math.abs(trend)}% {trendLabel || 'vs last month'}
              </span>
            </div>
          )}
        </div>

        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 20px ${c.glow}` }}>
          <Icon className="w-5 h-5" style={{ color: c.icon }} />
        </div>
      </div>
    </motion.div>
  )
}
