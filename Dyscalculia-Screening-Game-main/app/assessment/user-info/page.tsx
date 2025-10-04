"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function UserInfoPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !age.trim()) {
      setError("Please enter both name and age")
      return
    }

    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 13) {
      setError("Please enter a valid age between 6 and 13")
      return
    }

    // Store user info in session storage
    sessionStorage.setItem("userName", name.trim())
    sessionStorage.setItem("userAge", age.trim())
    
    // Initialize empty results array
    sessionStorage.setItem("gameResults", "[]")

    // Route to first game
    router.push("/games/dot-counting")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-100 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
              Welcome to Math Adventure!
            </h1>
            <p className="mt-2 text-lg text-indigo-700">Let's get to know you first</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-indigo-700 mb-2">
                What's your name?
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="text-lg py-6"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-lg font-medium text-indigo-700 mb-2">
                How old are you?
              </label>
              <Input
                id="age"
                type="number"
                min="6"
                max="12"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age (6-12)"
                className="text-lg py-6"
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-xl py-6 rounded-xl"
              >
                Start Assessment! 🚀
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
