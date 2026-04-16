'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, FileText, Search, Upload, CheckCircle, Send, Loader2, AlertCircle, Menu, X, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import axios from 'axios'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const steps = [
  { icon: FileText, title: 'Fill the Form',     desc: 'Describe your issue in detail' },
  { icon: Send,     title: 'AI Analysis',      desc: 'Auto-routed to right department' },
  { icon: Search,   title: 'Track Status',      desc: 'Monitor resolution in real-time' },
]

export default function PublicPortalPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', title: '', description: '' })
  const [submitted, setSubmitted] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await axios.post(`${API}/api/v1/grievances/submit`, {
        title: form.title, 
        description: form.description,
        submitter_name: form.name,
        submitter_email: form.email
      })
      setSubmitted(res.data)
    } catch (err: any) {
      setError('An error occurred during submission. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      
      {/* ── Top Header Strip ──────────────────────────────────────────────── */}
      <div className="gov-strip hidden md:flex justify-between items-center bg-[#F8FAFC] border-b border-slate-200">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-600" />
           <span>Arvix Labs — Official Government Intelligence Portal</span>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/" className="hover:text-primary transition-colors">Home</Link>
           <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#0A2A66]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-[#0A2A66] tracking-tight text-xl uppercase">ARVIX LABS</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/grievance" className="gov-button-outline py-2 text-xs">Track Status</Link>
            <Link href="/auth/login" className="gov-button py-2 text-xs">Officer Identity</Link>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white px-6 pb-6 space-y-4 border-b">
            <Link href="/grievance" className="block text-sm font-semibold text-slate-600 py-3 border-b">Track Status</Link>
            <Link href="/auth/login" className="block text-sm font-semibold text-slate-600 py-3">Officer Identity</Link>
          </motion.div>
        )}
      </nav>

      <div className="flex-1 py-16 px-6 max-w-4xl mx-auto w-full">
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="gov-card p-12 text-center bg-white">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 bg-green-50 border-2 border-green-100">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-black text-[#0A2A66] mb-3">Submission Confirmed</h2>
            <p className="text-slate-500 font-medium mb-10">Your grievance has been indexed for administrative review.</p>
            
            <div className="bg-secondary rounded-lg p-8 mb-10 border">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Docket ID</p>
               <p className="text-4xl font-black text-[#0A2A66] tracking-tighter">{submitted.ticket_id}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Link href={`/grievance?tab=track&id=${submitted.ticket_id}`} className="flex-1 gov-button justify-center">Track Status</Link>
              <button onClick={() => setSubmitted(null)} className="flex-1 gov-button-outline justify-center">New Submission</button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-12">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h1 className="text-4xl md:text-5xl font-black text-[#0A2A66] mb-6">Citizen Access Portal</h1>
              <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">Submit your grievances directly to the appropriate department. No registration is required for public submissions.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="text-center p-6 border rounded bg-slate-50/50">
                    <Icon className="w-6 h-6 text-[#0A2A66] mx-auto mb-4" />
                    <h4 className="font-bold text-[#0A2A66] text-sm mb-1">{s.title}</h4>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                )
              })}
            </div>

            <div className="gov-card p-10 bg-white">
              {error && <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-700 text-sm font-bold rounded flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 pointer-events-none">Requester Name</label>
                    <input required className="gov-input" placeholder="Official Full Name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 pointer-events-none">Email Address</label>
                    <input required type="email" className="gov-input" placeholder="address@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 pointer-events-none">Complaint Subject</label>
                  <input required className="gov-input" placeholder="Brief subject"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 pointer-events-none">Full Description</label>
                  <textarea required rows={6} className="gov-input resize-none"
                    placeholder="Provide as much detail as possible for accurate AI routing..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                <button type="submit" disabled={loading} className="w-full gov-button justify-center py-4 text-base shadow-sm">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Submit Official Grievance</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-secondary py-12 px-6 border-t mt-auto">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-semibold text-xs uppercase tracking-widest text-center">
            <p>© 2024 Arvix Labs — Official Government Intelligence Portal</p>
         </div>
      </footer>

      <ChatBot />
    </div>
  )
}
