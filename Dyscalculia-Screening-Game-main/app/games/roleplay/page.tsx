"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import { Input } from "@/components/ui/input"
import useScoreStore from "@/app/store/scoreStore"

export default function MathRoleplayGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const addScore = useScoreStore((state) => state.addScore)

  const scenarios = [
    {
      title: "Shopkeeper Challenge",
      description: "You are a shopkeeper. Distribute 9 notebooks equally among 3 students. How many does each get?",
      correctAnswer: "3",
      image: "🏪📚👧👦👧",
      hint: "Divide the total number of notebooks by the number of students.",
    },
    {
      title: "Birthday Party Planner",
      description:
        "You're planning a party. If each pizza can be cut into 8 slices and you need 24 slices total, how many pizzas should you order?",
      correctAnswer: "3",
      image: "🎂🍕👨‍👩‍👧‍👦",
      hint: "Divide the total slices needed by the number of slices per pizza.",
    },
    {
      title: "School Bus Driver",
      description:
        "You're a bus driver. If 45 children need to be transported and each bus holds 15 children, how many buses are needed?",
      correctAnswer: "3",
      image: "🚌👨‍👩‍👧‍👦🚌",
      hint: "Divide the total number of children by the capacity of each bus.",
    },
    {
      title: "Fruit Seller",
      description:
        "You're selling fruit. If apples cost ₹15 each and a customer gives you ₹100 for 5 apples, how much change should you give?",
      correctAnswer: "25",
      image: "🍎💰👨",
      hint: "Calculate the total cost (5 × ₹15) and subtract from ₹100.",
    },
    {
      title: "Classroom Teacher",
      description:
        "You're a teacher arranging 20 students into 4 equal groups for a project. How many students will be in each group?",
      correctAnswer: "5",
      image: "👩‍🏫👨‍👩‍👧‍👦👨‍👩‍👧‍👦",
      hint: "Divide the total number of students by the number of groups.",
    },
  ]

  const startGame = () => {
    setGameState("playing")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!userAnswer.trim() || isAnswered) return
  
    const correct = userAnswer.trim() === scenarios[currentQuestion].correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)
  
    const newScore = correct ? score + 1 : score
  
    if (correct) {
      setScore(newScore)
      if (currentQuestion === scenarios.length - 1) {
        setShowConfetti(true)
      }
    }
  
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < scenarios.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setUserAnswer("")
        setIsCorrect(null)
        setIsAnswered(false)
      } else {
        setScore(newScore)
        setGameState("result")
  
        // ✅ Log final results
        console.log({
          score: newScore,
          totalQuestions: scenarios.length,
        })
        addScore('roleplay word problems', {
          score: newScore,
          totalQuestions: scenarios.length,
        });
      }
    }, 2000)
  }
  

  const restartGame = () => {
    setCurrentQuestion(0)
    setScore(0)
    setUserAnswer("")
    setIsCorrect(null)
    setGameState("intro")
    setShowConfetti(false)
    setIsAnswered(false)
  }

  return (
    <GameLayout
      title="Math Roleplay Adventure"
      icon="🛍️"
      ageGroup="8-12 years"
      progress={gameState === "playing" ? (currentQuestion / scenarios.length) * 100 : 0}
    >
      {showConfetti && <Confetti />}

      {gameState === "intro" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 p-6 bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-rose-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-rose-600">You'll play different roles in real-life situations!</p>
              <p className="text-xl text-rose-600">Each role has a math problem to solve.</p>
              <p className="text-xl text-rose-600">Type your answer and see if you're correct!</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Start Roleplay! 🎭
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600">
              {scenarios[currentQuestion].title}
            </h2>
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-rose-200 shadow-lg p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center text-6xl mb-4">{scenarios[currentQuestion].image}</div>
            <p className="text-center text-xl font-medium text-rose-700 mb-6">
              {scenarios[currentQuestion].description}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className={`text-xl p-6 rounded-xl border-2 ${
                    isCorrect === null
                      ? "border-rose-300"
                      : isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                  }`}
                  disabled={isAnswered}
                />
                {isCorrect !== null && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-3xl">
                    {isCorrect ? "✅" : "❌"}
                  </div>
                )}
              </div>

              {!isAnswered && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-xl py-6 rounded-xl"
                  >
                    Submit Answer
                  </Button>
                </motion.div>
              )}

              {isAnswered && !isCorrect && (
                <div className="p-4 bg-rose-50 rounded-xl">
                  <p className="text-rose-700">
                    <span className="font-bold">Hint:</span> {scenarios[currentQuestion].hint}
                  </p>
                  <p className="text-rose-700 mt-2">
                    <span className="font-bold">Correct answer:</span> {scenarios[currentQuestion].correctAnswer}
                  </p>
                </div>
              )}
            </form>
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-4">
            Roleplay Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-rose-100 to-pink-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-rose-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-6">
                {score} / {scenarios.length}
              </p>
              {score === scenarios.length && (
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
                  className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
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
  )
}
