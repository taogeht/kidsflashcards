'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { getTrackByName } from '@/config/tracks'
import type { FlashCard } from '@/config/tracks'

interface FlashcardGridProps {
  trackName: string;
}

export default function FlashcardGrid({ trackName }: FlashcardGridProps) {
  const [selectedCard, setSelectedCard] = useState<FlashCard | null>(null);
  const track = getTrackByName(trackName);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!track) return null;

  const getFlashcardPath = (card: FlashCard) => {
    return `/images/flashcards/track${track.id}/${card.image}`
  }

  const getAudioPath = (card: FlashCard) => {
    return `/audio/voice/track${track.id}/card${card.id}.mp3`
  }

  const handleCardClick = (card: FlashCard) => {
    setSelectedCard(card);
    // Play the corresponding audio when card is clicked
    if (audioRef.current) {
      audioRef.current.src = getAudioPath(card);
      audioRef.current.play();
    }
  }

  const handleDialogClose = () => {
    setSelectedCard(null);
    // Stop audio when dialog is closed
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <audio ref={audioRef} />
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {track.cards.map((card) => (
          <div
            key={card.id}
            className="aspect-square relative overflow-hidden rounded-xl border-4 border-pink-300 bg-white cursor-pointer 
              hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
            onClick={() => handleCardClick(card)}
          >
            <img
              src={getFlashcardPath(card)}
              alt={`Flashcard ${card.word}`}
              className="absolute inset-0 w-full h-full object-contain p-2"
            />
          </div>
        ))}
      </div>

      <Dialog open={selectedCard !== null} onOpenChange={handleDialogClose}>
        <DialogContent className="p-6 max-w-md w-full h-auto bg-gradient-to-r from-pink-50 to-purple-50">
          <DialogTitle className="sr-only">
            {selectedCard ? `${trackName} - ${selectedCard.word}` : ''}
          </DialogTitle>
          {selectedCard && (
            <div 
              className="w-full h-auto aspect-square bg-white rounded-xl border-4 border-purple-300 shadow-lg overflow-hidden"
              onClick={() => {
                // Allow replaying audio by clicking the enlarged image
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play();
                }
              }}
            >
              <img
                src={getFlashcardPath(selectedCard)}
                alt={`Flashcard - ${selectedCard.word}`}
                className="w-full h-full object-contain p-4"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}