'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2, ShieldCheck, Sparkles, Zap, Activity, Cpu } from 'lucide-react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const API = process.env.NEXT_PUBLIC_API_URL || 'https://arvix-backend-666036188871.asia-south1.run.app'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Neural link established. I am Arvix AI, your advanced intelligence node. I am ready to facilitate policy parsing, technical triage, and administrative routing. How can I assist you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await axios.post(`${API}/api/v1/ai/chat`, { message: userMsg, session_id: sessionId })
      setSessionId(res.data.session_id)
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response || res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Dispatch failure in sector-7. Handshake timed out. Please verify protocol integrity or re-initialize link.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(!open)
        }}
        className="fixed bottom-10 right-10 z-[100] w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_60px_rgba(14,165,233,0.4)] cursor-pointer overflow-hidden border border-white/20"
        style={{ background: 'linear-gradient(135deg, #020617, #0f172a)' }}
        aria-label="Toggle ARVIX Intelligence"
      >
        <div className="absolute inset-0 bg-sky-500/10 opacity-10 animate-pulse" />
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}><X className="w-8 h-8 text-white" /></motion.div>
            : <motion.div key="chat" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} className="relative">
                <Sparkles className="w-8 h-8 text-sky-400 fill-sky-400/20" />
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-400 rounded-full border-2 border-slate-950" />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.95, x: 20 }}
            className="fixed bottom-32 right-6 left-6 md:left-auto md:right-10 z-[100] md:w-[480px] flex flex-col rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-slate-950/80 backdrop-blur-3xl"
            style={{ 
              height: 'auto', 
              maxHeight: 'calc(100vh - 160px)',
              maxWidth: 'calc(100vw - 48px)' 
            }}
          >
            {/* Header */}
            <div className="p-8 bg-gradient-to-b from-white/5 to-transparent border-b border-white/5 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-500/10 border border-sky-400/20 shadow-[0_0_20px_rgba(14,165,233,0.2)]">
                    <Bot className="w-7 h-7 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl tracking-tighter leading-none mb-2 text-white uppercase mt-1">Intelligence Core</h3>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-[7px] font-black uppercase tracking-widest text-sky-400">
                          <Activity className="w-2.5 h-2.5" /> ALX-NODE.ONLINE
                       </span>
                       <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-[7px] font-black uppercase tracking-widest text-emerald-400">
                          <ShieldCheck className="w-2.5 h-2.5" /> SECURE HANDSHAKE
                       </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all active:scale-95 text-white/20 hover:text-white border border-transparent hover:border-white/10"
                >
                   <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 scroll-smooth scrollbar-hide" style={{ height: '500px' }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border transition-all duration-500 ${
                    msg.role === 'user' 
                      ? 'bg-sky-500/20 border-sky-400/30 text-sky-400' 
                      : 'bg-white/5 border-white/10 text-white/30'
                  }`}>
                    {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>
                  <div
                    className={`max-w-[85%] px-8 py-5 rounded-[2rem] text-[13px] font-medium leading-relaxed transition-all duration-500 ${
                      msg.role === 'user' 
                        ? 'bg-sky-500/10 text-white border border-sky-400/20 rounded-tr-none' 
                        : 'bg-white/5 text-slate-300 border border-white/5 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sky-400/50">
                    <Cpu className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div className="px-8 py-5 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-4">
                    <div className="flex gap-2">
                       <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-sky-400" />
                       <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 rounded-full bg-sky-400" />
                       <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 rounded-full bg-sky-400" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <div className="p-10 bg-gradient-to-t from-white/5 to-transparent border-t border-white/5">
              <div className="flex items-center gap-4 bg-slate-900/50 rounded-2xl border border-white/10 p-2.5 focus-within:border-sky-500/40 transition-all duration-500 shadow-inner">
                <input
                  className="flex-1 bg-transparent px-6 py-4 text-[13px] font-bold outline-none placeholder:text-white/10 text-white"
                  placeholder="Transmit encrypted query..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-all disabled:opacity-10 bg-sky-500 text-slate-950 shadow-[0_10px_30px_-5px_rgba(14,165,233,0.5)] active:scale-90 hover:scale-105 hover:shadow-sky-500/40 cursor-pointer"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-8 px-2">
                <p className="text-[7px] font-black uppercase text-white/10 tracking-[0.5em]">
                  ALX-PROTOCOL V2.4 // ENCRYPTED
                </p>
                <div className="flex gap-1.5">
                   <div className="w-1 h-1 rounded-full bg-sky-500/20" />
                   <div className="w-1 h-1 rounded-full bg-sky-500/20" />
                   <div className="w-1 h-1 rounded-full bg-sky-500/20" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
