'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from 'lucide-react'
import { getTrackByName } from '@/config/tracks'

interface SingleTrackProps {
  trackName: string
}

export default function SingleTrack({ trackName }: SingleTrackProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const track = getTrackByName(trackName)

  if (!track) return null

  const getAudioPath = () => {
    return `/audio/track${track.id}.mp3`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const updateProgress = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      setProgress((current / duration) * 100)
      setCurrentTime(current)
      setDuration(duration)
    }
  }

  return (
    <div className="rounded-xl p-6 shadow-lg bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-300">
      <div className="flex">
        <div className="flex-shrink-0 mr-8">
          <Button
            variant="outline"
            size="icon"
            className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 
              hover:to-purple-600 text-white border-4 border-white shadow-lg hover:scale-105 transition-transform duration-200"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-10 h-10" />
            ) : (
              <Play className="w-10 h-10" />
            )}
          </Button>
        </div>

        <div className="flex-grow">
          <h3 className="text-xl font-bold mb-4 text-blue-700">{trackName}</h3>
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            className="w-full mb-2"
          />
          <div className="text-sm text-gray-600">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={getAudioPath()}
        onTimeUpdate={updateProgress}
      />
    </div>
  )
}