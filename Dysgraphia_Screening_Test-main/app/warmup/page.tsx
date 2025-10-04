"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { Volume2, ArrowRight } from "lucide-react"

export default function WarmupPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const router = useRouter()
  const [childName, setChildName] = useState("")

  useEffect(() => {
    // Get child's name from localStorage
    const name = localStorage.getItem("childName")
    if (!name) {
      router.push("/")
      return
    }
    setChildName(name)
  }, [router])

  const warmupPrompts = [
    "Write your name and draw a star next to it.",
    "Write the numbers 1 to 5 and circle your favorite number.",
    "Write a short sentence: 'I am in space!'",
  ]

  const handleNext = () => {
    if (currentPrompt < warmupPrompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
    } else {
      // Move to main game
      router.push("/game")
    }
  }

  const speakText = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(warmupPrompts[currentPrompt])
      utterance.rate = 0.9 // Slightly slower for children
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <SpaceBackground />
      <Card className="w-[350px] md:w-[550px] bg-white/90 backdrop-blur-sm shadow-xl z-10 border-purple-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-purple-700">Warm-up Exercises</CardTitle>
          <CardDescription className="text-center">
            {childName}, let&apos;s practice a bit before our big adventure!
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-purple-100 p-6 rounded-xl mb-4 min-h-[150px] flex items-center justify-center">
            <p className="text-lg text-center text-purple-800 font-medium">{warmupPrompts[currentPrompt]}</p>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={speakText}
              variant="outline"
              className="rounded-full h-12 w-12 p-0 border-purple-300 hover:bg-purple-100"
            >
              <Volume2 className="h-6 w-6 text-purple-700" />
              <span className="sr-only">Read aloud</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Prompt {currentPrompt + 1} of {warmupPrompts.length}
          </div>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            {currentPrompt < warmupPrompts.length - 1 ? (
              <>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Start Game <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
