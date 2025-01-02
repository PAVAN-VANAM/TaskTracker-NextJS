'use client'

import { useState , useEffect } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import { Task } from './types'
import TimerAndStopwatch from './components/TimerAndStopwatch'
import TimelineCalendar from './components/TimelineCalendar'
import TaskTimeline from './components/TaskTimeline'
import BlastEffect from './components/BlastEffect'
import PreviousTasks from './components/PreviousTasks'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [completedTaskId, setCompletedTaskId] = useState<number | null>(null)
  const [encouragement, setEncouragement] = useState('')
  const prefix = process.env.NEXT_PUBLIC_API_URL
  
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${prefix}/api/tasks`)
        if (!response.ok) {
          throw new Error('Failed to fetch tasks')
        }
        const data: Task[] = await response.json()
        setTasks(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Render loading or error state
  if (loading) return <p>Loading tasks...</p>
  if (error) return <p>Error: {error}</p>

 


  const encouragements = [
    "You're awesome! 🎉",
    "Great job! 💪",
    "You're Unbreakable! 💪",
    "Unstoppable! 🚀",
    "You're on fire! 🔥",
    "Incredible work! 🌟",
    "Keep it up! 💥",
    "You're crushing it! 🏆",
    "So proud of you! 👏",
    "You're amazing! 🙌",
    "Keep shining! ✨",
    "You're a rockstar! 🎸",
    "You're doing fantastic! 🌈",
    "You're making magic! ✨",
    "Pure brilliance! 💡",
    "You're on a roll! 🎯",
    "You're a champion! 🏅",
    "Incredible effort! 🏆",
    "You're unstoppable! 🌟",
    "Next level! 🚀",
    "You’ve got this! 💪",
    "Perfection in progress! 🔥",
    "You're flying high! 🦅",
    "Your potential is limitless! 💎",
    "Amazing hustle! 💼",
    "Success looks great on you! 🎯",
    "Keep soaring! 🦋",
    "You're outdoing yourself! 🔥",
    "The sky’s the limit! 🌠",
    "You’re a superstar! 🌟",
    "Success is yours! 🎉",
    "You’re shining brighter! 🌟"
  ];
  

  const addTask = async (name: string, startTime: string, endTime: string, date: string) => {
    // Create task object
    const newTask = {
      name,
      complete: false,
      startTime,
      endTime,
      date,
    }
    console.log(newTask);
    
    try {
      // Send POST request to API
      const response = await fetch(`${prefix}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      })
  
      if (!response.ok) {
        throw new Error('Failed to add task')
      }
  
      const createdTask = await response.json()
  
      // Add the new task to the local state
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: createdTask.id, name, completed: false, startTime, endTime, date },
      ])
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }
  

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (!task.completed) {
          setCompletedTaskId(id)
          setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)])
        }
        return { ...task, completed: !task.completed }
      }
      return task
    }))
  }
  
  const deleteTask = async (id: number) => {
    try {
      // Send DELETE request to API
      const response = await fetch(`${prefix}/api/tasks/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      // Remove the deleted task from the local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  

  const handleBlastComplete = () => {
    setCompletedTaskId(null)
    setEncouragement('')
  }

  return (
    <div className="mx-auto p-4 max-w-7xl bg-white min-h-screen relative">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-4">Task Tracker 🎯</h1>
        <TimelineCalendar tasks={tasks} />
      </div>
      <div className="mt-4 flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/2">
          <TaskForm onAddTask={addTask} />
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </div>
        <div className="lg:w-1/2">
          <TimerAndStopwatch />
        </div>
      </div>
      <TaskTimeline tasks={tasks} />
      <PreviousTasks initialTasks={tasks} />
     {completedTaskId !== null && (
  <>
    {/* Blur background with encouragement */}
    <div className="fixed inset-0 flex items-center justify-center z-[999]">
      <span className="text-gold text-6xl font-bold  bg-opacity-20 ml-5 backdrop-blur-sm animate-fade-in">
        {encouragement}
      </span>

    {/* BlastEffect on top */}
    <div className="fixed inset-0 flex items-center justify-center z-[1000]">
      <BlastEffect onComplete={handleBlastComplete} />
    </div>
    </div>
  </>
  )}

    </div>
  )
}

