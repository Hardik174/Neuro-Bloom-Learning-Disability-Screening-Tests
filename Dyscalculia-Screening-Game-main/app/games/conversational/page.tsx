"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import GameLayout from "@/components/game-layout"
import { motion, AnimatePresence } from "framer-motion"
import Confetti from "@/components/confetti"
import { Send } from "lucide-react"
import { Timer } from "@/components/timer"
import useScoreStore from "@/app/store/scoreStore"

interface Message {
  text: string
  sender: "ai" | "user"
  isCorrect?: boolean
  difficulty?: "easy" | "medium" | "hard"
}

export default function ConversationalMathGame() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [showConfetti, setShowConfetti] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [currentDifficulty, setCurrentDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [answerTimes, setAnswerTimes] = useState<number[]>([])
  const [timeElapsed, setTimeElapsed] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const addScore = useScoreStore((state) => state.addScore)
  // Store Q&A pairs with time and correctness
  const [qaPairs, setQaPairs] = useState<{ question: string; userAnswer: string; timeTaken: number; isCorrect: boolean }[]>([])

  const scenarios = [
    {
      name: "Sweet Shop",
      avatar: "🧁",
      intro: "Hi! I'm Priya. Welcome to my sweet shop!",
      questions: {
        easy: [
          {
            question: "I have 5 laddoos. If I sell 2, how many will I have left?",
            answer: "3",
            followUp: "That's right! I'll have 3 laddoos left. You're good at this!",
          },
          {
            question: "If one laddoo costs ₹5, how much will 2 laddoos cost?",
            answer: "10",
            followUp: "Correct! 2 laddoos at ₹5 each will cost ₹10.",
          },
        ],
        medium: [
          {
            question: "A laddoo costs ₹5 and a jalebi costs ₹7. How much will 2 laddoos and 1 jalebi cost?",
            answer: "17",
            followUp: "Perfect! 2 laddoos at ₹5 each is ₹10, plus ₹7 for the jalebi makes ₹17.",
          },
          {
            question: "If you give me ₹20 for sweets that cost ₹14, how much change should I give you?",
            answer: "6",
            followUp: "That's right! I should give you ₹6 in change.",
          },
        ],
        hard: [
          {
            question:
              "I sold 15 laddoos yesterday and 23 today. That's a 20% increase from yesterday. Wait, is that correct?",
            answer: "no",
            followUp:
              "You're right, it's not correct! From 15 to 23 is an increase of 8 laddoos, which is about 53% increase, not 20%.",
          },
          {
            question:
              "If I buy ingredients for ₹240 and make 30 laddoos, how much should I charge per laddoo to make a profit of ₹60 in total?",
            answer: "10",
            followUp:
              "Excellent! To make ₹60 profit on 30 laddoos, I need to make ₹2 profit per laddoo. So I need to charge ₹8 for ingredients plus ₹2 profit, which is ₹10 per laddoo.",
          },
        ],
      },
    },
    {
      name: "Fruit Market",
      avatar: "🍎",
      intro: "Hello! I'm Raj. Welcome to my fruit market!",
      questions: {
        easy: [
          {
            question: "I have 8 apples. If I sell 3, how many will I have left?",
            answer: "5",
            followUp: "That's right! I'll have 5 apples left.",
          },
          {
            question: "If one apple costs ₹10, how much will 3 apples cost?",
            answer: "30",
            followUp: "Correct! 3 apples at ₹10 each will cost ₹30.",
          },
        ],
        medium: [
          {
            question: "Apples cost ₹10 each and oranges cost ₹8 each. How much will 2 apples and 3 oranges cost?",
            answer: "44",
            followUp: "Perfect! 2 apples at ₹10 each is ₹20, and 3 oranges at ₹8 each is ₹24. Together that's ₹44.",
          },
          {
            question: "If you give me ₹50 for fruits that cost ₹36, how much change should I give you?",
            answer: "14",
            followUp: "That's right! I should give you ₹14 in change.",
          },
        ],
        hard: [
          {
            question:
              "I have 24 kg of apples. If I sell them in 3 kg bags, and each bag costs ₹45, how much money will I make in total?",
            answer: "360",
            followUp: "Excellent! 24 kg ÷ 3 kg = 8 bags. 8 bags × ₹45 = ₹360.",
          },
          {
            question:
              "If mangoes cost ₹15 each and I give a 20% discount when you buy 5 or more, how much will 6 mangoes cost?",
            answer: "72",
            followUp:
              "Perfect! 6 mangoes at ₹15 each would normally cost ₹90. With a 20% discount, that's ₹90 - ₹18 = ₹72.",
          },
        ],
      },
    },
  ]

  const startGame = () => {
    setGameState("playing")
    const scenario = scenarios[currentScenario]
    setMessages([
      { text: scenario.intro, sender: "ai" },
      { text: "Let me ask you some questions about my shop.", sender: "ai" },
      { text: scenario.questions.medium[0].question, sender: "ai", difficulty: "medium" },
    ])
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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!userInput.trim() || isAnswered) return

    // Stop timer and calculate time taken
    stopTimer()
    const timeTaken = (Date.now() - questionStartTime) / 1000
    setAnswerTimes((prev) => [...prev, timeTaken])

    const scenario = scenarios[currentScenario]
    const currentQuestion = getCurrentQuestion()

    if (!currentQuestion) return

    const isCorrect = userInput.trim().toLowerCase() === currentQuestion.answer.toLowerCase()

    // Add user message
    setMessages((prev) => [...prev, { text: userInput, sender: "user" }])

    // Store Q&A pair with time and correctness
    setQaPairs((prev) => [
      ...prev,
      { question: currentQuestion.question, userAnswer: userInput, timeTaken, isCorrect }
    ])

    // Add AI response after a short delay
    setTimeout(() => {
      if (isCorrect) {
        setMessages((prev) => [
          ...prev,
          {
            text: currentQuestion.followUp,
            sender: "ai",
            isCorrect: true,
          },
        ])
        setScore(score + 1)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: `Actually, the correct answer is ${currentQuestion.answer}. ${currentQuestion.followUp.split("!")[1] || ""}`,
            sender: "ai",
            isCorrect: false,
          },
        ])
      }

      setIsAnswered(true)

      // Determine next difficulty based on answer
      const nextDifficulty = determineNextDifficulty(isCorrect)
      setCurrentDifficulty(nextDifficulty)

      // Check if we've asked enough questions in this scenario
      const questionsAsked = messages.filter((m) => m.difficulty).length

      // Move to next question or scenario after delay
      setTimeout(() => {
        if (questionsAsked >= 3) {
          // Move to next scenario or end game
          if (currentScenario < scenarios.length - 1) {
            setCurrentScenario(currentScenario + 1)
            const nextScenario = scenarios[currentScenario + 1]
            setMessages([
              { text: nextScenario.intro, sender: "ai" },
              { text: "Let me ask you some questions about my shop.", sender: "ai" },
              { text: nextScenario.questions.medium[0].question, sender: "ai", difficulty: "medium" },
            ])
          } else {
            setGameState("result")
            if (score >= 4) {
              setShowConfetti(true)
            }

            // Log Q&A pairs at the end of the test, including time and correctness
            console.log("Questions and user responses:", qaPairs)

            addScore("conversation",
              {
                score: score,
                totalQuestions: 6,
                ...({ averageTime:  answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length })
              } )
          }
        } else {
          // Ask next question in current scenario
          const nextQuestion = getNextQuestion(nextDifficulty)
          if (nextQuestion) {
            setMessages((prev) => [
              ...prev,
              { text: "Let me ask you another question.", sender: "ai" },
              { text: nextQuestion.question, sender: "ai", difficulty: nextDifficulty },
            ])
          }
        }

        setUserInput("")
        setIsAnswered(false)
        setQuestionStartTime(Date.now())
        startTimer()
      }, 2000)
    }, 500)

    setUserInput("")
  }

  const getCurrentQuestion = () => {
    const difficulty = messages[messages.length - 1]?.difficulty || "medium"
    const questionsOfDifficulty = scenarios[currentScenario].questions[difficulty]
    const questionsAskedOfDifficulty = messages.filter((m) => m.difficulty === difficulty).length - 1

    return questionsOfDifficulty[questionsAskedOfDifficulty % questionsOfDifficulty.length]
  }

  const getNextQuestion = (difficulty: "easy" | "medium" | "hard") => {
    const questionsOfDifficulty = scenarios[currentScenario].questions[difficulty]
    const questionsAskedOfDifficulty = messages.filter((m) => m.difficulty === difficulty).length

    return questionsOfDifficulty[questionsAskedOfDifficulty % questionsOfDifficulty.length]
  }

  const determineNextDifficulty = (wasCorrect: boolean): "easy" | "medium" | "hard" => {
    if (currentDifficulty === "medium") {
      return wasCorrect ? "hard" : "easy"
    } else if (currentDifficulty === "easy") {
      return wasCorrect ? "medium" : "easy"
    } else {
      // hard
      return wasCorrect ? "hard" : "medium"
    }
  }

  const restartGame = () => {
    setCurrentScenario(0)
    setScore(0)
    setMessages([])
    setUserInput("")
    setGameState("intro")
    setShowConfetti(false)
    setIsAnswered(false)
    setCurrentDifficulty("medium")
    setAnswerTimes([])
    setQaPairs([]) // Reset Q&A pairs
    stopTimer()
  }

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <GameLayout
      title="Math Chat Adventure"
      icon="💬"
      ageGroup="8-12 years"
      progress={gameState === "playing" ? (currentScenario / scenarios.length) * 100 : 0}
    >
      {showConfetti && <Confetti />}

      {gameState === "intro" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 p-6 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-3xl shadow-inner">
            <h2 className="text-3xl font-bold text-violet-700 mb-4">How to Play</h2>
            <div className="space-y-4">
              <p className="text-xl text-violet-600">You'll chat with friendly characters who need math help!</p>
              <p className="text-xl text-violet-600">Read their questions carefully.</p>
              <p className="text-xl text-violet-600">Type your answer and press send!</p>
              <p className="text-xl text-violet-600">
                If you answer correctly, the questions get harder. If you struggle, they get easier.
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={startGame}
              size="lg"
              className="bg-gradient-to-r from-violet-400 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-600 text-2xl px-10 py-8 h-auto rounded-2xl shadow-lg"
            >
              Start Chatting! 💬
            </Button>
          </motion.div>
        </motion.div>
      )}

      {gameState === "playing" && (
        <motion.div
          className="flex flex-col h-[500px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-24 right-8">
            <Timer seconds={timeElapsed} />
          </div>

          <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-3xl border-4 border-violet-200 shadow-lg p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      {message.sender === "ai" && (
                        <div className="w-12 h-12 rounded-full bg-violet-100 flex items-center justify-center text-2xl mr-2">
                          {scenarios[currentScenario].avatar}
                        </div>
                      )}
                      <div
                        className={`rounded-2xl p-4 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                            : message.isCorrect === true
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                              : message.isCorrect === false
                                ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                                : "bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-700"
                        }`}
                      >
                        <p className="text-lg">{message.text}</p>
                        {message.difficulty && (
                          <div className="mt-1 text-xs opacity-50">
                            {message.difficulty === "easy"
                              ? "Basic question"
                              : message.difficulty === "medium"
                                ? "Standard question"
                                : "Advanced question"}
                          </div>
                        )}
                      </div>
                      {message.sender === "user" && (
                        <div className="w-12 h-12 rounded-full bg-violet-500 flex items-center justify-center text-white text-2xl ml-2">
                          👤
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-1 text-lg py-6 rounded-xl border-violet-300 focus-visible:ring-violet-500"
              disabled={isAnswered}
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 h-full rounded-xl px-6"
                disabled={isAnswered}
              >
                <Send size={24} />
              </Button>
            </motion.div>
          </form>
        </motion.div>
      )}

      {gameState === "result" && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4">
            Chat Complete!
          </h2>
          <div className="mb-8 p-8 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-3xl shadow-lg">
            <p className="text-2xl text-violet-700 mb-4">Your Score:</p>
            <div className="relative">
              <p className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6">
                {score} / 6
              </p>
              {score >= 4 && (
                <div className="absolute -top-6 -right-6">
                  <span className="text-5xl animate-bounce-slow">🏆</span>
                </div>
              )}
            </div>

            <div className="mt-4 mb-6">
              <p className="text-xl text-violet-700 mb-2">Average time per question:</p>
              <p className="text-3xl font-bold text-violet-700">
                {(answerTimes.reduce((sum, time) => sum + time, 0) / answerTimes.length).toFixed(1)} seconds
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={restartGame}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  Chat Again 🔄
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push("/reports")}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl px-8 py-6 h-auto rounded-2xl shadow-md"
                >
                  View Report
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </GameLayout>
  )
}
