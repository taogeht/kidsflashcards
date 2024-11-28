'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Shuffle } from 'lucide-react'
import { getTrackByName } from '@/config/tracks'
import type { FlashCard } from '@/config/tracks'

interface MemoryGameProps {
  trackName: string;
}

type GameCard = {
  id: number;
  cardId: number;
  card: FlashCard;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame({ trackName }: MemoryGameProps) {
  const [cards, setCards] = useState<GameCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matches, setMatches] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const track = getTrackByName(trackName)

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  const initializeGame = () => {
    if (!track) return

    const cardPairs: GameCard[] = []
    
    // Create pairs of cards
    track.cards.forEach(card => {
      // First card of pair
      cardPairs.push({
        id: card.id * 2 - 1,
        cardId: card.id,
        card: card,
        isFlipped: false,
        isMatched: false
      })
      // Second card of pair
      cardPairs.push({
        id: card.id * 2,
        cardId: card.id,
        card: card,
        isFlipped: false,
        isMatched: false
      })
    })

    setCards(shuffleArray(cardPairs))
    setFlippedCards([])
    setMatches(0)
    setIsChecking(false)
  }

  useEffect(() => {
    initializeGame()
  }, [trackName])

  const handleCardClick = (clickedId: number) => {
    if (
      isChecking || 
      flippedCards.includes(clickedId) || 
      cards.find(c => c.id === clickedId)?.isMatched
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, clickedId]
    setFlippedCards(newFlippedCards)

    // If we've flipped two cards, check for a match
    if (newFlippedCards.length === 2) {
      setIsChecking(true)

      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(c => c.id === firstId)
      const secondCard = cards.find(c => c.id === secondId)

      // Check if cards have the same cardId (are a matching pair)
      const isMatch = firstCard && secondCard && firstCard.cardId === secondCard.cardId

      setTimeout(() => {
        if (isMatch) {
          setCards(cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          ))
          setMatches(m => m + 1)
        }
        setFlippedCards([])
        setIsChecking(false)
      }, 1000)
    }
  }

  if (!track) return null

  const totalPairs = track.numFlashcards
  const isGameComplete = matches === totalPairs

  // Calculate grid columns based on number of cards
  const getGridCols = () => {
    const totalCards = totalPairs * 2
    if (totalCards <= 12) return 'grid-cols-3 md:grid-cols-4'
    if (totalCards <= 16) return 'grid-cols-4 md:grid-cols-4'
    return 'grid-cols-4 md:grid-cols-5'
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-pink-100 rounded-xl p-4 shadow-lg">
        <div className="text-xl font-bold text-purple-600">
          Matches: <span className="text-green-500">{matches}</span> / {totalPairs}
        </div>
        <Button 
          onClick={initializeGame} 
          className="bg-purple-500 hover:bg-purple-600 text-white shadow-md"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Play Again!
        </Button>
      </div>

      <div className={`grid ${getGridCols()} gap-4`}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square relative cursor-pointer transform transition-transform hover:scale-105 ${
              card.isMatched ? 'opacity-75' : ''
            }`}
          >
            <div
              className={`w-full h-full transition-all duration-300 ${
                card.isMatched || flippedCards.includes(card.id)
                  ? 'rotate-y-0'
                  : 'rotate-y-180'
              }`}
            >
              {/* Front of card (picture) */}
              <div className="absolute inset-0 rounded-xl border-4 border-purple-300 bg-white shadow-lg">
                <img
                  src={`/images/flashcards/track${track.id}/${card.card.image}`}
                  alt={card.card.word}
                  className="w-full h-full object-contain p-3"
                />
              </div>

              {/* Back of card (hidden) */}
              {!(card.isMatched || flippedCards.includes(card.id)) && (
                <div className="absolute inset-0 rounded-xl border-4 border-purple-300 bg-gradient-to-br from-blue-400 to-purple-500 rotate-y-180 shadow-lg">
                  {/* Stars pattern */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-4 h-4 bg-yellow-300 rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          animation: `twinkle ${1 + Math.random() * 2}s infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isGameComplete && (
        <div className="mt-8 p-6 text-center bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl shadow-lg animate-bounce">
          <h3 className="text-2xl font-bold mb-2 text-purple-600">Wonderful Job! 🎉</h3>
          <p className="text-lg text-pink-600 mb-4">You found all the matching pairs!</p>
          <Button 
            onClick={initializeGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
          >
            Play Again!
          </Button>
        </div>
      )}

      <style jsx global>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}