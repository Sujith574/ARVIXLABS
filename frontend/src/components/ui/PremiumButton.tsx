'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  icon?: React.ReactNode
}

export default function PremiumButton({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  ...props
}: PremiumButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-4 text-[12px]',
    lg: 'px-12 py-5 text-[14px]',
    xl: 'px-16 py-7 text-[16px]',
  }

  const variants = {
    primary: 'bg-sky-500 text-white shadow-[0_20px_50px_-15px_rgba(14,165,233,0.5)] border-sky-400/50 hover:shadow-[0_25px_60px_-10px_rgba(14,165,233,0.6)]',
    secondary: 'bg-white/5 backdrop-blur-2xl text-white border-white/10 hover:bg-white/10 hover:border-white/20',
    outline: 'bg-transparent border-white/20 text-white hover:border-sky-500/50 hover:text-sky-400',
    ghost: 'bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative group flex items-center justify-center gap-4 font-black uppercase tracking-[0.25em] rounded-2xl border transition-all duration-500 overflow-hidden',
        sizeClasses[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {/* Dynamic Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      
      {/* Micro-interaction highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <span className="relative z-10">{children}</span>
      {icon && <span className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-500">{icon}</span>}
      
      {/* Outer glow aura on hover */}
      {variant === 'primary' && (
        <div className="absolute -inset-4 rounded-3xl opacity-0 group-hover:opacity-100 blur-2xl bg-sky-400/20 transition-opacity duration-700 pointer-events-none" />
      )}
    </motion.button>
  )
}
