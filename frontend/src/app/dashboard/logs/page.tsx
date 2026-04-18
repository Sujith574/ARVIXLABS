'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Clock, User, ArrowRight, Filter } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'

const mockLogs = Array.from({ length: 30 }, (_, i) => ({
  id: String(i),
  action: ['LOGIN', 'SUBMIT_COMPLAINT', 'UPDATE_STATUS', 'CREATE_DEPARTMENT', 'DELETE_USER', 'AI_CLASSIFY', 'EXPORT_REPORT'][i % 7],
  user: ['arvixlabs@gmail.com', 'officer@arvixlabs.gov', 'citizen@example.com'][i % 3],
  resource_type: ['complaint', 'user', 'department', 'category', 'system'][i % 5],
  resource_id: `ID-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  created_at: new Date(Date.now() - i * 10 * 60000).toISOString(),
}))

const actionColors: Record<string, string> = {
  LOGIN:             '#10b981',
  SUBMIT_COMPLAINT:  '#3b82f6',
  UPDATE_STATUS:     '#f59e0b',
  CREATE_DEPARTMENT: '#22d3ee',
  DELETE_USER:       '#ef4444',
  AI_CLASSIFY:       '#a78bfa',
  EXPORT_REPORT:     '#f97316',
}

export default function ActivityLogsPage() {
  const [logs] = useState(mockLogs)
  const [filter, setFilter] = useState('')

  const filtered = logs.filter(l =>
    filter === '' || l.action.includes(filter.toUpperCase()) || l.user.includes(filter)
  )

  return (
    <div className="min-h-screen">
      <Topbar title="Activity Logs" subtitle="System audit trail and user activity" />
      <div className="px-6 py-6 space-y-6">

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input className="input-glass pl-10" placeholder="Filter by action or user…"
              value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-slate-400"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Activity className="w-4 h-4" />
            {filtered.length} events
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Time', 'User', 'Action', 'Resource', 'IP Address'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <motion.tr key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">{new Date(log.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-blue-400"
                          style={{ background: 'rgba(59,130,246,0.1)' }}>
                          {log.user[0].toUpperCase()}
                        </div>
                        <span className="text-slate-400 text-xs">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          color: actionColors[log.action] || '#94a3b8',
                          background: `${actionColors[log.action] || '#94a3b8'}15`,
                          border: `1px solid ${actionColors[log.action] || '#94a3b8'}30`,
                        }}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      <span className="capitalize">{log.resource_type}</span>
                      <span className="text-slate-600 ml-2 font-mono">{log.resource_id}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs font-mono">{log.ip_address}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
