"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { Volume2, ArrowRight, Clock } from "lucide-react"
import Image from "next/image"

export default function GamePage() {
  const [currentEra, setCurrentEra] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [timerActive, setTimerActive] = useState(true)
  const [childName, setChildName] = useState("")
  const [childAge, setChildAge] = useState(7)
  const [earlyCompletions, setEarlyCompletions] = useState(0)
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Get child's info from localStorage
    const name = localStorage.getItem("childName")
    const age = localStorage.getItem("childAge")
    const completions = localStorage.getItem("earlyCompletions")

    if (!name || !age) {
      router.push("/")
      return
    }

    setChildName(name)
    setChildAge(Number.parseInt(age))
    setEarlyCompletions(completions ? Number.parseInt(completions) : 0)

    // Start timer
    startTimer()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [router])

  const startTimer = () => {
    setTimeLeft(60)
    setTimerActive(true)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout)
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleNext = () => {
    // Check if completed early
    if (timerActive && timeLeft > 0) {
      setEarlyCompletions((prev) => prev + 1)
      localStorage.setItem("earlyCompletions", (earlyCompletions + 1).toString())
    }

    if (currentEra < eras.length - 1) {
      setCurrentEra(currentEra + 1)
      startTimer()
    } else {
      // Game completed, go to results
      router.push("/results")
    }
  }

  const speakText = () => {
    if ("speechSynthesis" in window) {
      const text = getPromptForAge(childAge, currentEra)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9 // Slightly slower for children
      window.speechSynthesis.speak(utterance)
    }
  }

  const eras = [
    {
      name: "Ancient Egypt",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Medieval Castle",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Wild West",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Modern City",
      image: "/placeholder.svg?height=150&width=150",
    },
    {
      name: "Future World",
      image: "/placeholder.svg?height=150&width=150",
    },
  ]

  const getPromptForAge = (age: number, era: number) => {
    // Simpler prompts for younger children, more complex for older ones
    const prompts = {
      younger: [
        "The pyramids are big and tall. People made them long ago. The sun was hot in Egypt. Pharaohs wore special clothes and crowns. They had many treasures in their tombs.",
        "Knights lived in castles. They had swords and shields. Kings and queens ruled the land. The castles had tall towers and strong walls. People had feasts with lots of food.",
        "Cowboys rode horses in the desert. They wore big hats. They herded cattle across the plains. Sometimes they slept under the stars at night. They cooked beans and meat over campfires.",
        "Cars and buses drive on roads. Buildings are very tall. People use phones to talk to each other. There are parks where children can play. Stores sell food, clothes, and toys.",
        "Robots help people. Spaceships fly to other planets. People might live in space stations. Computers will be even smarter in the future. Cars might fly instead of driving on roads.",
      ],
      older: [
        "Ancient Egyptians built massive pyramids as tombs for their pharaohs. They used simple tools but created amazing structures. The Nile River flooded every year, bringing rich soil for farming. Hieroglyphics were used to write down important events and stories. Priests were important people who helped the pharaohs rule.",
        "Medieval knights protected their castles and villages. They trained from childhood to fight with swords and ride horses. Peasants worked the land and paid taxes to their lords. Stone castles had moats and drawbridges for protection. Kings held tournaments where knights could show their skills.",
        "In the Wild West, cowboys herded cattle across wide open plains. They faced many challenges like harsh weather. Small towns had sheriffs who kept the peace. Native Americans lived on the land before settlers arrived. The railroad brought more people and changed the frontier forever.",
        "Modern cities have tall skyscrapers and busy streets. People use technology to communicate and travel quickly. Subways and buses help people get around without cars. Parks provide green spaces where people can relax and play. Schools teach children about science, math, and history.",
        "In the future, humans might live on other planets. Advanced robots and computers will help with daily tasks. Clean energy from the sun and wind will power our homes and vehicles. Virtual reality will let people visit places without leaving their homes. Scientists will find cures for many diseases.",
      ],
    }

    return age <= 9 ? prompts.younger[era] : prompts.older[era]
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <SpaceBackground />
      <Card className="w-[350px] md:w-[600px] bg-white/90 backdrop-blur-sm shadow-xl z-10 border-purple-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-purple-700">{eras[currentEra].name}</CardTitle>
            <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
              <Clock className="h-4 w-4 text-purple-700 mr-1" />
              <span className="text-purple-700 font-medium">{timeLeft}s</span>
            </div>
          </div>
          <CardDescription>Write down this paragraph, {childName}!</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative w-[150px] h-[150px] rounded-lg overflow-hidden shrink-0">
              <Image
                src={eras[currentEra].image || "/placeholder.svg"}
                alt={eras[currentEra].name}
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-purple-100 p-4 rounded-xl flex-1">
              <p className="text-purple-800 font-medium">{getPromptForAge(childAge, currentEra)}</p>
            </div>
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
            Era {currentEra + 1} of {eras.length}
          </div>
          <Button
            onClick={handleNext}
            disabled={timerActive && timeLeft > 0 ? false : false} // Always enabled for testing
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            {currentEra < eras.length - 1 ? (
              <>
                Next Era <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Finish Game <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
