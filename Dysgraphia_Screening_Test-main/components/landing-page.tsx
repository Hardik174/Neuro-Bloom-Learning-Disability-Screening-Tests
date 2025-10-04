"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SpaceBackground } from "@/components/space-background"
import { Rocket } from "lucide-react"

export default function LandingPage() {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    const ageNum = Number.parseInt(age)
    if (isNaN(ageNum) || ageNum < 7 || ageNum > 11) {
      setError("Age must be between 7 and 11")
      return
    }

    // Store data in localStorage
    localStorage.setItem("childName", name)
    localStorage.setItem("childAge", age)
    localStorage.setItem("earlyCompletions", "0")

    // Navigate to warm-up
    router.push("/warmup")
  }

  return (
    <>
      <SpaceBackground />
      <Card className="w-[350px] md:w-[450px] bg-white/90 backdrop-blur-sm shadow-xl z-10 border-purple-200">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Rocket className="h-10 w-10 text-purple-500" />
          </div>
          <CardTitle className="text-2xl text-center text-purple-700">Space Writing Adventure</CardTitle>
          <CardDescription className="text-center">
            Let&apos;s start our journey through time and space!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-purple-700">
                  What&apos;s your name?
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-purple-700">
                  How old are you?
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="7"
                  max="11"
                  placeholder="Age (7-11)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="border-purple-200 focus:border-purple-400"
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 hover:scale-105"
          >
            Start Adventure!
          </Button>
        </CardFooter>
      </Card>
    </>
  )
}
