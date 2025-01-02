'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default function TimerAndStopwatch() {
  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false)
  const [timerTime, setTimerTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [inputTime, setInputTime] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const openPopup = () => setIsPopupOpen(true)
  const closePopup = () => setIsPopupOpen(false)

  // Listen for tab minimize or visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        openPopup()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Format time function
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="stopwatch" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
              <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
              <div className="text-3xl font-mono mb-4 text-center">
                {formatTime(stopwatchTime)}
              </div>
              <div className="flex justify-center space-x-2">
                <Button
                  onClick={() =>
                    setIsStopwatchRunning(!isStopwatchRunning)
                  }
                >
                  {isStopwatchRunning ? 'Stop' : 'Start'}
                </Button>
                <Button onClick={() => setStopwatchTime(0)}>Reset</Button>
              </div>
            </TabsContent>
            <TabsContent value="timer">
              <div className="text-3xl font-mono mb-4 text-center">
                {formatTime(timerTime)}
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                <Input
                  type="text"
                  value={inputTime}
                  onChange={(e) => setInputTime(e.target.value)}
                  placeholder="HH:MM:SS"
                  className="w-32"
                />
                <Button
                  onClick={() =>
                    setIsTimerRunning(!isTimerRunning)
                  }
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={() => setTimerTime(0)}>Reset</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

    </>
  )
}
