'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, BarChart3, Brain, Settings,
  Users, Building, Tag, Database, Menu, X, LogOut,
  ChevronRight, Shield, Activity, Bell, Search
} from 'lucide-react'

const navSections = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
      { href: '/dashboard/ai-insights', icon: Brain, label: 'AI Insights' },
    ],
  },
  {
    title: 'Grievances',
    items: [
      { href: '/dashboard/grievances', icon: FileText, label: 'All Complaints' },
      { href: '/dashboard/grievances/submit', icon: FileText, label: 'Submit New' },
    ],
  },
  {
    title: 'Administration',
    roles: ['super_admin', 'officer'],
    items: [
      { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
      { href: '/dashboard/admin/founders', icon: Shield, label: 'Founding Council' },
      { href: '/dashboard/admin/departments', icon: Building, label: 'Departments' },
      { href: '/dashboard/admin/categories', icon: Tag, label: 'Categories' },
      { href: '/dashboard/admin/data', icon: Database, label: 'Data Ingestion' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/dashboard/admin/settings', icon: Settings, label: 'Settings' },
      { href: '/dashboard/logs', icon: Activity, label: 'Activity Logs' },
    ],
  },
]

interface SidebarProps {
  userRole?: string
  userName?: string
}

export default function Sidebar({ userRole = 'citizen', userName = 'User' }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#00040d] border-r border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-4 px-8 py-10 border-b border-white/5 bg-white/[0.01]">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 shadow-2xl">
          <Shield className="w-7 h-7 text-blue-600" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="font-black text-white text-xl tracking-tighter uppercase leading-none">ARVIX</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Intelligence</p>
          </motion.div>
        )}
      </div>

      {/* User Status Area */}
      {!collapsed && (
        <div className="mx-6 mt-8 p-5 rounded-[1.5rem] border border-white/5 bg-white/[0.02] shadow-inner relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl -mr-12 -mt-12" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 text-xs font-black text-blue-400">
                {userName[0]}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-black tracking-tight truncate uppercase leading-none">{userName}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-black truncate">{userRole.replace('_', ' ')}</p>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Registry */}
      <nav className="flex-1 px-4 py-8 space-y-10 overflow-y-auto scrollbar-hidden">
        {navSections.map((section) => {
          if (section.roles && !section.roles.includes(userRole)) return null
          return (
            <div key={section.title} className="space-y-4">
              {!collapsed && (
                <div className="flex items-center gap-3 px-4">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">
                        {section.title}
                    </p>
                    <div className="h-px bg-white/5 flex-1" />
                </div>
              )}
              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div className={`nav-item ${active ? 'active !bg-blue-600/10 !border-blue-500/20 !text-white' : 'text-slate-500 hover:!text-white'} group`}>
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${active ? 'text-blue-500' : 'group-hover:text-blue-400'}`} />
                        {!collapsed && <span className="text-xs font-black uppercase tracking-widest leading-none pt-0.5">{item.label}</span>}
                        {!collapsed && active && (
                          <div className="w-1 h-3 rounded-full bg-blue-500 ml-auto shadow-[0_0_12px_#3b82f6]" />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Terminal Footer */}
      <div className="px-4 pb-8 border-t border-white/5 pt-6 bg-white/[0.01]">
        <button
          onClick={() => {
            localStorage.clear()
            window.location.href = '/'
          }}
          className="w-full nav-item text-red-500 hover:bg-red-500/10 hover:border-red-500/20 group"
        >
          <LogOut className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
          {!collapsed && <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0 border-right border-white/5 z-40"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#1e293b] border border-white/10 flex items-center justify-center transition-all hover:border-blue-500/50 group"
        >
          <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'} group-hover:text-blue-400`} />
        </button>
      </motion.aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass-card flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 flex flex-col"
              style={{ background: 'rgba(0, 8, 40, 0.98)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
