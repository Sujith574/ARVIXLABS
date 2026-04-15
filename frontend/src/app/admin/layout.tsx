'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, FileText, Brain, Database, Users, Image,
  Settings, LogOut, Shield, ChevronLeft, ChevronRight, Menu,
  AlertTriangle, Cpu, Mail
} from 'lucide-react'

const NAV = [
  { section: 'Platform' },
  { label: 'Dashboard',     icon: LayoutDashboard, href: '/admin/dashboard' },
  { label: 'Grievances',    icon: AlertTriangle,   href: '/admin/grievances' },
  { section: 'CMS' },
  { label: 'Content',       icon: FileText,        href: '/admin/cms' },
  { label: 'Technologies',  icon: Cpu,             href: '/admin/technologies' },
  { label: 'Team',          icon: Users,           href: '/admin/team' },
  { label: 'Media',         icon: Image,           href: '/admin/media' },
  { section: 'AI / Data' },
  { label: 'AI Knowledge',  icon: Brain,           href: '/admin/ai' },
  { label: 'Datasets',      icon: Database,        href: '/admin/datasets' },
  { section: 'Comms' },
  { label: 'Messages',      icon: Mail,            href: '/admin/contacts' },
  { label: 'Settings',      icon: Settings,        href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileSidebar, setMobileSidebar] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') return
    const token = localStorage.getItem('admin_token')
    if (!token) router.push('/admin/login')
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 mb-6 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #22d3ee)' }}>
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-white font-black text-sm leading-none">ARVIX LABS</p>
            <p className="text-slate-500 text-xs mt-0.5">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-3">
        {NAV.map((item, i) => {
          if ('section' in item) {
            if (collapsed) return null
            return (
              <p key={i} className="text-xs font-semibold text-slate-600 uppercase tracking-widest px-3 pt-4 pb-1.5">
                {item.section}
              </p>
            )
          }
          const navItem = item as { label: string; icon: any; href: string }
          const Icon = navItem.icon
          const active = pathname.startsWith(navItem.href)
          return (
            <Link key={navItem.href} href={navItem.href} onClick={() => setMobileSidebar(false)}
              title={collapsed ? navItem.label : undefined}
              className={`nav-item ${active ? 'active' : ''} ${collapsed ? 'justify-center px-3' : ''}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{navItem.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button onClick={handleLogout}
          className={`nav-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-3' : ''}`}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ background: 'rgba(0,8,40,0.95)', borderRight: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, height: '100vh' }}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(v => !v)}
          className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white"
          style={{ background: 'rgba(0,8,40,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileSidebar(false)} />
          <motion.aside initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            className="fixed top-0 left-0 h-full w-60 z-50 flex flex-col md:hidden"
            style={{ background: 'rgba(0,8,40,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,8,40,0.9)' }}>
          <button onClick={() => setMobileSidebar(true)} className="text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-bold text-sm">ARVIX LABS Admin</span>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
