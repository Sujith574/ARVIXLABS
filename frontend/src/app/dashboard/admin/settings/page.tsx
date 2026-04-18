'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Save, Key, Globe, Bell, Loader2, CheckCircle, Shield, Zap, Database } from 'lucide-react'
import axios from 'axios'
import Topbar from '@/components/layout/Topbar'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    platform_name: 'Arvix Labs',
    support_email: 'hello@arvixlabs.ai',
    hero_title: '',
    hero_subtitle: ''
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState('')
  const [saving, setSaving] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token') || localStorage.getItem('admin_token')}` })

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API}/api/v1/cms/settings`)
        if (res.data) setSettings(res.data)
      } catch (err) {
        console.error("Failed to load settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const saveConfig = async () => {
    setSaving(true)
    try {
      await axios.put(`${API}/api/v1/cms/settings`, settings, { headers: headers() })
      setSaved('site')
      setTimeout(() => setSaved(''), 3000)
    } catch (err) {
      alert("Failed to save site configuration. Ensure you have administrative privileges.")
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ id, title, icon: Icon, color, children, onSave }: any) => (
    <div className="glass-card p-8 space-y-6" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-black/20"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">System Configuration Module</p>
          </div>
        </div>
        <button onClick={onSave} disabled={saving}
          className={`${saved === id ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'btn-glow'} px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all`}>
          {saved === id
            ? <><CheckCircle className="w-4 h-4 inline mr-2" /> Verified</>
            : saving && saved === '' ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" /> Syncing…</>
            : <><Save className="w-4 h-4 inline mr-2" /> Save Changes</>
          }
        </button>
      </div>
      <div className="pt-2">
        {children}
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#00040d]">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">Neural Handshake in Progress</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen pb-24 bg-[#00040d]">
      <Topbar title="System Architecture" subtitle="Neural core configuration & security" />
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        
        <div className="grid lg:grid-cols-2 gap-8">
          <Section id="site" title="Platform Identity" icon={Globe} color="#3b82f6" onSave={saveConfig}>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-3">Public Instance Name</label>
                <input 
                  className="input-glass bg-black/40 border-white/10 focus:border-blue-500/50" 
                  value={settings.platform_name} 
                  onChange={e => setSettings({...settings, platform_name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-3">Administrative Dispatch Email</label>
                <input 
                  className="input-glass bg-black/40 border-white/10 focus:border-blue-500/50" 
                  value={settings.support_email || ''} 
                  onChange={e => setSettings({...settings, support_email: e.target.value})}
                />
              </div>
            </div>
          </Section>

          <Section id="api" title="Security Protocols" icon={Shield} color="#10b981" onSave={() => alert("Hardware keys are managed via production environment variables.")}>
            <div className="space-y-6 opacity-60">
               <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-2">NEURAL_API_KEY_ENCRYPTED</label>
                  <input className="input-glass font-mono text-[10px] uppercase tracking-widest bg-black/60" type="password" value="********************************" disabled />
               </div>
               <div>
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-2">DB_CORE_CONNECTION_TOKEN</label>
                  <input className="input-glass font-mono text-[10px] uppercase tracking-widest bg-black/60" type="password" value="********************************" disabled />
               </div>
            </div>
          </Section>
        </div>

        <Section id="branding" title="Hero Deployment" icon={Zap} color="#f59e0b" onSave={saveConfig}>
          <div className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-3">Main Landing Headline</label>
              <input 
                className="input-glass bg-black/40 border-white/10 focus:border-orange-500/50" 
                value={settings.hero_title || ''} 
                onChange={e => setSettings({...settings, hero_title: e.target.value})}
                placeholder="Next-Gen Intelligence Node"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] block mb-3">Structural Narrative</label>
              <textarea 
                className="input-glass min-h-[120px] bg-black/40 border-white/10 focus:border-orange-500/50" 
                value={settings.hero_subtitle || ''} 
                onChange={e => setSettings({...settings, hero_subtitle: e.target.value})}
                placeholder="Describe the platform's core directive..."
              />
            </div>
          </div>
        </Section>

        {/* System Health Monitor */}
        <div className="grid md:grid-cols-3 gap-6">
           {[
             { label: 'Neural Core', status: 'Optimal', icon: Brain, color: '#3b82f6', value: '99.9%' },
             { label: 'Packet Flow', status: 'Stable', icon: Database, color: '#10b981', value: '12ms' },
             { label: 'Handshake', status: 'Secured', icon: Shield, color: '#f59e0b', value: 'AES-256' }
           ].map((item, i) => (
             <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.02] group">
                <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/40 border border-white/10">
                        <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <span className="text-[10px] font-black text-white tabular-nums px-2 py-1 rounded bg-white/5 border border-white/10">{item.value}</span>
                </div>
                <div>
                   <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] font-black mb-1">{item.label}</p>
                   <p className="text-white text-sm font-bold flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                       {item.status}
                   </p>
                </div>
             </div>
           ))}
        </div>

         {/* Emergency Directives */}
         <div className="glass-card p-8 overflow-hidden relative border-red-500/20 bg-red-500/[0.02]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[120px] -mr-32 -mt-32" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-2">
              <h2 className="text-red-500 text-2xl font-black tracking-tighter uppercase flex items-center gap-3">
                <Shield className="w-6 h-6" /> Emergency Purge
              </h2>
              <p className="text-slate-400 text-sm max-w-xl font-medium">Warning: This action initiates a complete structural reset. All neural embeddings, user records, and grievances will be permanently purged from the production cluster. This handshake cannot be revoked.</p>
            </div>
            <button className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/30 whitespace-nowrap">
              Execute Purge
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
