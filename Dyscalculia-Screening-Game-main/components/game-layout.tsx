"use client"

import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, ArrowLeft, Volume2 } from "lucide-react"
import { motion } from "framer-motion"

interface GameLayoutProps {
  title: string
  icon: string
  ageGroup: string
  progress: number
  children: React.ReactNode
}

export default function GameLayout({ title, icon, ageGroup, progress, children }: GameLayoutProps) {
  const speakTitle = () => {
    const utterance = new SpeechSynthesisUtterance(title)
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100"
                >
                  <ArrowLeft size={20} />
                  <span className="hidden sm:inline font-medium">Back to Games</span>
                </Button>
              </motion.div>
            </Link>
            <Link href="/">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm" className="text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100">
                  <Home size={20} />
                </Button>
              </motion.div>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 2, duration: 0.5 }}
            >
              {icon}
            </motion.span>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              {title}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:text-indigo-700 p-1"
              onClick={speakTitle}
            >
              <Volume2 size={18} />
            </Button>
          </div>
          <p className="text-center text-indigo-600 mb-4">Age Group: {ageGroup}</p>
          <Progress
            value={progress}
            className="h-3 bg-indigo-100 mt-12"
            indicatorClassName="bg-gradient-to-r from-indigo-500 to-purple-500 "
          />
        </header>

        <main className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-4 border-indigo-100 mt-12">{children}</main>
      </div>
    </div>
  )
}
