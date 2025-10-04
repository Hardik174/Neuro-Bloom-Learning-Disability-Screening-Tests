"use client"

import { useEffect, useRef, ReactNode } from "react"
import { motion } from "framer-motion"

export default function CandylandBackground({ children }: { children?: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Chocolate river animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 200

    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw chocolate river
      ctx.fillStyle = "#5D4037"
      ctx.beginPath()
      ctx.moveTo(0, 0)

      for (let i = 0; i < canvas.width; i++) {
        const y = 20 * Math.sin(i * 0.02 + time) + 100
        ctx.lineTo(i, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()
      ctx.fill()

      // Add chocolate bubbles
      for (let i = 0; i < 12; i++) {
        const x = (time * 50 + i * 200) % canvas.width
        const y = 20 * Math.sin(x * 0.02 + time) + 80
        const radius = 5 + Math.sin(time + i) * 3

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = "#8D6E63"
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = 200
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Sugar sparkles */}
        {Array.from({ length: 100 }).map((_, i) => {
          // Random sizes for more variety
          const size = 0.5 + Math.random() * 2;
          
          // Colors for sparkles (whites, golds, silvers)
          const colors = [
            'bg-white', 'bg-yellow-200', 'bg-yellow-100', 
            'bg-blue-50', 'bg-pink-50', 'bg-purple-100'
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <motion.div
              key={`sparkle-${i}`}
              className={`absolute rounded-full ${color}`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                zIndex: 5,
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.7)'
              }}
              animate={{
                opacity: [0, 0.8, 1, 0.8, 0],
                scale: [0, 1.5, 2, 1.5, 0],
              }}
              transition={{
                duration: 1.5 + Math.random() * 3.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 7,
                ease: "easeInOut"
              }}
            />
          );
        })}

        {/* Floating candy elements */}
        <motion.div
          className="absolute text-6xl"
          style={{ left: "10%", top: "20%" ,  zIndex: 10 }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍬
        </motion.div>

        <motion.div
          className="absolute text-7xl"
          style={{ left: "30%", top: "12%" , zIndex: 10}}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍭
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ left: "8%", top: "10%" }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍬
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ right: "15%", top: "20%",  zIndex: 10 }}
          animate={{
            y: [0, -25, 0],
            x: [0, 15, 0],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍫
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ right: "40%", top: "75%" }}
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            rotate: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          🍭
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ left: "15%", top: "75%" }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍡
        </motion.div>

        <motion.div
          className="absolute text-7xl"
          style={{ left: "50%", top: "12%" }}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍬
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ left: "85%", top: "35%" }}
          animate={{ rotate: [0, 15, 0, -15, 0] }}
          transition={{ duration: 4.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍩
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ left: "5%", top: "45%" }}
          animate={{ scale: [1, 1.1, 1], y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🍪
        </motion.div>

        <motion.div
          className="absolute text-7xl"
          style={{ left: "80%", top: "70%" }}
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          🧁
        </motion.div>

        <motion.div
          className="absolute text-6xl"
          style={{ right: "5%", top: "55%" }}
          animate={{ rotate: [0, 60], y: [0, -5, 0] }}
          transition={{
            rotate: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            y: { duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          }}
        >
          🍦
        </motion.div>

        {/* Chocolate river */}
        <div className="absolute bottom-0 w-full">
          <canvas ref={canvasRef} className="w-full h-[200px]" />
        </div>

        {/* Enhanced Cotton Candy Clouds */}
        <motion.div
          className="absolute top-[5%] left-[5%] w-64 h-40 rounded-full bg-gradient-to-r from-pink-300 to-pink-200 opacity-90 blur-md"
          animate={{
            scale: [1, 1.05, 1],
            x: [0, 10, 0],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[8%] left-[8%] w-48 h-32 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-90 blur-md"
          animate={{
            scale: [1, 1.08, 1],
            x: [0, -5, 0],
          }}
          transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute top-[15%] right-[15%] w-72 h-44 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-90 blur-md"
          animate={{
            scale: [1, 1.03, 1],
            x: [0, -15, 0],
          }}
          transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[12%] right-[10%] w-56 h-36 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 opacity-70 blur-md"
          animate={{
            scale: [1, 1.06, 1],
            x: [0, 8, 0],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[30%] left-[25%] w-80 h-48 rounded-full bg-gradient-to-r from-pink-200 to-blue-200 opacity-60 blur-md"
          animate={{
            scale: [1, 1.04, 1],
            y: [0, 10, 0],
          }}
          transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
        />
      </div>
      {/* Foreground Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
