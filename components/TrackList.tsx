'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { tracks, Track } from '@/config/tracks'

interface TrackListProps {
  selectedTrack?: string;
}

export default function TrackList({ selectedTrack }: TrackListProps) {
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null)
  const [progress, setProgress] = useState<{ [key: number]: number }>({})
  const [duration, setDuration] = useState<{ [key: number]: number }>({})
  const [currentTime, setCurrentTime] = useState<{ [key: number]: number }>({})
  const audioRef = useRef<HTMLAudioElement>(null)

  const tracksToShow = selectedTrack 
    ? tracks.filter(track => track.name === selectedTrack)
    : tracks

  const getAudioPath = (track: Track) => {
    return `/audio/track${track.id}.mp3`
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const updateProgress = () => {
    if (audioRef.current && playingTrack) {
      const current = audioRef.current.currentTime
      const duration = audioRef.current.duration
      const progressValue = (current / duration) * 100
      
      setProgress(prev => ({
        ...prev,
        [playingTrack.id]: progressValue || 0
      }))
      
      setCurrentTime(prev => ({
        ...prev,
        [playingTrack.id]: current
      }))
      
      setDuration(prev => ({
        ...prev,
        [playingTrack.id]: duration
      }))
    }
  }

  const togglePlay = (track: Track) => {
    if (audioRef.current) {
      if (playingTrack?.id === track.id) {
        audioRef.current.pause()
        setPlayingTrack(null)
      } else {
        audioRef.current.src = getAudioPath(track)
        audioRef.current.play()
        setPlayingTrack(track)
      }
    }
  }

  return (
    <div className="space-y-6">
      <audio ref={audioRef} onTimeUpdate={updateProgress} />
      {tracksToShow.map((track) => (
        <div key={track.id} className="rounded-xl p-6 shadow-lg bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-300">
          <div className="flex">
            <div className="flex flex-col items-center space-y-4 mr-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => togglePlay(track)}
                className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 
                  hover:to-purple-600 text-white border-4 border-white shadow-lg hover:scale-105 transition-transform duration-200"
              >
                {playingTrack?.id === track.id ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10" />
                )}
              </Button>

              {!selectedTrack && (
                <Link 
                  href={`/activities?track=${encodeURIComponent(track.name)}`} 
                  passHref
                >
                  <Button 
                    variant="outline"
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 
                      hover:to-purple-600 text-white border-2 border-white rounded-xl 
                      shadow-md hover:scale-105 transition-transform duration-200"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Activities
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex-grow">
              <h3 className="text-xl font-bold mb-4 text-blue-700">{track.name}</h3>
              <Slider
                value={[progress[track.id] || 0]}
                max={100}
                step={0.1}
                className="w-full mb-2"
              />
              <div className="text-sm text-gray-600">
                {formatTime(currentTime[track.id] || 0)} / {formatTime(duration[track.id] || 0)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}