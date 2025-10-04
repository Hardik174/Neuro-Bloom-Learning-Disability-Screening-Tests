"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import useScoreStore from "@/app/store/scoreStore"

export default function NumberComparisonGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const addScore = useScoreStore((state) => state.addScore);
  const timeData = undefined;

  const questions = [
    {
      leftLabel: "🍎 Apples",
      leftCount: 7,
      rightLabel: "🍌 Bananas",
      rightCount: 4,
      correctAnswer: "left",
    },
    {
      leftLabel: "🍦 Ice Creams",
      leftCount: 3,
      rightLabel: "🍭 Lollipops",
      rightCount: 6,
      correctAnswer: "right",
    },
    {
      leftLabel: "🎈 Balloons",
      leftCount: 8,
      rightLabel: "🎁 Gifts",
      rightCount: 8,
      correctAnswer: "equal",
    },
    {
      leftLabel: "🐶 Dogs",
      leftCount: 5,
      rightLabel: "🐱 Cats",
      rightCount: 3,
      correctAnswer: "left",
    },
    {
      leftLabel: "⚽ Footballs",
      leftCount: 2,
      rightLabel: "🏀 Basketballs",
      rightCount: 4,
      correctAnswer: "right",
    },
  ]

  const startGame = () => {
    setGameState("playing")
  }

  const handleAnswer = (side: "left" | "right" | "equal") => {
    if (selectedSide !== null) return // Prevent multiple answers
  
    setSelectedSide(side)
    const correct = side === questions[currentQuestion].correctAnswer
    setIsCorrect(correct)
  
    const newScore = correct ? score + 1 : score
  
    if (correct) {
      setScore(newScore)
      if (currentQuestion === questions.length - 1) {
        setShowConfetti(true)
      }
    }
  
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedSide(null)
        setIsCorrect(null)
      } else {
        setGameState("result")
        addScore("number-comparison", // ✅ fixed score used here

        {
          score: newScore,
          totalQuestions: questions.length,
          ...(timeData !== undefined && { averageTime: timeData }) // Only include if exists
        } )

        console.log(newScore)
        console.log(addScore)
      }
    }, 1200)
  }
  

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedSide(null)
    setIsCorrect(null)
    setGameState("intro")
    setShowConfetti(false)
  }

  const renderObjects = (emoji: string, count: number) => {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <motion.span
              key={index}
              className="text-3xl sm:text-4xl"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 260, damping: 20 }}
            >
              {emoji}
            </motion.span>
          ))}
      </div>
    )
  }

  return (
    <GameLayout
      title="Which is More?"
      icon="🔢"
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
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-blue-600">You will see two groups of objects.</p>
              <p className="text-xl text-blue-600">Compare them and tap the side that has more!</p>
              <p className="text-xl text-blue-600">If they're equal, tap the "Equal" button.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-blue-400 to-teal-400 hover:from-blue-500 hover:to-teal-500 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Let's Compare! 🔍
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
              Which is more?
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6 w-full mb-8">
            <motion.div
              className={`flex-1 p-6 bg-white rounded-3xl border-4 ${
                selectedSide === "left" ? (isCorrect ? "border-green-400" : "border-red-400") : "border-blue-200"
              } shadow-lg transition-colors duration-300`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAnswer("left")}
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                {questions[currentQuestion].leftLabel}
              </h3>
              {renderObjects(questions[currentQuestion].leftLabel.split(" ")[0], questions[currentQuestion].leftCount)}
            </motion.div>

            <motion.div
              className={`flex-1 p-6 bg-white rounded-3xl border-4 ${
                selectedSide === "right" ? (isCorrect ? "border-green-400" : "border-red-400") : "border-blue-200"
              } shadow-lg transition-colors duration-300`}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAnswer("right")}
            >
              <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
                {questions[currentQuestion].rightLabel}
              </h3>
              {renderObjects(
                questions[currentQuestion].rightLabel.split(" ")[0],
                questions[currentQuestion].rightCount,
              )}
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full max-w-md">
            <Button
              onClick={() => handleAnswer("equal")}
              disabled={selectedSide !== null}
              className={`text-2xl h-16 w-full rounded-2xl shadow-md ${
                selectedSide === "equal"
                  ? isCorrect
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-red-400 to-pink-500"
                  : "bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-500 hover:to-indigo-500"
              }`}
            >
              They are Equal! 🤝
            </Button>
          </motion.div>
        </motion.div>
      )}

      {gameState === "result" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-blue-100 to-teal-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-blue-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-6">
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
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Play Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/games/symbol-confusion")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Next Game: Symbol Confusion 🔤
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
  )
}
