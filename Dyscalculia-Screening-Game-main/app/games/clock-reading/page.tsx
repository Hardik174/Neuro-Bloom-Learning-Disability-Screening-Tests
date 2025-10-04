"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import { Timer } from "@/components/timer"
import useScoreStore from "@/app/store/scoreStore"

export default function ClockReadingGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [answerTimes, setAnswerTimes] = useState<number[]>([])
  const [isBonusQuestion, setIsBonusQuestion] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const addScore = useScoreStore((state) => state.addScore)

  const questions = [
    {
      hours: 3,
      minutes: 0,
      options: ["3:00", "3:15", "12:15"],
      correctAnswer: "3:00",
      bonusQuestion: "What time will it be 30 minutes later?",
      bonusOptions: ["3:15", "3:30", "4:00"],
      bonusAnswer: "3:30",
    },
    {
      hours: 6,
      minutes: 30,
      options: ["6:30", "6:15", "12:30"],
      correctAnswer: "6:30",
      bonusQuestion: "What time was it 45 minutes ago?",
      bonusOptions: ["5:30", "5:45", "6:15"],
      bonusAnswer: "5:45",
    },
    {
      hours: 9,
      minutes: 15,
      options: ["9:15", "3:15", "9:45"],
      correctAnswer: "9:15",
      bonusQuestion: "What time will it be 2 hours later?",
      bonusOptions: ["11:15", "10:15", "9:45"],
      bonusAnswer: "11:15",
    },
    {
      hours: 12,
      minutes: 45,
      options: ["12:45", "9:45", "3:45"],
      correctAnswer: "12:45",
      bonusQuestion: "What time was it 1 hour and 15 minutes ago?",
      bonusOptions: ["11:30", "11:45", "10:45"],
      bonusAnswer: "11:30",
    },
    {
      hours: 7,
      minutes: 20,
      options: ["7:20", "7:04", "8:20"],
      correctAnswer: "7:20",
      bonusQuestion: "What time will it be 50 minutes later?",
      bonusOptions: ["8:00", "8:10", "7:50"],
      bonusAnswer: "8:10",
    },
  ]

  const startGame = () => {
    setGameState("playing")
    setQuestionStartTime(Date.now())
    startTimer()
    drawClock()
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeElapsed(0)

    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const drawClock = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const question = isBonusQuestion
      ? null // We don't show a clock for bonus questions
      : questions[currentQuestion]

    if (!question) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set clock properties
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 10

    // Draw clock face
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
    ctx.lineWidth = 3
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Draw clock center
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = "#333"
    ctx.fill()

    // Draw hour marks
    for (let i = 1; i <= 12; i++) {
      const angle = (i * Math.PI) / 6 - Math.PI / 2
      const x1 = centerX + (radius - 15) * Math.cos(angle)
      const y1 = centerY + (radius - 15) * Math.sin(angle)

      ctx.font = "bold 20px Arial"
      ctx.fillStyle = "#333"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(i.toString(), x1, y1)
    }

    // Draw hour hand
    const hourAngle = ((question.hours % 12) * Math.PI) / 6 + (question.minutes * Math.PI) / (6 * 60) - Math.PI / 2
    const hourHandLength = radius * 0.5
    const hourX = centerX + hourHandLength * Math.cos(hourAngle)
    const hourY = centerY + hourHandLength * Math.sin(hourAngle)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(hourX, hourY)
    ctx.lineWidth = 6
    ctx.strokeStyle = "#333"
    ctx.stroke()

    // Draw minute hand
    const minuteAngle = (question.minutes * Math.PI) / 30 - Math.PI / 2
    const minuteHandLength = radius * 0.8
    const minuteX = centerX + minuteHandLength * Math.cos(minuteAngle)
    const minuteY = centerY + minuteHandLength * Math.sin(minuteAngle)

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(minuteX, minuteY)
    ctx.lineWidth = 3
    ctx.strokeStyle = "#555"
    ctx.stroke()
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return // Prevent multiple answers
  
    // Stop timer and calculate time taken
    stopTimer()
    const timeTaken = (Date.now() - questionStartTime) / 1000
    setAnswerTimes((prev) => [...prev, timeTaken])
  
    setSelectedAnswer(answer)
  
    const currentQ = isBonusQuestion ? questions[currentQuestion].bonusAnswer : questions[currentQuestion].correctAnswer
  
    const correct = answer === currentQ
    setIsCorrect(correct)
  
    if (correct) {
      setScore(score + 1)
      if (!isBonusQuestion && currentQuestion === questions.length - 1) {
        setShowConfetti(true)
      }
    }
  
    // Move to next question or bonus question after delay
    setTimeout(() => {
      if (isBonusQuestion) {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1)
          setIsBonusQuestion(false)
        } else {
          setGameState("result")
          console.log("Final Score:", score + (correct ? 1 : 0)) // ✅ log the final score
          console.log("Answer Times (seconds):", [...answerTimes, timeTaken]) // ✅ log times
         
          addScore("clock-reading", {
            score: score + (correct ? 1 : 0),
            totalQuestions: questions.length * 2,
            //averageTime: (answerTimes.reduce((sum, time) => sum + time, 0) + timeTaken) / (answerTimes.length + 1),
          })
        }
      } else {
        // Show bonus question for this clock
        setIsBonusQuestion(true)
      }
  
      setSelectedAnswer(null)
      setIsCorrect(null)
      setQuestionStartTime(Date.now())
      startTimer()
    }, 2000)
  }
  

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setGameState("intro")
    setShowConfetti(false)
    setIsBonusQuestion(false)
    setAnswerTimes([])
    stopTimer()
  }

  // Draw clock when question changes
  useEffect(() => {
    if (gameState === "playing" && !isBonusQuestion) {
      drawClock()
    }
  }, [currentQuestion, isBonusQuestion, gameState])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <GameLayout
      title="Clock Reading Game"
      icon="🕹️"
      ageGroup="9-12 years"
      progress={
        gameState === "playing" ? ((currentQuestion + (isBonusQuestion ? 0.5 : 0)) / questions.length) * 100 : 0
      }
    >
      {showConfetti && <Confetti />}

      {gameState === "intro" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 p-6 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-cyan-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-cyan-600">You will see an analog clock showing a time.</p>
              <p className="text-xl text-cyan-600">Choose the correct time shown on the clock!</p>
              <p className="text-xl text-cyan-600">Then answer a bonus question about calculating time.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Tell Time! 🕒
            </Button>
          </motion.div>
        </motion.div>
      )}

      {gameState === "playing" && (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-24 right-8">
            <Timer seconds={timeElapsed} />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
              {isBonusQuestion ? questions[currentQuestion].bonusQuestion : "What time is shown on the clock?"}
            </h2>
          </div>

          {!isBonusQuestion && (
            <motion.div
              className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-cyan-200 shadow-lg p-6 flex justify-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <canvas ref={canvasRef} width={300} height={300} className="border-0" />
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {(isBonusQuestion ? questions[currentQuestion].bonusOptions : questions[currentQuestion].options).map(
              (option) => (
                <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`text-3xl h-24 w-full rounded-2xl shadow-md ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-red-400 to-pink-500"
                        : "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                    }`}
                  >
                    {option}
                  </Button>
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      )}

      {gameState === "result" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-cyan-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600 mb-6">
                {score} / {questions.length * 2}
              </p>
              {score >= questions.length && (
                <div className="absolute -top-6 -right-6">
                  <span className="text-5xl animate-bounce-slow">🏆</span>
                </div>
              )}
            </div>

            <div className="mt-4 mb-6">
              <p className="text-xl text-cyan-700 mb-2">Average time per question:</p>
              <p className="text-3xl font-bold text-cyan-700">
                {(answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length).toFixed(1)} seconds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={restartGame}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Play Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/games/conversational")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Next Game: Conversational Math 💬
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
  )
}
