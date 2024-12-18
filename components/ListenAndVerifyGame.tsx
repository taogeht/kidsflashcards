import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Check, X, Play, Shuffle } from 'lucide-react';
import { getTrackByName } from '@/config/tracks';
import type { FlashCard } from '@/config/tracks';

interface ListenAndVerifyGameProps {
  trackName: string;
}

export default function ListenAndVerifyGame({ trackName }: ListenAndVerifyGameProps) {
  const [currentCard, setCurrentCard] = useState<FlashCard | null>(null);
  const [displayedCard, setDisplayedCard] = useState<FlashCard | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = getTrackByName(trackName);

  const generateQuestion = async () => {
    if (!track) return;
    setIsLoading(true);
    setShowFeedback(null);

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Get random card for the audio
    const availableCards = track.cards;
    const audioCard = availableCards[Math.floor(Math.random() * availableCards.length)];
    
    // 50% chance to show a different card
    const shouldShowDifferentCard = Math.random() < 0.5;
    let cardToShow;
    
    if (shouldShowDifferentCard) {
      do {
        cardToShow = availableCards[Math.floor(Math.random() * availableCards.length)];
      } while (cardToShow.id === audioCard.id);
    } else {
      cardToShow = audioCard;
    }

    setCurrentCard(audioCard);
    setDisplayedCard(cardToShow);

    // Play the audio after a short delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (audioRef.current) {
        audioRef.current.src = `/audio/voice/track${track.id}/card${audioCard.id}.mp3`;
        await audioRef.current.play();
      }
    } catch (error) {
      console.log('Audio playback interrupted', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (isYes: boolean) => {
    if (!currentCard || !displayedCard || showFeedback || isLoading) return;

    const isCorrect = (isYes && currentCard.id === displayedCard.id) || 
                     (!isYes && currentCard.id !== displayedCard.id);

    setShowFeedback(isCorrect ? 'correct' : 'incorrect');
    setScore(prev => isCorrect ? prev + 1 : prev);
    setTotalQuestions(prev => prev + 1);

    // Wait before showing next question
    setTimeout(generateQuestion, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    generateQuestion();
  };

  const playCurrentAudio = async () => {
    if (audioRef.current && !isLoading && currentCard && track) {
      try {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } catch (error) {
        console.log('Audio playback interrupted', error);
      }
    }
  };

  useEffect(() => {
    generateQuestion();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [trackName]);

  if (!track || !displayedCard) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Score and Controls */}
      <div className="flex justify-between items-center mb-6 bg-blue-100 rounded-xl p-4 shadow-lg">
        <div className="text-xl font-bold text-blue-600">
          Score: <span className="text-green-500">{score}</span> / {totalQuestions}
        </div>
        <Button 
          onClick={playCurrentAudio}
          className="bg-purple-500 hover:bg-purple-600 text-white mr-4"
          disabled={isLoading}
        >
          <Play className="w-4 h-4 mr-2" />
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

      {/* Card Display */}
      <div className="flex flex-col items-center space-y-8">
        <div className="aspect-square w-64 relative overflow-hidden rounded-xl border-4 border-blue-300 bg-white shadow-lg">
          <img
            src={`/images/flashcards/track${track.id}/${displayedCard.image}`}
            alt={displayedCard.word}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
        </div>

        {/* Yes/No Buttons */}
        <div className="flex justify-center space-x-8">
          <Button
            onClick={() => handleAnswer(true)}
            disabled={isLoading || showFeedback !== null}
            className="w-24 h-24 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg 
                     hover:scale-105 transition-all duration-200"
          >
            <Check className="w-16 h-16" />
          </Button>
          <Button
            onClick={() => handleAnswer(false)}
            disabled={isLoading || showFeedback !== null}
            className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg 
                     hover:scale-105 transition-all duration-200"
          >
            <X className="w-16 h-16" />
          </Button>
        </div>
      </div>

      <audio ref={audioRef} />

      {/* Feedback Message */}
      {showFeedback && (
        <div className={`
          mt-6 p-4 text-center rounded-xl shadow-lg animate-bounce
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
  );
}