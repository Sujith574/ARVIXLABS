'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, FileText, FileJson, Trash2, RefreshCw, Eye } from 'lucide-react'
import Link from 'next/link'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

export default function AdminDatasetsPage() {
  const [datasets, setDatasets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/v1/ai/datasets`, { headers: headers() })
      setDatasets(res.data)
    } catch { setDatasets([]) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Datasets</h1>
          <p className="text-slate-500 text-sm mt-1">Ingested data files indexed in FAISS</p>
        </div>
        <div className="flex gap-3">
          <button onClick={load} className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link href="/admin/ai" className="btn-glow text-white">
            <Database className="w-4 h-4" /> Upload New
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="glass-card p-5 h-16 shimmer rounded-2xl" />)}
        </div>
      ) : datasets.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No datasets uploaded yet.</p>
          <Link href="/admin/ai" className="btn-glow text-white px-6 py-2.5">
            Upload First Dataset
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {datasets.map((d: any, i: number) => (
            <motion.div key={d.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                {d.source_type === 'json' ? <FileJson className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-cyan-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{d.filename}</p>
                <p className="text-slate-500 text-xs mt-0.5">{d.description || 'No description'}</p>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">{d.record_count?.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">Records</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full uppercase font-medium"
                  style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                  Indexed
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
