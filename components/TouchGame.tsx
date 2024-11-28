'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Shuffle } from 'lucide-react'
import { getTrackByName } from '@/config/tracks'
import type { FlashCard } from '@/config/tracks'

interface TouchGameProps {
  trackName: string;
}

export default function TouchGame({ trackName }: TouchGameProps) {
  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null)
  const [otherCard, setOtherCard] = useState<FlashCard | null>(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const track = getTrackByName(trackName)

  const generateQuestion = async () => {
    if (!track) return
    setIsLoading(true)

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    // Get random card for the question
    const availableCards = track.cards
    const questionCard = availableCards[Math.floor(Math.random() * availableCards.length)]

    // Get different random card for the incorrect option
    let wrongCard
    do {
      wrongCard = availableCards[Math.floor(Math.random() * availableCards.length)]
    } while (wrongCard.id === questionCard.id)

    setCurrentCard(questionCard)
    setOtherCard(wrongCard)
    setShowFeedback(null)

    // Delay audio playback to let the cards be visible first
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (audioRef.current) {
        audioRef.current.src = `/audio/voice/card${questionCard.id}.mp3`
        await audioRef.current.play()
      }
    } catch (error) {
      console.log('Audio playback interrupted', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (selectedCard: FlashCard) => {
    if (!currentCard || showFeedback || isLoading) return

    // Stop current audio playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    const isCorrect = selectedCard.id === currentCard.id
    setShowFeedback(isCorrect ? 'correct' : 'incorrect')
    setScore(prev => isCorrect ? prev + 1 : prev)
    setTotalQuestions(prev => prev + 1)

    // Wait before showing next question
    setTimeout(generateQuestion, 1500)
  }

  const resetGame = () => {
    // Stop current audio playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    
    setScore(0)
    setTotalQuestions(0)
    generateQuestion()
  }

  const playCurrentAudio = async () => {
    if (audioRef.current && !isLoading && currentCard) {
      try {
        audioRef.current.currentTime = 0
        await audioRef.current.play()
      } catch (error) {
        console.log('Audio playback interrupted', error)
      }
    }
  }

  useEffect(() => {
    generateQuestion()
    
    // Cleanup function to stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [trackName])

  if (!track || !currentCard || !otherCard) return null

  // Randomly order the two cards
  const cardsToShow = Math.random() < 0.5 
    ? [currentCard, otherCard]
    : [otherCard, currentCard]

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-blue-100 rounded-xl p-4 shadow-lg">
        <div className="text-xl font-bold text-blue-600">
          Score: <span className="text-green-500">{score}</span> / {totalQuestions}
        </div>
        <Button 
          onClick={playCurrentAudio}
          className="bg-purple-500 hover:bg-purple-600 text-white mr-4"
          disabled={isLoading}
        >
          Hear Again
        </Button>
        <Button 
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          <Shuffle className="w-4 h-4 mr-2" />
          New Game
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {cardsToShow.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardClick(card)}
            className={`
              aspect-square relative overflow-hidden rounded-xl border-4 
              ${showFeedback === 'correct' && card.id === currentCard.id 
                ? 'border-green-400 bg-green-50' 
                : showFeedback === 'incorrect' && card.id === currentCard.id
                ? 'border-green-400 bg-green-50'
                : showFeedback === 'incorrect' && card.id !== currentCard.id
                ? 'border-red-400 bg-red-50'
                : 'border-blue-300 bg-white'
              }
              ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
              transition-all duration-200 shadow-lg
            `}
          >
            <img
              src={`/images/flashcards/track${track.id}/${card.image}`}
              alt={card.word}
              className="absolute inset-0 w-full h-full object-contain p-4"
            />
          </div>
        ))}
      </div>

      <audio ref={audioRef} />

      {showFeedback && (
        <div className={`
          mt-6 p-4 text-center rounded-xl shadow-lg
          ${showFeedback === 'correct' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
          }
        `}>
          <p className="text-2xl font-bold">
            {showFeedback === 'correct' ? '🎉 Great job!' : '😢 Try again!'}
          </p>
        </div>
      )}
    </div>
  )
}