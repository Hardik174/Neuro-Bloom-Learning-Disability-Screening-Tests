"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import { Timer } from "@/components/timer"
import useScoreStore from "@/app/store/scoreStore";

export default function PatternCompletionGame() {
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
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const addScore = useScoreStore((state) => state.addScore);

  const questions = [
    {
      pattern: "2, 4, 6, 8, __",
      options: ["9", "10", "12"],
      correctAnswer: "10",
      type: "number",
      explanation: "This is a pattern that increases by 2 each time: 2+2=4, 4+2=6, 6+2=8, 8+2=10",
    },
    {
      pattern: "🍭 🍭 🎂 🍭 🍭 🎂 __",
      options: ["🍭", "🎂", "🍬"],
      correctAnswer: "🍭",
      type: "emoji",
      explanation: "The pattern repeats every 3 items: 🍭 🍭 🎂, 🍭 🍭 🎂, so the next item is 🍭",
    },
    {
      pattern: "🔴 🔵 🔴 🔵 🔴 __",
      options: ["🔴", "🔵", "⚪"],
      correctAnswer: "🔵",
      type: "emoji",
      explanation: "This is an alternating pattern: 🔴 🔵 🔴 🔵 🔴 🔵",
    },
    {
      pattern: "1, 3, 5, 7, __",
      options: ["8", "9", "11"],
      correctAnswer: "9",
      type: "number",
      explanation: "This is a pattern of odd numbers, increasing by 2 each time: 1+2=3, 3+2=5, 5+2=7, 7+2=9",
    },
    {
      pattern: "🐶 🐱 🐶 🐱 🐶 __",
      options: ["🐶", "🐱", "🐭"],
      correctAnswer: "🐱",
      type: "emoji",
      explanation: "This is an alternating pattern of dog and cat: 🐶 🐱 🐶 🐱 🐶 🐱",
    },
    {
      pattern: "1, 4, 9, 16, __",
      options: ["20", "25", "36"],
      correctAnswer: "25",
      type: "number",
      explanation: "These are square numbers: 1² = 1, 2² = 4, 3² = 9, 4² = 16, 5² = 25",
    },
    {
      pattern: "🌑 🌒 🌓 🌔 __",
      options: ["🌕", "🌖", "🌗"],
      correctAnswer: "🌕",
      type: "emoji",
      explanation: "This is the moon phases pattern, going from new moon to full moon",
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

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return // Prevent multiple answers
  
    // Stop timer and calculate time taken
    stopTimer()
    const timeTaken = (Date.now() - questionStartTime) / 1000
    setAnswerTimes((prev) => [...prev, timeTaken])
  
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].correctAnswer
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
        setScore(newScore) // ✅ ensure final score is updated
  
        setGameState("result")
  
        // Save results if in assessment mode
        
          const allTimes = [...answerTimes, timeTaken]
          const averageTime = allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length
  
          // ✅ Just log the result instead of saving to sessionStorage
          console.log({
            gameName: "Pattern Completion Game",
            score: newScore,
            averageTime,
          })

       
          addScore('pattern-completion', {
            score: newScore,
            averageTime,// Only include if exists
            totalQuestions: questions.length,
          });
          
          // Redirect to next game or results page after delay
          setTimeout(() => {
            const userAge = Number.parseInt(sessionStorage.getItem("userAge") || "0")
  
            if (userAge >= 9) {
              router.push("/games/place-value")
            } else {
              router.push("/games/word-problem")
            }
          }, 3000)
        
      }
    }, 3000)
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

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <GameLayout
      title="Pattern Detective"
      icon="🎨"
      ageGroup="8-9 years"
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
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-amber-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-amber-600">You will see a pattern of numbers or objects.</p>
              <p className="text-xl text-amber-600">Figure out what comes next in the pattern!</p>
              <p className="text-xl text-amber-600">Then tap the correct answer.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Find Patterns! 🔍
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600">
              Complete the pattern
            </h2>
          </div>

          <div className="absolute top-24 right-8">
            <Timer seconds={timeElapsed} />
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-yellow-200 shadow-lg p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className={`text-center ${questions[currentQuestion].type === "emoji" ? "text-5xl" : "text-3xl"} font-bold text-amber-700 tracking-wider`}
            >
              {questions[currentQuestion].pattern}
            </p>

            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 bg-amber-50 rounded-xl"
              >
                <p className="text-amber-700">
                  <span className="font-bold">Explanation:</span> {questions[currentQuestion].explanation}
                </p>
              </motion.div>
            )}
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
                      : "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600"
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-amber-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 mb-6">
                {score} / {questions.length}
              </p>
              {score === questions.length && (
                <div className="absolute -top-6 -right-6">
                  <span className="text-5xl animate-bounce-slow">🏆</span>
                </div>
              )}
            </div>

            <div className="mt-4 mb-6">
              <p className="text-xl text-amber-700 mb-2">Average time per question:</p>
              <p className="text-3xl font-bold text-amber-700">
                {(answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length).toFixed(1)} seconds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={restartGame}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Play Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/games/place-value")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Next Game: Place Value 🔢
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
  )
}
