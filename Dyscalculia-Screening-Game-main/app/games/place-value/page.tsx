"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import useScoreStore from "@/app/store/scoreStore"

export default function PlaceValueGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const addScore = useScoreStore((state) => state.addScore)

  const questions = [
    {
      number: "347",
      digit: "4",
      options: ["4", "40", "400"],
      correctAnswer: "40",
      position: "middle",
    },
    {
      number: "582",
      digit: "5",
      options: ["5", "50", "500"],
      correctAnswer: "500",
      position: "first",
    },
    {
      number: "916",
      digit: "6",
      options: ["6", "60", "600"],
      correctAnswer: "6",
      position: "last",
    },
    {
      number: "2,743",
      digit: "7",
      options: ["7", "70", "700"],
      correctAnswer: "700",
      position: "middle",
    },
    {
      number: "8,025",
      digit: "2",
      options: ["2", "20", "200"],
      correctAnswer: "20",
      position: "middle",
    },
  ]

  const startGame = () => {
    setGameState("playing")
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return // Prevent multiple answers
  
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
      } else {
        setScore(newScore) // Ensure final score is set in state
        setGameState("result")
  
        // ✅ Log final result
        console.log({
          score: newScore,
          totalQuestions: questions.length
        })
        addScore("Place Value", {
          score: newScore,
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
  }

  const renderNumber = (number: string, highlightDigit: string, position: string) => {
    const digits = number.split("")

    return (
      <div className="flex justify-center items-center space-x-1">
        {digits.map((digit, index) => {
          if (digit === ",") {
            return (
              <span key={`comma-${index}`} className="text-6xl">
                ,
              </span>
            )
          }

          const isHighlighted =
            digit === highlightDigit &&
            ((position === "first" && index === 0) ||
              (position === "middle" && index > 0 && index < digits.length - 1) ||
              (position === "last" && index === digits.length - 1))

          return (
            <motion.span
              key={index}
              className={`text-6xl font-bold ${
                isHighlighted ? "text-pink-600 bg-pink-100 px-2 rounded-lg" : "text-blue-700"
              }`}
              animate={isHighlighted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 1.5, duration: 0.5 }}
            >
              {digit}
            </motion.span>
          )
        })}
      </div>
    )
  }

  return (
    <GameLayout
      title="Place Value Puzzle"
      icon="🧠"
      ageGroup="9-11 years"
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
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-blue-600">You will see a number with one digit highlighted.</p>
              <p className="text-xl text-blue-600">Figure out the place value of that digit!</p>
              <p className="text-xl text-blue-600">Then tap the correct answer.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Find Values! 🔢
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
              What is the value of {questions[currentQuestion].digit} in this number?
            </h2>
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-blue-200 shadow-lg p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {renderNumber(
              questions[currentQuestion].number,
              questions[currentQuestion].digit,
              questions[currentQuestion].position,
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
                      : "bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600"
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-blue-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">
                {score} / {questions.length}
              </p>
              {score === questions.length && (
                <div className="absolute -top-6 -right-6">
                  <span className="text-5xl animate-bounce-slow">🏆</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={restartGame}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Play Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/games/clock-reading")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Next Game: Clock Reading 🕒
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
  )
}
