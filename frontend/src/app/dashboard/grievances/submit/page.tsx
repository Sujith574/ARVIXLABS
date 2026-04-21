'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Upload, Send, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const CATEGORIES = [
  'Infrastructure', 'Water Supply', 'Electricity', 'Roads & Transport',
  'Sanitation', 'Healthcare', 'Education', 'Law & Order', 'Housing',
  'Environment', 'Revenue', 'Social Welfare', 'Other'
]

export default function SubmitGrievancePage() {
  const [form, setForm] = useState({ title: '', description: '', category_id: '' })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState<any>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const token = localStorage.getItem('token')

    try {
      const res = await axios.post(`${API}/api/v1/grievances/submit`, form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSubmitted(res.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit complaint. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Topbar title="Grievance Submitted" />
        <div className="flex items-center justify-center min-h-[80vh] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 max-w-lg w-full text-center"
            style={{ border: '1px solid rgba(16,185,129,0.3)' }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Complaint Filed!</h2>
            <p className="text-slate-400 mb-6">Your grievance has been submitted and AI classification is in progress.</p>

            <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <p className="text-xs text-slate-500 mb-1">Ticket ID</p>
              <p className="text-2xl font-mono font-black text-blue-400">{submitted.ticket_id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-slate-500 text-xs mb-1">AI Category</p>
                <p className="text-white font-medium">{submitted.ai_category || 'Processing…'}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-slate-500 text-xs mb-1">Priority</p>
                <p className="text-white font-medium capitalize">{submitted.ai_priority || submitted.priority}</p>
              </div>
            </div>

            {submitted.ai_summary && (
              <div className="text-left p-3 rounded-xl mb-6 text-sm text-slate-400" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <p className="text-xs text-slate-600 mb-1">AI Summary</p>
                {submitted.ai_summary}
              </div>
            )}

            <div className="flex gap-3">
              <Link href={`/track?id=${submitted.ticket_id}`} className="flex-1 btn-glow text-white justify-center py-3">
                Track Status
              </Link>
              <button onClick={() => { setSubmitted(null); setForm({ title: '', description: '', category_id: '' }) }}
                className="flex-1 btn-outline-glow justify-center py-3">
                New Complaint
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Topbar title="Submit Grievance" subtitle="File a new complaint with AI assistance" />
      <div className="px-6 py-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
          style={{ border: '1px solid rgba(59,130,246,0.15)' }}
        >
          <div className="flex items-center gap-3 mb-8 p-4 rounded-xl"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <p className="text-sm text-slate-400">
              Your complaint will be automatically classified by AI and routed to the appropriate department.
            </p>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Complaint Title *
              </label>
              <input
                id="complaint-title"
                type="text"
                required
                className="input-glass"
                placeholder="Brief description of your issue…"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Category (Optional — AI will detect automatically)
              </label>
              <select
                id="complaint-category"
                className="input-glass"
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">Let AI decide</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Detailed Description *
              </label>
              <textarea
                id="complaint-description"
                required
                rows={6}
                className="input-glass resize-none"
                placeholder="Provide as much detail as possible — location, dates, people involved, and the impact of the issue…"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
              <p className="text-xs text-slate-600 mt-1.5">{form.description.length} characters</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Attachments (Optional)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-28 rounded-xl cursor-pointer transition-all"
                style={{ border: '2px dashed rgba(59,130,246,0.25)', background: 'rgba(59,130,246,0.04)' }}>
                <Upload className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-sm text-slate-500">{file ? file.name : 'Click to upload or drag & drop'}</span>
                <span className="text-xs text-slate-600 mt-0.5">PDF, images up to 10MB</span>
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !form.title || !form.description}
              id="submit-grievance"
              className="w-full btn-glow text-white justify-center py-4 font-semibold disabled:opacity-50"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting & Classifying…</>
                : <><Send className="w-5 h-5" /> Submit Grievance</>
              }
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
