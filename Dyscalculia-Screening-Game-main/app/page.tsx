"use client"

import Link from "next/link"
import { useState, useEffect, createContext, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

// --- Age Context Setup ---
type AgeContextType = {
  age: string
  setAge: (age: string) => void
}
const AgeContext = createContext<AgeContextType | undefined>(undefined)
export const useAge = () => {
  const ctx = useContext(AgeContext)
  if (!ctx) throw new Error("useAge must be used within AgeProvider")
  return ctx
}
const AgeProvider = ({ children }: { children: React.ReactNode }) => {
  const [age, setAge] = useState<string>("")
  useEffect(() => {
    // Optionally persist age in localStorage
    const stored = typeof window !== "undefined" ? localStorage.getItem("user-age") : null
    if (stored) setAge(stored)
  }, [])
  useEffect(() => {
    if (age) localStorage.setItem("user-age", age)
  }, [age])
  return <AgeContext.Provider value={{ age, setAge }}>{children}</AgeContext.Provider>
}
// --- End Age Context ---

function AgeModal() {
  const { age, setAge } = useAge()
  const [input, setInput] = useState(age)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input || isNaN(Number(input)) || Number(input) < 5 || Number(input) > 18) {
      setError("Please enter a valid age between 5 and 18.")
      return
    }
    setAge(input)
  }

  if (age) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center min-w-[320px]"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Welcome!</h2>
        <label htmlFor="age-modal-input" className="mb-2 text-lg font-medium text-indigo-700">
          Please enter your age to continue:
        </label>
        <input
          id="age-modal-input"
          type="number"
          min={5}
          max={18}
          value={input}
          onChange={e => { setInput(e.target.value); setError(null) }}
          className="border border-indigo-300 rounded-lg px-4 py-2 text-lg w-40 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
          placeholder="Enter age"
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-500 w-full rounded-xl text-lg font-medium py-2">
          Continue
        </Button>
      </form>
    </div>
  )
}

// --- Game Significance Info ---
const GAME_SIGNIFICANCE: Record<string, string> = {
  "dot-counting":
    "Dot Counting Game helps assess subitizing ability, which is the skill to instantly recognize the number of objects without counting. Difficulty here may indicate issues with number sense, a core symptom of dyscalculia.",
  "number-comparison":
    "Number Comparison Game evaluates the ability to judge greater vs smaller quantities, a foundational math skill. Struggles in this area can signal difficulties with magnitude processing, common in dyscalculia.",
  "pattern-completion":
    "Pattern Completion Game tests logical reasoning and memory through sequences. Challenges here may reflect problems with recognizing numerical patterns, often seen in dyscalculia.",
  "symbol-confusion":
    "Symbol Confusion Game checks for confusion between mathematical symbols (like +, -, ×, ÷). Symbol confusion is a frequent symptom in children with dyscalculia.",
  "place-value":
    "Place Value Puzzle assesses understanding of number structure and place value, which is crucial for arithmetic. Dyscalculia often involves confusion with place value concepts.",
  "word-problem":
    "Basic Word Problem Game tests the ability to apply math to real-life situations. Difficulty with word problems can indicate issues with mathematical reasoning, a key aspect of dyscalculia.",
  "conversational":
    "Conversational Math Game simulates real-life math via dialogue, assessing flexible thinking and application of math in context. Dyscalculia can manifest as trouble with such practical math tasks.",
  "clock-reading":
    "Clock Reading Game evaluates the ability to read analog clocks and calculate time, which involves spatial and numerical skills. Difficulties here are common in dyscalculia.",
}
// --- End Game Significance Info ---

// --- Info Modal Component ---
import { XCircle, Info } from "lucide-react"

function GameInfoModal({
  open,
  onClose,
  title,
  significance,
}: {
  open: boolean
  onClose: () => void
  title: string
  significance: string
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 text-indigo-500 hover:text-pink-500 transition"
          onClick={onClose}
          aria-label="Close"
        >
          <XCircle size={28} />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Info className="text-pink-500 animate-pulse drop-shadow-lg" size={32} />
          <h3 className="text-2xl font-bold text-indigo-700">{title}</h3>
        </div>
        <div className="text-indigo-800 text-lg mt-2">{significance}</div>
      </div>
    </div>
  )
}
// --- End Info Modal Component ---

