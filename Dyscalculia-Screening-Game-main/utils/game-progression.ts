export const gameOrder = [
  "dot-counting",
  "number-comparison",
  "pattern-completion",
  "symbol-confusion", 
  "clock-reading",
  "place-value",
  "word-problem",
  "conversational",
  "multi-step"
] as const

export const getNextGame = (currentGame: string) => {
  const userAge = Number(sessionStorage.getItem("userAge") || "0")
  const availableGames = gameOrder.filter(game => {
    if (game === "word-problem") return userAge >= 8
    if (game === "conversational" || game === "multi-step") return userAge >= 10
    return true
  })

  const currentIndex = availableGames.indexOf(currentGame as typeof gameOrder[number])
  if (currentIndex === -1 || currentIndex === availableGames.length - 1) {
    return "/reports"
  }
  
  return `/games/${availableGames[currentIndex + 1]}`
}
