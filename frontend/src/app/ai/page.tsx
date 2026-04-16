'use client'

import { motion } from 'framer-motion'
import { Brain, Cpu, Database, Shield, Zap, ArrowRight, MessageSquare, Bot } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

export default function AIPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />

      <main className="pt-32 pb-40 px-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* 3D Background Objects */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-[100px] animate-pulse pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            
            {/* Content Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xl shadow-blue-900/5 text-blue-600 text-xs font-black uppercase tracking-widest mb-10">
                <Brain className="w-4 h-4" /> Arvix Intelligence ALX-2
              </div>
              
              <h1 className="text-6xl md:text-8xl font-display font-black text-[#0A2A66] leading-[0.95] tracking-tighter mb-10">
                Neural <span className="gradient-text">Governance</span> Engine
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-xl mb-14">
                Powered by Gemini 2.0 Flash, Arvix ALX-2 processes citizen grievances with institutional precision, 
                automated context-matching, and real-time policy indexing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16">
                 {[
                   { icon: Cpu, label: 'Low-Latency', desc: 'Real-time classification' },
                   { icon: Database, label: 'Deep RAG', desc: 'Policy-indexed answers' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                         <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="font-bold text-[#0A2A66]">{item.label}</p>
                         <p className="text-sm text-slate-400 font-medium">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex items-center gap-6">
                 <button className="gov-gradient-button px-10 py-5 text-lg" onClick={() => (window as any).toggleChat?.()}>
                    Initialize ALX-2 <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>

            {/* Visual Section - Modern 3D Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative perspective-1000 hidden lg:block"
            >
               <div className="gov-card p-12 bg-white/40 backdrop-blur-2xl border-white/60 shadow-[0_50px_100px_-20px_rgba(10,42,102,0.2)] rounded-[4rem] group hover:rotate-2 transition-all duration-700">
                  <div className="space-y-10">
                     <div className="flex justify-between items-center">
                        <div className="w-16 h-16 rounded-3xl bg-[#0A2A66] flex items-center justify-center shadow-2xl shadow-blue-900/40">
                           <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex gap-2">
                           <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Live</span>
                        </div>
                     </div>
                     
                     <div className="space-y shadow-inner rounded-3xl p-6 bg-slate-50/50">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Bot className="w-4 h-4 text-blue-600" />
                           </div>
                           <p className="text-xs font-bold text-slate-500">ALX-2 Processing...</p>
                        </div>
                        <div className="h-4 bg-blue-200/30 rounded-full w-3/4 mb-3" />
                        <div className="h-4 bg-blue-200/30 rounded-full w-full mb-3" />
                        <div className="h-4 bg-blue-200/30 rounded-full w-1/2" />
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex flex-col justify-between">
                           <Zap className="w-6 h-6 text-blue-100/50" />
                           <p className="text-white font-black text-2xl tracking-tighter">84%<br/><span className="text-[10px] uppercase font-bold text-blue-100/60">Efficiency</span></p>
                        </div>
                        <div className="h-32 rounded-3xl border border-slate-200 p-6 flex flex-col justify-between bg-white shadow-sm">
                           <Database className="w-6 h-6 text-slate-200" />
                           <p className="font-black text-2xl tracking-tighter text-[#0A2A66]">1.2M<br/><span className="text-[10px] uppercase font-bold text-slate-400">Tokens</span></p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  )
}
