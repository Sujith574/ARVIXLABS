'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  Lock,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import Topbar from '@/components/layout/Topbar'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const statusColors: Record<string, string> = {
  submitted:    '#3b82f6',
  under_review: '#f59e0b',
  in_progress:  '#a78bfa',
  resolved:     '#10b981',
  closed:       '#64748b',
}

const statusStyles: Record<string, string> = {
  submitted:    'badge-submitted',
  under_review: 'badge-in-progress',
  in_progress:  'badge-in-progress',
  resolved:     'badge-resolved',
  closed:       'badge-resolved',
}

export default function GrievanceDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'super_admin')
    fetchData()
  }, [id])

  const fetchData = async () => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    try {
      const res = await axios.get(`${API}/api/v1/grievances/track/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
      })
      setData(res.data)
      setRemarks(res.data.remarks || '')
    } catch (err) {
      setError('Failed to resolve record node.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdating(true)
    const token = localStorage.getItem('admin_token') || localStorage.getItem('token')
    try {
      await axios.patch(`${API}/api/v1/grievances/admin/${data.id}/status`, 
        { status: newStatus, remarks: remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      await fetchData()
      alert('Arvix Resolution Protocol updated successfully.')
    } catch (err) {
      alert('Node update sequence failed.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#00040d]">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
        <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Secure Registry</p>
      </div>
    </div>
  )

  if (error || !data) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#00040d]">
       <AlertCircle className="w-20 h-20 text-red-500 mb-8 opacity-20" />
       <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tighter">Record Not Located</h2>
       <p className="text-slate-500 mb-10 max-w-md font-medium leading-relaxed">{error || 'The requested grievance ID does not exist in the current production cluster.'}</p>
       <button onClick={() => router.back()} className="btn-glow text-white px-10">Return to Registry</button>
    </div>
  )

  return (
    <div className="min-h-screen pb-24 bg-[#00040d]">
      <Topbar 
        title="Intelligence Docket" 
        subtitle={`ID: ${data.ticket_id} • Registered ${new Date(data.created_at).toLocaleDateString()}`} 
      />

      <div className="px-8 py-8 max-w-6xl mx-auto space-y-8">
        
        {/* Header Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <button onClick={() => router.back()} className="flex items-center gap-3 text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Registry
           </button>

           {isAdmin && (
           <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/5">
              {['submitted', 'in_progress', 'resolved'].map(s => (
                <button
                  key={s}
                  disabled={updating}
                  onClick={() => handleStatusUpdate(s)}
                  className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                    data.status === s 
                      ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 shadow-inner border border-blue-400/50' 
                      : 'text-slate-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {updating && data.status !== s ? <Loader2 className="w-3 h-3 animate-spin inline mr-2" /> : null}
                  {s.replace('_', ' ')}
                </button>
              ))}
           </div>
           )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Main Content */}
           <div className="lg:col-span-2 space-y-8">
              <div className="glass-card p-12 space-y-12 bg-white/[0.02] border-white/5">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] bg-blue-500/10 text-blue-400 border border-blue-500/20">Operational Directive</span>
                        <div className="h-px bg-white/5 flex-1" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">{data.title}</h1>
                    <div className="flex flex-wrap gap-3 pt-2">
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${statusStyles[data.status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                          {data.status.replace('_', ' ')}
                       </span>
                       <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-slate-400">
                          Priority: {data.priority}
                       </span>
                    </div>
                 </div>

                 <div className="space-y-6 pt-6 border-t border-white/5">
                    <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-3">
                       <FileText className="w-4 h-4 text-blue-600" /> Evidence Statement
                    </h3>
                    <div className="text-slate-200 leading-[1.8] font-medium text-base whitespace-pre-wrap bg-black/40 p-8 rounded-3xl border border-white/10 shadow-inner">
                       {data.description}
                    </div>
                 </div>

                 {data.ai_summary && (
                   <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32" />
                      <div className="flex items-center gap-3 mb-6">
                         <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-400" />
                         </div>
                         <p className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em]">Arvix Neural Logic</p>
                      </div>
                      <p className="text-white text-2xl font-black leading-tight mb-4 tracking-tight">{data.ai_category}</p>
                      <p className="text-blue-100/70 text-base font-medium leading-relaxed italic border-l-2 border-blue-500/50 pl-6">"{data.ai_summary}"</p>
                   </div>
                 )}

                 {isAdmin ? (
                 <div className="space-y-6 pt-12 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                          <MessageSquare className="w-4 h-4 text-blue-600" /> Resolution Directives
                       </h3>
                       <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded">End-User Visibility: Enabled</span>
                    </div>
                    <textarea
                       className="input-glass !h-48 !p-8 text-base font-semibold leading-relaxed bg-black/40 border-white/10 focus:border-blue-500/50"
                       placeholder="Enter formal resolution text or operational progress updates…"
                       value={remarks}
                       onChange={e => setRemarks(e.target.value)}
                    />
                    <div className="flex justify-end pt-4">
                       <button 
                         onClick={() => handleStatusUpdate(data.status)}
                         disabled={updating}
                         className="btn-glow text-white px-12 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-blue-600/30"
                       >
                          {updating ? <><Loader2 className="w-4 h-4 animate-spin mr-3" /> Syncing Node...</> : 'Persist Handshake'}
                       </button>
                    </div>
                 </div>
                 ) : (
                   data.remarks && (
                    <div className="space-y-6 pt-12 border-t border-white/5">
                      <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Official Resolution
                       </h3>
                       <div className="text-slate-200 leading-[1.8] font-medium text-base whitespace-pre-wrap bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10 shadow-inner">
                          {data.remarks}
                       </div>
                    </div>
                   )
                 )}
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <div className="glass-card p-10 space-y-10 bg-white/[0.02] border-white/5">
                 <div>
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Metadata Integrity</h3>
                    <div className="h-px bg-white/5 w-full" />
                 </div>
                 
                 <div className="space-y-8">
                    <div className="flex items-start gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 text-blue-500">
                          <User className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Subject Handle</p>
                          <p className="text-base font-black text-white tracking-tight">System Entity</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 text-blue-500">
                          <Mail className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Registry Email</p>
                          <p className="text-sm font-bold text-white font-mono">{data.submitter_email || '—'}</p>
                       </div>
                    </div>

                    <div className="flex items-start gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center flex-shrink-0 text-blue-500">
                          <Clock className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Resolution Clock</p>
                          <p className="text-base font-black text-emerald-500 tabular-nums">
                             {new Date(data.sla_deadline).toLocaleDateString()}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Audit Node Secured</span>
                 </div>
              </div>

              <button className="w-full btn-glow justify-center py-5 text-white font-black uppercase tracking-[0.2em] text-xs shadow-blue-600/30 group">
                 Dispatch Direct Notification <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
           </div>
        </div>
      </div>
    </div>
  )
}
