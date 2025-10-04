"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import GameLayout from "@/components/game-layout"
import { motion } from "framer-motion"
import Confetti from "@/components/confetti"
import { Volume2 } from "lucide-react"

export default function MultiStepWordProblemGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSteps, setShowSteps] = useState(false)
  

  const questions = [
    {
      problem:
        "Anil had ₹20. He bought 2 chocolates for ₹5 each. Then he bought a pencil for ₹3. How much money is left?",
      options: ["₹10", "₹7", "₹8"],
      correctAnswer: "₹7",
      steps: [
        "Step 1: 2 chocolates at ₹5 each = 2 × ₹5 = ₹10",
        "Step 2: ₹20 - ₹10 = ₹10 (after buying chocolates)",
        "Step 3: ₹10 - ₹3 = ₹7 (after buying pencil)",
      ],
      image: "👦💰🍫✏️",
    },
    {
      problem:
        "Priya has 15 stickers. She gives 3 stickers to each of her 4 friends. How many stickers does she have left?",
      options: ["₹3", "₹12", "₹0"],
      correctAnswer: "₹3",
      steps: [
        "Step 1: 4 friends × 3 stickers = 12 stickers given away",
        "Step 2: 15 stickers - 12 stickers = 3 stickers left",
      ],
      image: "👧🏷️👧👧👧👧",
    },
    {
      problem:
        "Raj has 8 red marbles and 6 blue marbles. He gives 5 marbles to his friend. How many marbles does he have now?",
      options: ["₹14", "₹9", "₹3"],
      correctAnswer: "₹9",
      steps: [
        "Step 1: 8 red marbles + 6 blue marbles = 14 marbles total",
        "Step 2: 14 marbles - 5 marbles = 9 marbles left",
      ],
      image: "👦🔴🔵👦",
    },
    {
      problem: "Meera buys 3 notebooks for ₹10 each and 2 pens for ₹5 each. How much money did she spend in total?",
      options: ["₹30", "₹40", "₹50"],
      correctAnswer: "₹40",
      steps: ["Step 1: 3 notebooks × ₹10 = ₹30", "Step 2: 2 pens × ₹5 = ₹10", "Step 3: ₹30 + ₹10 = ₹40 total"],
      image: "👧📓📓📓🖊️🖊️",
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

    if (correct) {
      setScore(score + 1)
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
        setShowSteps(false)
      } else {
        setGameState("result")
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
    setShowSteps(false)
  }

  const speakQuestion = () => {
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].problem)
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  return (
    <GameLayout
      title="Multi-Step Math Adventure"
      icon="📚"
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
          <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-orange-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-orange-600">You will see a multi-step math problem.</p>
              <p className="text-xl text-orange-600">Think carefully about all the steps needed!</p>
              <p className="text-xl text-orange-600">Then tap the correct answer.</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Solve Problems! 🧩
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
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              Solve the problem
            </h2>
          </div>

          <motion.div
            className="w-full max-w-md mb-8 bg-white rounded-3xl border-4 border-orange-200 shadow-lg p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center text-6xl mb-4">{questions[currentQuestion].image}</div>
            <div className="relative">
              <p className="text-center text-xl font-medium text-orange-700 mb-4">
                {questions[currentQuestion].problem}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="absolute -right-2 -top-2 text-orange-600 hover:text-orange-700 p-2"
                onClick={speakQuestion}
              >
                <Volume2 size={20} />
              </Button>
            </div>

            {selectedAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <Button
                  onClick={() => setShowSteps(!showSteps)}
                  variant="outline"
                  className="w-full text-orange-600 border-orange-300"
                >
                  {showSteps ? "Hide Steps" : "Show Steps"}
                </Button>

                {showSteps && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-orange-50 rounded-xl text-left"
                  >
                    {questions[currentQuestion].steps.map((step, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3 }}
                        className="text-orange-700 mb-2"
                      >
                        {step}
                      </motion.p>
                    ))}
                  </motion.div>
                )}
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
                      : "bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600"
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
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-4">
            Game Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-orange-100 to-amber-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-orange-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600 mb-6">
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
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
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
