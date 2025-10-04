"use client"

import { motion } from "framer-motion"

interface TimerProps {
  seconds: number
}

export function Timer({ seconds }: TimerProps) {
  // Format seconds to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const secs = time % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      className="bg-white px-3 py-2 rounded-lg shadow-md border-2 border-indigo-200 flex items-center gap-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-indigo-600 text-lg">⏱️</span>
      <span className="text-indigo-700 font-mono font-bold text-lg">{formatTime(seconds)}</span>
    </motion.div>
  )
}
