import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface TaskFormProps {
  onAddTask: (text: string, startTime: string, endTime: string, date: string) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [text, setText] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && startTime && endTime && date) {
      const formattedStartTime = format(new Date(`${format(date, 'yyyy-MM-dd')}T${startTime}:00`), 'h:mm a');
      const formattedEndTime = format(new Date(`${format(date, 'yyyy-MM-dd')}T${endTime}:00`), 'h:mm a');
  
      onAddTask(text, formattedStartTime, formattedEndTime, format(date, 'yyyy-MM-dd'));
      setText('');
      setStartTime('');
      setEndTime('');
      setDate(new Date());
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task"
          className="flex-grow"
        />
        <div className="flex gap-2">
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Start Time"
          />
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            placeholder="End Time"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  )
}

