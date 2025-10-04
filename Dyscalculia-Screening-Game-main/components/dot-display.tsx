"use client"

import { useEffect, useRef } from "react"

interface DotDisplayProps {
  count: number
}

export default function DotDisplay({ count }: DotDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set dot properties
    const dotRadius = 20
    const padding = 40
    const availableWidth = canvas.width - padding * 2
    const availableHeight = canvas.height - padding * 2

    // Generate random positions for dots
    const dots = []
    for (let i = 0; i < count; i++) {
      let overlapping = true
      let attempts = 0
      let x, y

      // Try to find a non-overlapping position
      while (overlapping && attempts < 100) {
        x = Math.random() * availableWidth + padding
        y = Math.random() * availableHeight + padding

        overlapping = false
        for (const dot of dots) {
          const dx = dot.x - x
          const dy = dot.y - y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < dotRadius * 2.5) {
            overlapping = true
            break
          }
        }

        attempts++
      }

      if (!overlapping) {
        dots.push({ x, y })
      }
    }

    // Draw dots
    dots.forEach((dot) => {
      ctx.beginPath()
      ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#6d28d9" // Purple color
      ctx.fill()
    })
  }, [count])

  return <canvas ref={canvasRef} width={300} height={300} className="border-0" />
}
