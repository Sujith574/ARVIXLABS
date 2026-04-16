'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, User, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Greeting confirmed. I am the ARVIX Intelligence Node. I can provide policy definitions, technical specifications for the ALX framework, and immediate grievance routing protocols. How can I facilitate your inquiry today?' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection timed out at the administrative node. Please attempt secondary handshake or contact System Founders for urgent protocol support.' }])
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
        onClick={() => setOpen(!open)}
        className="fixed bottom-10 right-10 z-[100] w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_-15px_rgba(59,130,246,0.6)] cursor-pointer overflow-hidden border-4 border-white"
        style={{ background: 'linear-gradient(135deg, #0A2A66, #3B82F6)' }}
        aria-label="Toggle ARVIX Intelligence"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}><X className="w-9 h-9 text-white" /></motion.div>
            : <motion.div key="chat" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} className="relative">
                <Sparkles className="w-9 h-9 text-white" />
                <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-[#0A2A66]" />
              </motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            className="fixed bottom-32 right-6 left-6 md:left-auto md:right-10 z-[100] md:w-[480px] flex flex-col rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] bg-white border border-slate-100"
            style={{ height: '700px', maxWidth: 'calc(100vw - 48px)' }}
          >
            {/* Header */}
            <div className="p-10 bg-[#0A2A66] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
                    <Zap className="w-8 h-8 text-blue-300 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-2xl tracking-tighter leading-none mb-2 text-white">ARVIX AI</h3>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-[9px] font-black uppercase tracking-widest text-blue-200">
                          <Activity className="w-3 h-3" /> Core: ALX-4
                       </span>
                       <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/20 text-[9px] font-black uppercase tracking-widest text-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> Encrypted
                       </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all active:scale-90">
                   <X className="w-7 h-7" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto px-8 py-10 space-y-10 scroll-smooth">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-[#3B82F6]' : 'bg-slate-50 border border-slate-200'}`}>
                    {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-[#0A2A66]" />}
                  </div>
                  <div
                    className={`max-w-[80%] px-7 py-5 rounded-[2rem] text-sm md:text-base font-medium leading-relaxed shadow-xl shadow-slate-200/20 transition-all ${msg.role === 'user' ? 'bg-[#3B82F6] text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'}`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-[#0A2A66]" />
                  </div>
                  <div className="px-7 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-xl shadow-slate-200/20 flex items-center gap-4">
                    <div className="flex gap-1.5">
                       <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-blue-400" />
                       <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-2 h-2 rounded-full bg-blue-400" />
                       <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-2 h-2 rounded-full bg-blue-400" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <div className="p-10 border-t bg-white">
              <div className="flex items-center gap-4 bg-slate-50 rounded-3xl border border-slate-200 p-2.5 focus-within:ring-[12px] focus-within:ring-blue-500/5 focus-within:border-blue-400 focus-within:bg-white transition-all duration-500">
                <input
                  className="flex-1 bg-transparent px-6 py-3.5 text-base font-bold outline-none placeholder:text-slate-400 text-slate-800"
                  placeholder="Inquire the ALX Grid..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 bg-[#0A2A66] shadow-[0_15px_30px_-5px_rgba(10,42,102,0.4)] active:scale-90 hover:shadow-2xl cursor-pointer"
                >
                  <Send className="w-6 h-6 text-white" />
                </button>
              </div>
              <p className="text-center text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mt-8">
                Institutional Security Protocol ALX-24-X
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
