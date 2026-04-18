'use client'

import { motion } from 'framer-motion'
import { Brain, Cpu, Database, Shield, Zap, ArrowRight, MessageSquare, Bot, ShieldCheck, Activity } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import dynamic from 'next/dynamic'

const ChatBot = dynamic(() => import('@/components/ui/ChatBot'), { ssr: false })

export default function AIPage() {
  return (
    <div className="min-h-screen arvix-gradient-bg selection:bg-arvix-accent selection:text-slate-950">
      <div className="noise" />
      <Navbar />

      <main className="pt-32 pb-48 px-6 overflow-hidden relative">
        <div className="aurora opacity-30" />
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            
            {/* Content Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full arvix-glass border-white/20 text-arvix-accent text-xs font-black uppercase tracking-[0.4em] mb-10 animate-pulse-cyan">
                <Brain className="w-4 h-4 fill-current" /> Neural Node ALX-2
              </div>
              
              <h1 className="text-7xl md:text-9xl font-display font-black leading-[0.9] tracking-tighter mb-10 arvix-text-gradient">
                Sovereign <br/>
                <span className="arvix-accent-gradient">Intelligence</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl mb-14">
                Powered by Arvix AI, Arvix ALX-2 manages administrative logistics with zero-latency heuristic triage and real-time policy indexing.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                 {[
                   { icon: Cpu, label: 'Low-Latency', desc: 'Real-time Triage' },
                   { icon: Database, label: 'Global SCM', desc: 'Immutable Integrity' },
                 ].map((item, i) => (
                   <div key={i} className="arvix-card !p-6 border-white/5 flex gap-5 items-center arvix-glass-hover">
                      <div className="w-12 h-12 rounded-xl bg-arvix-accent/10 border border-arvix-accent/20 flex items-center justify-center text-arvix-accent flex-shrink-0">
                         <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                         <p className="font-bold text-white tracking-tight">{item.label}</p>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="flex items-center gap-6">
                 <button className="arvix-button-primary px-12 py-6 text-base tracking-widest" onClick={() => (window as any).toggleChat?.()}>
                    INITIALIZE NEURAL LINK <ArrowRight className="w-5 h-5" />
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
               <div className="arvix-card p-12 border-white/10 shadow-[0_50px_150px_rgba(56,189,248,0.2)] rounded-[4rem] group hover:rotate-2 transition-all duration-700 relative overflow-hidden">
                  <div className="absolute inset-0 grid-overlay opacity-40" />
                  <div className="relative z-10 space-y-12">
                     <div className="flex justify-between items-center">
                        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-arvix-accent to-arvix-secondary flex items-center justify-center shadow-2xl shadow-arvix-accent/40 scale-110">
                           <ShieldCheck className="w-8 h-8 text-slate-950" />
                        </div>
                        <div className="flex flex-col items-end">
                           <div className="flex items-center gap-2 mb-1">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Node Active</span>
                           </div>
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Mumbai-Sector-4</span>
                        </div>
                     </div>
                     
                     <div className="space-y-6 arvix-glass rounded-3xl p-8 border-white/5 relative group">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                              <Bot className="w-5 h-5 text-arvix-accent" />
                           </div>
                           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">ALX-2 Core Processing</p>
                        </div>
                        <div className="space-y-3">
                           <motion.div initial={{ width: "30%" }} animate={{ width: "90%" }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }} className="h-2 bg-arvix-accent/30 rounded-full" />
                           <motion.div initial={{ width: "20%" }} animate={{ width: "70%" }} transition={{ duration: 1.5, delay: 0.2, repeat: Infinity, repeatType: "reverse" }} className="h-2 bg-arvix-secondary/30 rounded-full" />
                           <motion.div initial={{ width: "40%" }} animate={{ width: "85%" }} transition={{ duration: 2.5, delay: 0.4, repeat: Infinity, repeatType: "reverse" }} className="h-2 bg-arvix-violet/30 rounded-full" />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-6">
                        <div className="arvix-card !p-8 border-white/5 bg-gradient-to-br from-arvix-accent/20 to-transparent flex flex-col justify-between h-40">
                           <Zap className="w-6 h-6 text-arvix-accent" />
                           <p className="text-white font-black text-4xl tracking-tighter">99.4%<br/><span className="text-[9px] uppercase font-black tracking-widest text-arvix-accent/60">Efficiency</span></p>
                        </div>
                        <div className="arvix-card !p-8 border-white/5 bg-white/5 flex flex-col justify-between h-40">
                           <Activity className="w-6 h-6 text-white/20" />
                           <p className="font-black text-4xl tracking-tighter text-white">0.02ms<br/><span className="text-[9px] uppercase font-black tracking-widest text-white/20">Latency</span></p>
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
