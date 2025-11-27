'use client'

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const defaultMessages = [
  "Memuat data...",
  "Mohon tunggu sebentar...",
  "Sedang memproses..."
]

interface GlobalLoaderProps {
  messages?: string[]
}

export default function GlobalLoader({ messages = defaultMessages }: GlobalLoaderProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    setMessageIndex(0)
    
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [messages])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050810]/90 backdrop-blur-2xl overflow-hidden"
    >
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="relative w-32 h-32 mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-blue-500/30 border-t-blue-400 border-r-transparent shadow-[0_0_30px_rgba(59,130,246,0.2)]"
        />
        
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border border-dashed border-purple-500/30 border-b-purple-400"
        />

        <div className="absolute inset-0 perspective-[1000px]">
          <motion.div
            animate={{ rotateX: 360, rotateY: 180 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border-[2px] border-cyan-400/40 border-l-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]"
            style={{ transformStyle: "preserve-3d" }}
          />
          <motion.div
            animate={{ rotateX: 180, rotateY: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-6 rounded-full border-[2px] border-blue-500/40 border-r-blue-400"
            style={{ transformStyle: "preserve-3d" }}
          />
        </div>

        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_white,0_0_40px_blue]" />
        </motion.div>
      </div>

      <div className="h-8 relative flex flex-col items-center w-full px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-blue-200 font-mono text-sm tracking-widest font-medium text-center"
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}