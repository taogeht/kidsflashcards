'use client'

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Shuffle } from 'lucide-react';
import { getTrackByName } from '@/config/tracks';
import type { FlashCard } from '@/config/tracks';

interface MatchingGameProps {
  trackName: string;
}

interface SelectableImageProps {
    id: number;
    src: string;
    isMatched: boolean;
    isSelected: boolean;
    onSelect: (id: number) => void;
  }
  
  function SelectableImage({ id, src, isMatched, isSelected, onSelect }: SelectableImageProps) {
    return (
      <div 
        onClick={() => !isMatched && onSelect(id)}
        className={`relative w-32 h-32 rounded-xl border-4 shadow-md bg-white
                   ${isMatched ? 'opacity-50 cursor-default' : 'cursor-pointer hover:scale-105'}
                   ${isSelected ? 'border-yellow-400 shadow-yellow-200' : 'border-blue-300'}
                   transition-all duration-200`}
      >
        <img 
          src={src} 
          alt="Card"
          className="w-full h-full object-contain p-2"
        />
      </div>
    );
  }
  
  interface SelectableWordProps {
    id: number;
    word: string;
    matchedImage?: string;
    isMatched: boolean;
    canSelect: boolean;
    onSelect: (id: number) => void;
  }
  
  function SelectableWord({ id, word, matchedImage, isMatched, canSelect, onSelect }: SelectableWordProps) {
    return (
      <div 
        onClick={() => canSelect && onSelect(id)}
        className={`w-32 h-32 rounded-xl border-4 flex items-center justify-center p-4 text-center
                   ${isMatched ? (matchedImage ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500') 
                              : canSelect ? 'border-dashed border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100'
                              : 'border-dashed border-blue-300 bg-blue-50'}
                   transition-all duration-200`}
      >
        {isMatched && matchedImage ? (
          <img 
            src={matchedImage}
            alt={word}
            className="w-full h-full object-contain animate-fade-in"
          />
        ) : (
          <span className="text-sm font-medium">{word}</span>
        )}
      </div>
    );
  }

export default function MatchingGame({ trackName }: MatchingGameProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [shuffledCards, setShuffledCards] = useState<FlashCard[]>([]);
  const [matches, setMatches] = useState<{[key: number]: { matched: boolean; correct: boolean; image?: string }}>({});
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const track = getTrackByName(trackName);

  useEffect(() => {
    if (track?.cards) {
      setShuffledCards(shuffleArray([...track.cards]));
      setMatches({});
      setScore(0);
      setTotalAttempts(0);
    }
  }, [trackName]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const resetGame = () => {
    if (track?.cards) {
      setShuffledCards(shuffleArray([...track.cards]));
      setMatches({});
      setScore(0);
      setTotalAttempts(0);
      setSelectedImage(null);  // Added this line to reset selected image
    }
  };


  const handleSelection = (type: 'image' | 'word', id: number) => {
    if (type === 'image') {
      setSelectedImage(id);
      return;
    }
  
    // If we have a selected image and clicked a word
    if (selectedImage !== null) {
      setTotalAttempts(prev => prev + 1);
      
      if (selectedImage === id) {
        // Correct match
        
        const matchedCard = shuffledCards.find(card => card.id === id);
        const imagePath = matchedCard ? `/images/flashcards/track${track!.id}/${matchedCard.image}` : undefined;
        
        setTimeout(() => {
          setMatches(prev => ({
            ...prev,
            [id]: { matched: true, correct: true, image: imagePath }
          }));
          setScore(prev => prev + 1);
          
        }, 500);
      } else {
        // Incorrect match
        setMatches(prev => ({
          ...prev,
          [selectedImage]: { matched: true, correct: false }
        }));
        setTimeout(() => {
          setMatches(prev => {
            const newMatches = { ...prev };
            delete newMatches[selectedImage];
            return newMatches;
          });
        }, 500);
      }
      
      setSelectedImage(null);
    }
  };

  if (!track) return null;

  const isGameComplete = score === track.numFlashcards;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <style jsx global>{`
        @keyframes match {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        .animate-match {
          animation: match 0.5s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Rest of the JSX remains the same until the DroppableWord rendering */}
      <div className="flex justify-between items-center mb-6 bg-blue-100 rounded-xl p-4 shadow-lg">
        <div className="text-xl font-bold text-blue-600">
          Score: <span className="text-green-500">{score}</span> / {track.numFlashcards}
          <span className="ml-4">Attempts: {totalAttempts}</span>
        </div>
        
        <Button 
          onClick={resetGame}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Play Again
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  <div className="grid grid-cols-2 gap-4">
    {shuffledCards.map(card => (
      <SelectableImage 
        key={card.id}
        id={card.id}
        src={`/images/flashcards/track${track.id}/${card.image}`}
        isMatched={matches[card.id]?.matched && matches[card.id]?.correct}
        isSelected={selectedImage === card.id}
        onSelect={(id) => handleSelection('image', id)}
  
      />
    ))}
  </div>

  <div className="grid grid-cols-2 gap-4">
    {track.cards.map(card => (
      <SelectableWord
        key={card.id}
        id={card.id}
        word={card.word}
        matchedImage={matches[card.id]?.image}
        isMatched={matches[card.id]?.matched}
        canSelect={selectedImage !== null}
        onSelect={(id) => handleSelection('word', id)}

      />
    ))}
  </div>
</div>

      {isGameComplete && (
        <div className="mt-8 p-6 text-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-2 text-blue-600">Wonderful Job! 🎉</h3>
          <p className="text-lg text-purple-600 mb-4">You matched all the pairs!</p>
          <Button 
            onClick={resetGame}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md"
          >
            Play Again!
          </Button>
        </div>
      )}
    </div>
  );
}