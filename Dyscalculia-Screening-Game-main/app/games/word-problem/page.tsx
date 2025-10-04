"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import { Volume2 } from "lucide-react"
import useScoreStore from "@/app/store/scoreStore"

export default function WordProblemGame() {
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
      problem: "Ravi has ₹10. He buys a pen for ₹6. How much money is left?",
      options: ["₹4", "₹6", "₹2"],
      correctAnswer: "₹4",
      image: "👦💰✏️",
    },
    {
      problem: "Meera has 8 candies. She gives 3 candies to her friend. How many candies does she have now?",
      options: ["3", "5", "8"],
      correctAnswer: "5",
      image: "👧🍬👧",
    },
    {
      problem: "There are 7 birds on a tree. 2 more birds join them. How many birds are there now?",
      options: ["7", "2", "9"],
      correctAnswer: "9",
      image: "🌳🐦🐦",
    },
    {
      problem: "Raj has 4 red balloons and 3 blue balloons. How many balloons does he have in total?",
      options: ["4", "7", "3"],
      correctAnswer: "7",
      image: "👦🎈🎈",
    },
    {
      problem: "There are 10 children in a class. 6 are boys. How many are girls?",
      options: ["4", "6", "10"],
      correctAnswer: "4",
      image: "👨‍👩‍👧‍👦👨‍👩‍👧‍👦",
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
        setScore(newScore) // Ensure the final score is set
        setGameState("result")
  
        // ✅ Log final result
        console.log({
          score: newScore,
          totalQuestions: questions.length,
        })

        addScore('word-problem', {
          score: newScore,
          totalQuestions: questions.length,
        });
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

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].problem)
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  return (
    <GameLayout
      title="Math Story Time"
      icon="💰"
      ageGroup="8-10 years"
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
          <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-emerald-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-emerald-600">You will see a math story problem.</p>
              <p className="text-xl text-emerald-600">Read it carefully and solve the problem!</p>
              <p className="text-xl text-emerald-600">Then tap the correct answer.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Solve Problems! 🧮
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Solve the problem
            </h2>
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-green-200 shadow-lg p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center text-6xl mb-4">{questions[currentQuestion].image}</div>
            <div className="relative">
              <p className="text-center text-xl font-medium text-emerald-700 mb-2">
                {questions[currentQuestion].problem}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -right-2 -top-2 text-emerald-600 hover:text-emerald-700 p-2"
                onClick={speakQuestion}
              >
                <Volume2 size={20} />
              </Button>
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
                      : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-emerald-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6">
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
                  className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
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
