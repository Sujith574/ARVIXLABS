'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import ChatBot from '@/components/ui/ChatBot'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState('citizen')
  const [userName, setUserName] = useState('User')

  useEffect(() => {
    setUserRole(localStorage.getItem('role') || 'citizen')
    setUserName(localStorage.getItem('name') || 'User')
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar userRole={userRole} userName={userName} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  )
}
