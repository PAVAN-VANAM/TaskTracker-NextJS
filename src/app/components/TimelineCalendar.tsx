'use client'

import { useState, useEffect } from 'react'
import { Task } from '../types'

interface TimelineCalendarProps {
  tasks: Task[]
}

export default function TimelineCalendar({ tasks }: TimelineCalendarProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  // Initialize current time after the component mounts
  useEffect(() => {
    setCurrentTime(new Date())
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!currentTime) {
    // Render a placeholder while the current time is being fetched
    return <div>Loading...</div>
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  // Helper function to parse a time string like "4:00 AM" to a Date object
  const parseTimeStringToDate = (timeStr: string, referenceDate: Date): Date => {
    const [time, modifier] = timeStr.split(' '); // Split time and AM/PM
    const [hours, minutes] = time.split(':').map(Number); // Split hours and minutes

    const newDate = new Date(referenceDate);
    newDate.setHours(hours + (modifier === 'PM' && hours !== 12 ? 12 : 0)); // Adjust for PM if needed
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    
    return newDate;
  }

  const getNextTask = () => {
    const now = currentTime.getTime()
    return tasks
      .filter(task => {
        const taskStartTime = parseTimeStringToDate(task.startTime, currentTime)
        return taskStartTime.getTime() > now
      })
      .sort((a, b) => {
        const aTime = parseTimeStringToDate(a.startTime, currentTime).getTime()
        const bTime = parseTimeStringToDate(b.startTime, currentTime).getTime()
        return aTime - bTime
      })[0]
  }

  const getRemainingTime = (task: Task) => {
    const now = currentTime.getTime()
    const taskStartTime = parseTimeStringToDate(task.startTime, currentTime).getTime()
    const remaining = taskStartTime - now
    const minutes = Math.floor(remaining / 60000)
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m`
  }

  const getTimeRemainingToday = () => {
    const now = currentTime
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0) // Set to midnight (12:00 AM next day)
    const diff = midnight.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  const nextTask = getNextTask()

  const tomorrow = new Date(currentTime)
  tomorrow.setDate(currentTime.getDate() + 1)

  return (
    <div className="mb-4 bg-card text-card-foreground shadow-sm rounded-lg w-full">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <div className="text-sm text-muted-foreground">Today</div>
            <div className="text-lg font-semibold">{formatDate(currentTime)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Current Time</div>
            <div className="text-lg font-semibold">{formatTime(currentTime)}</div>
            <div className="text-sm text-muted-foreground font-extrabold">
              Remaining Today: {getTimeRemainingToday()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Tomorrow</div>
            <div className="text-lg font-semibold">{formatDate(tomorrow)}</div>
          </div>
        </div>
        {nextTask && (
          <div className="mt-2 text-center">
            <div className="text-sm text-muted-foreground">Next Task</div>
            <div className="text-lg font-semibold">{nextTask.name}</div>
            <div className="text-sm">Starts in: {getRemainingTime(nextTask)}</div>
          </div>
        )}
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary" 
            style={{ 
              width: `${(currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds()) / 864}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
  