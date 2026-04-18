'use client'

import { motion } from 'framer-motion'
import { Bell, Search, Moon, Sun } from 'lucide-react'

interface TopbarProps {
  title: string
  subtitle?: string
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 px-8 py-5 flex items-center justify-between border-b border-white/5 bg-[#00040d]/80 backdrop-blur-xl">
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">{title}</h1>
        {subtitle && <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1.5">{subtitle}</p>}
      </motion.div>

      <div className="flex items-center gap-4">
        {/* Network Status */}
        <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl border border-white/5 bg-white/[0.02]">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link: ACTIVE</p>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all bg-white/[0.03] border border-white/5 hover:border-blue-500/30">
                <Search className="w-4 h-4" />
            </button>
            <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all bg-white/[0.03] border border-white/5 hover:border-blue-500/30">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
            </button>
        </div>

        <div className="h-8 w-px bg-white/10 mx-1" />

        {/* Organization Node */}
        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">ARVIX_LABS</p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mt-1">Prod Cluster 01</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-400/30">
              AL
            </div>
        </div>
      </div>
    </header>
  )
}
