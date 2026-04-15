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
      { href: '/dashboard/admin/departments', icon: Building, label: 'Departments' },
      { href: '/dashboard/admin/categories', icon: Tag, label: 'Categories' },
      { href: '/dashboard/admin/data', icon: Database, label: 'Data Ingestion' },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <p className="font-bold text-white text-sm tracking-wide">ARVIX LABS</p>
            <p className="text-xs text-slate-500">Gov Intelligence</p>
          </motion.div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-white text-sm font-medium">{userName}</p>
          <p className="text-xs text-blue-400 capitalize">{userRole.replace('_', ' ')}</p>
        </div>
      )}

      {/* Nav sections */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-hidden">
        {navSections.map((section) => {
          if (section.roles && !section.roles.includes(userRole)) return null
          return (
            <div key={section.title}>
              {!collapsed && (
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">
                  {section.title}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div className={`nav-item ${active ? 'active' : ''}`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                        {!collapsed && active && <ChevronRight className="w-3 h-3 ml-auto" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-white/5 pt-4">
        <Link href="/">
          <div className="nav-item text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen sticky top-0 overflow-hidden flex-shrink-0"
        style={{ background: 'rgba(0, 8, 40, 0.8)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute right-3 top-6 w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
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
