'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, CheckCircle, RefreshCw, Eye } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

export default function AdminContactsPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<any>(null)

  const load = async () => {
    setLoading(true)
    try {
      const r = await axios.get(`${API}/api/v1/contact/admin/all`, { headers: headers() })
      setMessages(r.data)
    } catch { setMessages([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const markRead = async (id: string) => {
    try {
      await axios.patch(`${API}/api/v1/contact/admin/${id}/read`, {}, { headers: headers() })
      setMessages(m => m.map(x => x.id === id ? { ...x, read: true } : x))
    } catch { }
  }

  const deleteMsg = async (id: string) => {
    await axios.delete(`${API}/api/v1/contact/admin/${id}`, { headers: headers() })
    setMessages(m => m.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Contact Messages</h1>
          <p className="text-slate-500 text-sm mt-1">{unread} unread · {messages.length} total</p>
        </div>
        <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {messages.length === 0 && !loading ? (
        <div className="glass-card p-16 text-center">
          <Mail className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500">No messages yet.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-5">
          {/* List */}
          <div className="lg:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
            {loading ? Array(4).fill(0).map((_, i) => (
              <div key={i} className="glass-card p-4 h-20 shimmer rounded-xl" />
            )) : messages.map(m => (
              <motion.div key={m.id} layout
                onClick={() => { setSelected(m); if (!m.read) markRead(m.id) }}
                className={`glass-card p-4 cursor-pointer transition-all ${selected?.id === m.id ? 'ring-1 ring-blue-500/30' : ''}`}
                style={{ borderLeft: m.read ? undefined : '3px solid #3b82f6' }}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-semibold truncate">{m.name}</p>
                      {!m.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                    </div>
                    <p className="text-slate-400 text-xs truncate">{m.subject || 'General Inquiry'}</p>
                    <p className="text-slate-600 text-xs mt-1">{new Date(m.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); deleteMsg(m.id) }}
                    className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detail */}
          <div className="lg:col-span-3">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 sticky top-6" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-white font-bold text-lg">{selected.name}</h2>
                    <a href={`mailto:${selected.email}`} className="text-blue-400 text-sm hover:underline">
                      {selected.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.read && (
                      <span className="flex items-center gap-1.5 text-xs text-green-400">
                        <CheckCircle className="w-3.5 h-3.5" /> Read
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{new Date(selected.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {selected.subject && (
                  <div className="mb-4">
                    <p className="text-xs text-slate-500 mb-1">Subject</p>
                    <p className="text-white font-medium">{selected.subject}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl mb-5 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {selected.message}
                </div>

                <div className="flex gap-3">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Your Inquiry'}`}
                    className="flex-1 btn-glow text-white justify-center py-2.5 text-sm text-center inline-flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> Reply via Email
                  </a>
                  <button onClick={() => deleteMsg(selected.id)}
                    className="px-4 py-2.5 rounded-xl text-red-400 text-sm hover:bg-red-400/10 transition-colors"
                    style={{ border: '1px solid rgba(239,68,68,0.25)' }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass-card p-16 text-center text-slate-600 h-full flex flex-col items-center justify-center">
                <Eye className="w-8 h-8 mb-3" />
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
