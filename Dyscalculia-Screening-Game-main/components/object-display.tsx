"use client"

import { motion } from "framer-motion"

interface ObjectDisplayProps {
  objects: Array<{
    type: string
    color: string
  }>
}

export default function ObjectDisplay({ objects }: ObjectDisplayProps) {
  // Create a grid layout for the objects
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 p-4 w-full h-full">
      {objects.map((object, index) => (
        <motion.div
          key={index}
          className="text-5xl"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: index * 0.1,
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, 10, -10, 0],
            transition: { duration: 0.5 },
          }}
        >
          {object.type}
        </motion.div>
      ))}
    </div>
  )
}
