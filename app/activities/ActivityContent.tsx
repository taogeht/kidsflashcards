'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, Brain, Puzzle, FlashlightIcon as FlashCard, Hand } from 'lucide-react'
import SingleTrack from '@/components/SingleTrack'
import FlashcardGrid from '@/components/FlashcardGrid'
import MatchingGame from '@/components/MatchingGame'
import MemoryGame from '@/components/MemoryGame'
import TouchGame from '@/components/TouchGame'

const activities = [
{
        id: 'flashcards',
        title: "Flashcard Review",
        description: "Review flashcards related to the songs",
        icon: <FlashCard className="w-8 h-8" />
  },
  {
    id: 'memory',
    title: "Memory Game",
    description: "Match pairs of cards to test your memory",
    icon: <Brain className="w-8 h-8" />
  },
  {
    id: 'matching',
    title: "Matching Game",
    description: "Connect related images or words",
    icon: <Puzzle className="w-8 h-8" />
  },
  {
    id: 'touch',
    title: "Touch Game",
    description: "Listen and touch the correct picture",
    icon: <Hand className="w-8 h-8" />
  }
]
export default function ActivityContent() {
    const searchParams = useSearchParams()
    const selectedTrack = searchParams.get('track')
    const [selectedActivity, setSelectedActivity] = useState<string | null>(null)
  
    if (!selectedTrack) {
      return <div>No track selected</div>
    }
  
    const renderActivity = () => {
      console.log('Selected activity:', selectedActivity) 
      switch (selectedActivity) {
        case 'flashcards':
          return <FlashcardGrid trackName={selectedTrack} />
        case 'matching':
          return <MatchingGame trackName={selectedTrack} />
        case 'memory':
          return <MemoryGame trackName={selectedTrack} />
        case 'touch':
          return <TouchGame trackName={selectedTrack} />
        default:
          return null
      }
    }
  
    return (
      <div className="container mx-auto p-4">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>
        </Link>
        
        <h2 className="text-2xl font-bold text-center mb-8">
          Activities for {selectedTrack}
        </h2>
  
        <div className="mb-8">
          <SingleTrack trackName={selectedTrack} />
        </div>
  
        {selectedActivity ? (
          <div>
            <Button 
              variant="outline" 
              onClick={() => setSelectedActivity(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Activities
            </Button>
            {renderActivity()}
          </div>
        ) : (
          <div className="grid gap-6">
            {activities.map((activity) => (
              <Card key={activity.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    {activity.icon}
                    {activity.title}
                  </CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      console.log('Setting activity to:', activity.id)
                      setSelectedActivity(activity.id)
                    }}
                  >
                    Start Activity
                  </Button>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }