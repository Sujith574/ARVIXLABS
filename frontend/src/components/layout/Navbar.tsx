'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Menu, X, ArrowRight, Zap } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Grievance', href: '/grievance' },
  { label: 'AI', href: '/ai' },
  { label: 'Technologies', href: '/technologies' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Founders', href: '/founders' },
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
      <div className="gov-strip hidden lg:flex justify-between items-center relative z-[70]">
        <div className="flex items-center gap-3">
           <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
           <span className="opacity-80">Arvix Intelligence Command Center</span>
        </div>
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-2">
             <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
             <span>System Status: Optimal</span>
           </div>
           <span className="opacity-50">v2.1.0-PRODUCTION</span>
        </div>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────────────────── */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5 py-3' 
          : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#0A2A66] shadow-xl shadow-blue-900/20 group-hover:rotate-6 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-[#0A2A66] tracking-tighter text-2xl leading-none">ARVIX LABS</span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600/60 mt-0.5">Intelligence Portal</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href
              return (
                <Link 
                  key={link.label} 
                  href={link.href} 
                  className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl ${
                    isActive 
                      ? 'text-[#0A2A66] bg-blue-50/50' 
                      : 'text-slate-500 hover:text-[#0A2A66] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-active" 
                      className="absolute bottom-1 left-5 right-5 h-0.5 bg-[#0A2A66] rounded-full" 
                    />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-4">
             <Link href="/grievance" className="gov-gradient-button px-7 py-3 text-sm group">
                Submit Grievance
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>

          <button 
            className="lg:hidden w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-100" 
            onClick={() => setMobileMenu(v => !v)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 shadow-2xl overflow-hidden z-40"
            >
              <div className="p-6 space-y-2">
                {NAV_LINKS.map(l => (
                  <Link 
                    key={l.label} 
                    href={l.href}
                    className={`block w-full px-5 py-4 rounded-2xl text-lg font-bold transition-all ${
                      pathname === l.href 
                        ? 'bg-blue-50 text-[#0A2A66]' 
                        : 'text-slate-600 active:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <div className="pt-4">
                  <Link href="/grievance" className="gov-gradient-button w-full justify-center py-5 text-lg">
                    Submit Grievance
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
