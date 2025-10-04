"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import CandylandBackground from "@/app/CandylandBackground/page"
import useScoreStore from "@/app/store/scoreStore";

export default function ObjectCountingGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [answerTimes, setAnswerTimes] = useState<number[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const addScore = useScoreStore((state) => state.addScore);

  const questions = [
    {
      object: "laddoos",
      count: 6,
      options: [5, 6, 7],
      emojis: Array(6).fill("🍯"),
    },
    {
      object: "apples",
      count: 4,
      options: [3, 4, 5],
      emojis: Array(4).fill("🍎"),
    },
    {
      object: "pencils",
      count: 8,
      options: [7, 8, 9],
      emojis: Array(8).fill("✏️"),
    },
    {
      object: "bananas",
      count: 5,
      options: [4, 5, 6],
      emojis: Array(5).fill("🍌"),
    },
    {
      object: "stars",
      count: 7,
      options: [6, 7, 8],
      emojis: Array(7).fill("⭐"),
    },
  ]

  const startGame = () => {
    setGameState("playing")
    setQuestionStartTime(Date.now())
    startTimer()
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

  const handleAnswer = (answer: number) => {
    if (selectedAnswer !== null) return // Prevent multiple answers

    // Stop timer and calculate time taken
    stopTimer()
    const timeTaken = (Date.now() - questionStartTime) / 1000
    setAnswerTimes((prev) => [...prev, timeTaken])

    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].count
    setIsCorrect(correct)

    const newScore = correct ? score + 1 : score
    if (correct) {
      setScore(newScore)
      if (currentQuestion === questions.length - 1) {
        setShowConfetti(true)
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setQuestionStartTime(Date.now())
        startTimer()
      } else {
        setScore(newScore) // ensure final score is updated

        setGameState("result")

        // Save results
        const allTimes = [...answerTimes, timeTaken]
        const averageTime = allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length

        // Log result
        console.log({
          gameName: "Object Counting Game",
          score: newScore,
          averageTime,
        })

        addScore('object-counting', {
          score: newScore,
          averageTime,
          totalQuestions: questions.length,
        })
      }
    }, 1500)
  }

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setGameState("intro")
    setShowConfetti(false)
    setAnswerTimes([])
    stopTimer()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <CandylandBackground>
    <GameLayout
      title="Object Counting Fun"
      icon="🧸"
      ageGroup="6-7 years"
      progress={gameState === "playing" ? (currentQuestion / questions.length) * 100 : 0}
    >
      {showConfetti && <Confetti />}

      {gameState === "intro" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 p-6 bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-pink-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-pink-600">You will see some fun objects in a picture.</p>
              <p className="text-xl text-pink-600">Count how many there are!</p>
              <p className="text-xl text-pink-600">Then tap the correct number.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Let's Count! 🧮
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
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">
              How many {questions[currentQuestion].object} do you see?
            </h2>
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-pink-200 shadow-lg p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-4 gap-4 p-4">
              {questions[currentQuestion].emojis.map((emoji, index) => (
                <motion.div
                  key={index}
                  className="flex items-center justify-center text-4xl sm:text-5xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, rotate: [0, 10, -10, 0] }}
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            {questions[currentQuestion].options.map((option) => (
              <motion.div key={option} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handleAnswer(option)}
                  disabled={selectedAnswer !== null}
                  className={`text-3xl h-24 w-full rounded-2xl shadow-md ${
                    selectedAnswer === option
                      ? isCorrect
                        ? "bg-gradient-to-r from-green-400 to-emerald-500"
                        : "bg-gradient-to-r from-red-400 to-pink-500"
                      : "bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500"
                  }`}
                >
                  {option}
                </Button>
              </motion.div>
            ))}
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-pink-100 to-orange-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-pink-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500 mb-6">
                {score} / {questions.length}
              </p>
              {score === questions.length && (
                <div className="absolute -top-6 -right-6">
                  <span className="text-5xl animate-bounce-slow">🏆</span>
                </div>
              )}
            </div>
            <div className="mt-4 mb-6">
              <p className="text-xl text-pink-700 mb-2">Average time per question:</p>
              <p className="text-3xl font-bold text-pink-700">
                {(answerTimes.length > 0
                  ? (answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length)
                  : 0
                ).toFixed(1)} seconds
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={restartGame}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Play Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  More Games 🎮
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
    </CandylandBackground>
  )
}
