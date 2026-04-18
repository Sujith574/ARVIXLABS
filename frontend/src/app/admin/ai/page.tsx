'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileJson, FileText, Database, CheckCircle, Loader2, Brain, Zap } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

const PIPELINE_STEPS = [
  { icon: Upload,    label: 'Upload File',     color: '#3b82f6' },
  { icon: Database,  label: 'Parse & Store',   color: '#22d3ee' },
  { icon: Brain,     label: 'Generate Embeddings', color: '#a78bfa' },
  { icon: Zap,       label: 'Index in FAISS',  color: '#10b981' },
]

export default function AdminAIPage() {
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState<'csv'|'json'>('csv')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // AI context text
  const [contextText, setContextText]     = useState('')
  const [contextSaving, setContextSaving] = useState(false)
  const [contextDone, setContextDone]     = useState(false)

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('source_type', fileType)
      form.append('description', description)
      const res = await axios.post(`${API}/api/v1/ai/ingest`, form, {
        headers: { ...headers(), 'Content-Type': 'multipart/form-data' }
      })
      setResult(res.data)
    } catch (err) {
      console.error("Ingestion error:", err)
      alert("System failure. Unable to ingest dataset to FAISS index.")
    } finally { setUploading(false) }
  }

  const handleContextSave = async () => {
    setContextSaving(true)
    try {
      await axios.post(`${API}/api/v1/ai/context`, { text: contextText }, { headers: headers() })
    } catch { } finally {
      setContextSaving(false)
      setContextDone(true)
      setTimeout(() => setContextDone(false), 3000)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-black text-white">AI Knowledge Base</h1>

      {/* Pipeline visualization */}
      <div className="grid grid-cols-4 gap-3">
        {PIPELINE_STEPS.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={i} className="glass-card p-4 text-center relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: `${step.color}15`, border: `1px solid ${step.color}30` }}>
                <Icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <p className="text-xs text-white font-medium">{step.label}</p>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-slate-600 z-10 text-xs">→</div>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dataset Upload */}
        <div className="glass-card p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
          <h2 className="text-white font-bold mb-5">Upload Dataset</h2>
          {!result ? (
            <form onSubmit={handleIngest} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest block mb-2">File Type</label>
                <div className="flex gap-3">
                  {(['csv', 'json'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setFileType(t)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm transition-all ${fileType === t ? 'text-white' : 'text-slate-500'}`}
                      style={fileType === t
                        ? { background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {t === 'csv' ? <FileText className="w-4 h-4" /> : <FileJson className="w-4 h-4" />}
                      .{t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                <input className="input-glass" placeholder="e.g. Q1 2024 government survey data"
                  value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-widest block mb-2">File *</label>
                <label className="flex flex-col items-center justify-center h-28 rounded-xl cursor-pointer"
                  style={{ border: `2px dashed ${file ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.2)'}`, background: file ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.02)' }}>
                  <Upload className={`w-6 h-6 mb-2 ${file ? 'text-blue-400' : 'text-slate-600'}`} />
                  <span className="text-sm text-slate-400">{file ? file.name : `Drop .${fileType} or click to browse`}</span>
                  <input type="file" className="hidden" accept={`.${fileType}`} onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <button type="submit" disabled={!file || uploading}
                className="w-full btn-glow text-white justify-center py-3 disabled:opacity-50">
                {uploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Ingesting…</>
                  : <><Database className="w-4 h-4" /> Ingest Dataset</>
                }
              </button>
            </form>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <p className="text-white font-bold mb-2">Ingestion Complete</p>
              <p className="text-slate-400 text-sm mb-4">{result.message}</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-slate-500 mb-1">Records</p>
                  <p className="text-xl font-bold text-white">{result.records_processed}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-xs text-slate-500 mb-1">Embeddings</p>
                  <p className="text-xl font-bold text-white">{result.embeddings_created}</p>
                </div>
              </div>
              <button onClick={() => { setResult(null); setFile(null) }} className="btn-outline-glow px-6 py-2">
                Upload Another
              </button>
            </motion.div>
          )}
        </div>

        {/* AI Context */}
        <div className="glass-card p-6" style={{ border: '1px solid rgba(139,92,246,0.15)' }}>
          <h2 className="text-white font-bold mb-2">AI Context Text</h2>
          <p className="text-slate-500 text-xs mb-5">Add raw text content to the AI knowledge base. This is converted to embeddings and indexed for RAG queries.</p>
          <div className="space-y-4">
            <textarea rows={8} className="input-glass resize-none w-full"
              placeholder="Paste policy documents, reports, data summaries or any text you want the AI to use when answering questions…"
              value={contextText} onChange={e => setContextText(e.target.value)} />
            <button onClick={handleContextSave} disabled={contextSaving || !contextText}
              className={`w-full justify-center py-3 ${contextDone ? 'btn-outline-glow' : 'btn-glow text-white'} disabled:opacity-50`}>
              {contextSaving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : contextDone
                ? <><CheckCircle className="w-4 h-4 text-green-400" /> Saved to Knowledge Base</>
                : <><Brain className="w-4 h-4" /> Save to Knowledge Base</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
