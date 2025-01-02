import { useEffect, useState } from 'react'
import { Task } from '../types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface TaskListProps {
  tasks : Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

export default function TaskList({tasks, onToggle, onDelete }: TaskListProps) {
  return (
    <ul className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between p-2 bg-white rounded shadow relative overflow-hidden"
        >
          <div className="flex items-start  flex-grow">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              className="mr-2 mt-1"
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`${
                task.completed ? 'line-through text-gray-500' : ''
              } text-left flex-grow`}
            >
              {task.name}
            </label>
            <p className='font-semibold'><span className='text-green-700'>{task.startTime} </span> - <span className='text-red-700'>{task.endTime}</span></p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
