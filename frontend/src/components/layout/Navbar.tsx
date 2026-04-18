'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Menu, X, ArrowRight, Zap, Activity, Globe, Fingerprint } from 'lucide-react'
import PremiumButton from '@/components/ui/PremiumButton'

const NAV_LINKS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Registry', href: '/grievance' },
  { label: 'Intelligence', href: '/ai' },
  { label: 'Core Tech', href: '/technologies' },
  { label: 'Neural Metrics', href: '/analytics' },
  { label: 'Architects', href: '/founders' },
  { label: 'Audit Trail', href: '/track' },
]

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenu(false)
  }, [pathname])

  return (
    <>
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="hidden lg:flex justify-between items-center px-8 py-2 bg-slate-950 border-b border-white/5 relative z-[70] text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2">
              <Globe className="w-3 h-3 text-sky-400" />
              <span className="text-sky-400">Global Node: asia-south1</span>
           </span>
           <span className="w-px h-3 bg-white/10" />
           <span className="opacity-80 uppercase tracking-widest">ARVIX CORE: ACTIVE</span>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Throughput: Optimal</span>
           </div>
           <span className="text-white/10">v4.2.0-PROD</span>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/10 py-4' 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-sky-500 shadow-[0_0_30px_-5px_rgba(14,165,233,0.5)] group-hover:rotate-[10deg] transition-all duration-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-white tracking-tighter text-2xl leading-none uppercase">ARVIX LABS</span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-sky-400/70 mt-1">Intelligence Core</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-xl">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`relative px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
                    isActive 
                      ? 'text-white' 
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active" 
                      className="absolute inset-0 bg-white/10 rounded-xl border border-white/10 shadow-inner" 
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-8">
             <Link 
               href="/auth/login"
               className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-300 group relative"
               title="Administrative Portal Control"
             >
               <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <Fingerprint className="w-5 h-5 relative z-10" />
             </Link>
             <Link href="/grievance">
                <PremiumButton size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                   Deploy Resolution
                </PremiumButton>
             </Link>
          </div>

          <button 
            className="lg:hidden w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-white border border-white/10" 
            onClick={() => setMobileMenu(v => !v)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-4 bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-40"
            >
              <div className="p-8 space-y-3">
                {NAV_LINKS.map(l => (
                  <Link 
                    key={l.label} 
                    href={l.href}
                    className={`block w-full px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                      pathname === l.href 
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' 
                        : 'text-white/60 active:bg-white/5'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-6">
                  <Link href="/grievance">
                    <PremiumButton className="w-full justify-center" icon={<ArrowRight className="w-5 h-5" />}>
                      Initial Dispatch
                    </PremiumButton>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
