"use client"

import { useState, useEffect } from 'react';
import styles from './SpaceMemoryGame.module.css'; // Import your CSS module for styling

import { SpaceBackground } from '@/components/space-background'; // Assuming you have a space background component
type CardType = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const SpaceMemoryGame = () => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timer, setTimer] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Space themed symbols
  const spaceSymbols = [
    '🚀', '🛸', '🪐', '👾', 
    '🛰️', '☄️', '👽', '🌟' 
  ];

  // Generate card data
  const initializeCards = () => {
    // Create pairs and shuffle
    const cardPairs = [...spaceSymbols, ...spaceSymbols];
    const shuffled = cardPairs
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }, index) => ({ id: index, value, isFlipped: false, isMatched: false }));
    
    setCards(shuffled);
    resetGame();
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (gameStarted && !gameFinished) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, gameFinished]);

  // Check for game completion
  useEffect(() => {
    if (matchedIndices.length === cards.length && cards.length > 0) {
      setGameFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [matchedIndices, cards]);

  // Initialize game on first load
  useEffect(() => {
    initializeCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset game state
  const resetGame = () => {
    setFlippedIndices([]);
    setMatchedIndices([]);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    setGameFinished(false);
  };

  // Start a new game
  const startNewGame = () => {
    initializeCards();
  };

  // Handle card flip
  const handleCardClick = (index: number) => {
    // Don't allow flipping if card is already flipped or matched
    if (
      flippedIndices.includes(index) || 
      matchedIndices.includes(index) ||
      flippedIndices.length >= 2
    ) {
      return;
    }

    // Start the game on first flip
    if (!gameStarted) {
      setGameStarted(true);
    }

    // Flip the card
    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    // Check for match if two cards are flipped
    if (newFlippedIndices.length === 2) {
      setMoves(prevMoves => prevMoves + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        // If cards match, add to matched indices
        setMatchedIndices(prevMatched => [...prevMatched, firstIndex, secondIndex]);
        setTimeout(() => setFlippedIndices([]), 500); // quick reset for matched
      } else {
        // If cards don't match, flip them back after a delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.gameContainer}>
      <SpaceBackground />
      {showConfetti && (
        <div className={styles.confetti}>
          {[...Array(50)].map((_, i) => (
            <div key={i} className={styles.confettiPiece} style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 70%)`
            }}></div>
          ))}
        </div>
      )}

      <div className={styles.gameHeader}>
        <div className={styles.gameTitle}>Space Memory</div>
        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <div className={styles.statIcon}>🚀</div>
            <div className={styles.statValue}>{moves}</div>
            <div className={styles.statLabel}>MOVES</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statIcon}>⏱️</div>
            <div className={styles.statValue}>{formatTime(timer)}</div>
            <div className={styles.statLabel}>TIME</div>
          </div>
        </div>
      </div>

      {gameFinished && (
        <div className={styles.successMessage}>
          <div className={styles.successTitle}>Mission Complete!</div>
          <div className={styles.successDetails}>
            You completed the game in {moves} moves and {formatTime(timer)}.
          </div>
        </div>
      )}

      <div className={styles.cardGrid}>
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(index)}
            className={`
              ${styles.card} 
              ${flippedIndices.includes(index) || matchedIndices.includes(index) ? styles.flipped : ''}
              ${matchedIndices.includes(index) ? styles.matched : ''}
            `}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <div className={styles.cardPattern}></div>
              </div>
              <div className={styles.cardBack}>
                <span className={styles.cardSymbol}>{card.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={startNewGame} className={styles.newGameButton}>
        <span className={styles.buttonText}>New Mission</span>
        <span className={styles.buttonIcon}>🚀</span>
      </button>
    </div>
  );
};

export default SpaceMemoryGame;