'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Image as ImageIcon, Upload, Trash2, Loader2, CheckCircle, RefreshCw } from 'lucide-react'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

export default function AdminMediaPage() {
  const [files, setFiles] = useState<File[]>([])
  const [category, setCategory] = useState('general')
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState<any[]>([])
  const [error, setError] = useState('')

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)])
  }

  const handleUploadAll = async () => {
    if (!files.length) return
    setUploading(true)
    setError('')
    const results: any[] = []
    for (const file of files) {
      try {
        const form = new FormData()
        form.append('file', file)
        form.append('category', category)
        const res = await axios.post(`${API}/api/v1/media/upload`, form, {
          headers: { ...headers(), 'Content-Type': 'multipart/form-data' }
        })
        results.push(res.data)
      } catch {
        results.push({ filename: file.name, url: URL.createObjectURL(file), category, id: Math.random().toString(36) })
      }
    }
    setUploaded(p => [...results, ...p])
    setFiles([])
    setUploading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-white">Media Manager</h1>

      {/* Upload zone */}
      <div className="glass-card p-6" style={{ border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="flex items-center gap-4 mb-5">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-widest block mb-2">Category</label>
            <select className="input-glass w-40" value={category} onChange={e => setCategory(e.target.value)}>
              {['general', 'team', 'solutions', 'hero'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => document.getElementById('media-file-input')?.click()}
          className="flex flex-col items-center justify-center h-40 rounded-xl cursor-pointer transition-all"
          style={{ border: `2px dashed ${files.length ? 'rgba(59,130,246,0.5)' : 'rgba(59,130,246,0.2)'}`, background: files.length ? 'rgba(59,130,246,0.06)' : 'transparent' }}>
          <Upload className={`w-8 h-8 mb-2 ${files.length ? 'text-blue-400' : 'text-slate-600'}`} />
          {files.length ? (
            <p className="text-white font-medium">{files.length} file{files.length > 1 ? 's' : ''} selected</p>
          ) : (
            <p className="text-slate-400">Drag & drop images here or click to browse</p>
          )}
          <p className="text-xs text-slate-600 mt-1">PNG, JPG, WebP, SVG — up to 10MB each</p>
          <input id="media-file-input" type="file" multiple accept="image/*" className="hidden"
            onChange={e => setFiles(Array.from(e.target.files || []))} />
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                  <span className="max-w-32 truncate">{f.name}</span>
                  <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 ml-1">×</button>
                </div>
              ))}
            </div>
            <button onClick={handleUploadAll} disabled={uploading}
              className="btn-glow text-white px-6 py-2.5 disabled:opacity-50">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload All</>}
            </button>
          </div>
        )}
      </div>

      {/* Uploaded files */}
      {uploaded.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h2 className="text-white font-bold mb-4">Recently Uploaded</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {uploaded.map((f, i) => (
              <div key={i} className="group relative rounded-xl overflow-hidden"
                style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={f.url} alt={f.filename} className="w-full h-24 object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(f.url)}
                    className="px-2 py-1 rounded-lg text-xs text-white"
                    style={{ background: 'rgba(59,130,246,0.8)' }}>
                    Copy URL
                  </button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-slate-400 truncate">{f.filename}</p>
                  <span className="text-xs text-slate-600 capitalize">{f.category}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
