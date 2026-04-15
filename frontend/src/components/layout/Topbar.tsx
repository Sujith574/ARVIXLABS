'use client'

import { motion } from 'framer-motion'
import { Bell, Search, Moon, Sun } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      style={{ background: 'rgba(0, 8, 40, 0.7)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </motion.div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Search className="w-4 h-4" />
          <span className="text-sm">Search…</span>
          <kbd className="text-xs px-1.5 py-0.5 rounded text-slate-600" style={{ background: 'rgba(255,255,255,0.05)' }}>⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
          AL
        </div>
      </div>
    </header>
  )
}