function HomeContent() {
  const { age, setAge } = useAge()
  const [infoOpen, setInfoOpen] = useState<string | null>(null)
  const games = [
    {
      id: "dot-counting",
      title: "Dot Counting Game",
      description: "Recognize quantities without counting",
      ageGroup: "6-7 years",
      icon: "🎮",
      emoji: "🎈",
    },
   
    {
      id: "number-comparison",
      title: "Number Comparison Game",
      description: "Judge greater vs smaller quantities",
      ageGroup: "8-9 years",
      icon: "🔢",
      emoji: "🍎",
    },
    {
      id: "pattern-completion",
      title: "Pattern Completion Game",
      description: "Detect logical/memory issues via sequences",
      ageGroup: "8-9 years",
      icon: "🎨",
      emoji: "🎁",
    },
   
    {
      id: "symbol-confusion",
      title: "Symbol Confusion Game",
      description: "Test symbol recognition",
      ageGroup: "10-12 years",
      icon: "🔠",
      emoji: "➕",
    },
    {
      id: "place-value",
      title: "Place Value Puzzle",
      description: "Evaluate understanding of number structure",
      ageGroup: "9-11 years",
      icon: "🧠",
      emoji: "🔢",
    },
    {
      id: "word-problem",
      title: "Basic Word Problem Game",
      description: "Apply math to real-life situations",
      ageGroup: "8-10 years",
      icon: "💰",
    emoji: "🍦",
  },
    {
      id: "conversational",
      title: "Conversational Math Game",
      description: "Simulate real-life math via dialogue",
      ageGroup: "8-12 years",
      icon: "💬",
      emoji: "🤖",
    },
    {
      id: "clock-reading",
      title: "Clock Reading Game",
      description: "Read analog clocks and calculate time",
      ageGroup: "9-12 years",
      icon: "🕹️",
      emoji: "🕒",
    },
  ]

  return (
    <div className="container mx-auto px-4">
      {/* Remove duplicate age input prompt here */}
      <div className="mb-10 text-center">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2 pt-12">
            Math Adventure
          </h1>
          <Sparkles className="absolute -top-4 -right-8 text-yellow-400 animate-pulse" size={24} />
          <Sparkles className="absolute -top-2 -left-8 text-yellow-400 animate-pulse" size={20} />
        </div>
        <p className="text-2xl text-indigo-700 font-medium">Engaging games designed to test your number sense!</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/assessment">
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-lg px-6 py-3 rounded-xl">
              Start Age-Based Assessment 📋
            </Button>
          </Link>
          <Link href="/reports">
            <Button
              variant="outline"
              className="border-indigo-500 text-indigo-700 hover:bg-indigo-100 text-lg px-6 py-3 rounded-xl"
            >
              View Reports 📊
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {games.map((game) => (
          <div key={game.id} className="relative">
            {/* Shiny Info Button - right side */}
            <button
              className="absolute top-1/2 -translate-y-1/2 right-3 z-20 bg-gradient-to-br from-yellow-300 via-pink-400 to-purple-500 rounded-full p-2 shadow-lg border-2 border-white hover:scale-110 transition-all animate-pulse"
              onClick={e => {
                e.stopPropagation()
                setInfoOpen(game.id)
              }}
              aria-label={`Show significance of ${game.title}`}
              type="button"
            >
              <Info className="text-white drop-shadow" size={22} />
            </button>
            <Link href={`/games/${game.id}`} className="transform transition-all hover:scale-105 block">
              <Card className="border-4 border-indigo-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:border-indigo-300 h-full">
                <div className="absolute -right-6 -top-6 bg-gradient-to-br from-pink-400 to-purple-500 w-20 h-20 rounded-full flex items-end justify-start p-2">
                  <span className="text-4xl px-2 py-3">{game.emoji}</span>
                </div>
                <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 pt-8 pb-4">
                  <div className="flex items-center">
                    <span className="text-3xl mr-2">{game.icon}</span>
                    <CardTitle className="text-xl font-bold text-indigo-800">{game.title}</CardTitle>
                  </div>
                  <CardDescription className="text-indigo-600 font-medium">Age: {game.ageGroup}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 pb-2">
                  <p className="text-indigo-700">{game.description}</p>
                </CardContent>
                <CardFooter className="pb-4">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-xl text-lg font-medium py-6">
                    Play Now!
                  </Button>
                </CardFooter>
              </Card>
            </Link>
            {/* Info Modal */}
            <GameInfoModal
              open={infoOpen === game.id}
              onClose={() => setInfoOpen(null)}
              title={game.title}
              significance={GAME_SIGNIFICANCE[game.id]}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AgeProvider>
      <AgeModal />
      <HomeContent />
    </AgeProvider>
  )
}
