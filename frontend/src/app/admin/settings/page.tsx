'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Key, Globe, Bell, Loader2, CheckCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async (section: string) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    setSaved(section)
    setTimeout(() => setSaved(''), 3000)
  }

  const Section = ({ id, title, icon: Icon, color, children }: any) => (
    <div className="glass-card p-6 space-y-4" style={{ border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
          <h2 className="text-white font-bold">{title}</h2>
        </div>
        <button onClick={() => save(id)} disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${saved === id ? 'text-green-400' : 'text-white btn-glow'}`}
          style={saved === id ? { background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' } : {}}>
          {saved === id
            ? <><CheckCircle className="w-4 h-4" /> Saved</>
            : saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            : <><Save className="w-4 h-4" /> Save</>
          }
        </button>
      </div>
      {children}
    </div>
  )

  const Field = ({ label, placeholder, type = 'text', defaultValue = '' }: any) => (
    <div>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">{label}</label>
      <input type={type} className="input-glass" placeholder={placeholder} defaultValue={defaultValue} />
    </div>
  )

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-black text-white">Settings</h1>

      <Section id="admin" title="Admin Account" icon={Key} color="#f59e0b">
        <Field label="Admin Username" placeholder="admin" defaultValue="admin" />
        <Field label="New Password" type="password" placeholder="Enter new password to change" />
        <Field label="Confirm Password" type="password" placeholder="Repeat new password" />
      </Section>

      <Section id="api" title="API Keys" icon={Settings} color="#3b82f6">
        <Field label="Arvix AI API Key" placeholder="AIza…" />
        <Field label="Firebase Project ID" placeholder="your-project-id" />
        <Field label="Firebase Storage Bucket" placeholder="your-project.appspot.com" />
      </Section>

      <Section id="site" title="Site Configuration" icon={Globe} color="#22d3ee">
        <Field label="Platform Name" defaultValue="Arvix Labs" placeholder="Platform name" />
        <Field label="Support Email" type="email" placeholder="hello@arvixlabs.ai" />
        <Field label="Backend URL (for frontend)" placeholder="https://api.arvixlabs.ai" />
      </Section>

      <Section id="notifications" title="Notifications" icon={Bell} color="#10b981">
        {['Email me on new AI queries', 'Email me on media uploads', 'Email me on content updates'].map(label => (
          <label key={label} className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-10 h-5 rounded-full transition-all peer-checked:bg-blue-500" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-slate-300">{label}</span>
          </label>
        ))}
      </Section>

      {/* Danger zone */}
      <div className="glass-card p-6" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
        <h2 className="text-red-400 font-bold mb-4">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-sm font-medium">Clear AI Knowledge Base</p>
            <p className="text-slate-500 text-xs mt-1">Removes all FAISS embeddings. Cannot be undone.</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-medium text-red-400 transition-all hover:bg-red-500/10"
            style={{ border: '1px solid rgba(239,68,68,0.3)' }}>
            Clear Index
          </button>
        </div>
      </div>
    </div>
  )
}
