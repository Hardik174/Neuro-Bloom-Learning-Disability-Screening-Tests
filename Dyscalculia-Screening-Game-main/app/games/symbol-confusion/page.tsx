"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import useScoreStore from "@/app/store/scoreStore"

export default function SymbolConfusionGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
 const addScore = useScoreStore((state) => state.addScore);

  const questions = [
    {
      symbol: "×",
      options: ["Add", "Multiply", "Subtract"],
      correctAnswer: "Multiply",
    },
    {
      symbol: "+",
      options: ["Add", "Divide", "Subtract"],
      correctAnswer: "Add",
    },
    {
      symbol: "−",
      options: ["Add", "Multiply", "Subtract"],
      correctAnswer: "Subtract",
    },
    {
      symbol: "÷",
      options: ["Multiply", "Divide", "Subtract"],
      correctAnswer: "Divide",
    },
    {
      symbol: "=",
      options: ["Equal to", "Less than", "Greater than"],
      correctAnswer: "Equal to",
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
        setScore(newScore) // ✅ ensure score is set correctly even if last question is wrong
        setGameState("result")
        addScore("symbol-confusion",
          {score:newScore, totalQuestions: questions.length} ) // ✅ fixed score used here
        console.log("Score added to store:", newScore)
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

  return (
      <GameLayout
        title="Symbol Detective"
        icon="🔠"
        ageGroup="10-12 years"
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
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl shadow-inner">
              <h2 className="text-3xl font-bold text-purple-700 mb-4">How to Play</h2>
              <div className="space-y-4">
                <p className="text-xl text-purple-600">You will see a math symbol.</p>
                <p className="text-xl text-purple-600">Choose what the symbol means!</p>
                <p className="text-xl text-purple-600">Tap the correct answer.</p>
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={startGame}
                size="lg"
                className="bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
              >
                Find Symbols! 🔍
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
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                What does this symbol mean?
              </h2>
            </div>

            <motion.div
              className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-purple-200 shadow-lg p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-center text-8xl font-bold text-purple-700 mb-2">{questions[currentQuestion].symbol}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              {questions[currentQuestion].options.map((option) => (
                <motion.div key={option} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`text-2xl h-16 w-full rounded-2xl shadow-md ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-gradient-to-r from-green-400 to-emerald-500"
                          : "bg-gradient-to-r from-red-400 to-pink-500"
                        : "bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600"
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
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
              Game Complete!
            </h2>
            <div className="mb-8 p-8 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-3xl shadow-lg">
              <p className="text-2xl text-purple-700 mb-4">Your Score:</p>
              <div className="relative">
                <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
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
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                  >
                    Play Again 🔄
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => router.push("/games/pattern-completion")}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                  >
                    Next Game: Pattern Recognition 🎮
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </GameLayout>
  )
}
