import { useState, useEffect } from 'react';
import { Task } from '../types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

interface PreviousTasksProps {
  initialTasks: Task[]; // Changed to accept initial tasks
}

export default function PreviousTasks({ initialTasks }: PreviousTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Initial state with passed tasks
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Format the selected date into yyyy/mm/dd for the API call
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  };

  // Fetch tasks from the API based on selected date
  const fetchTasksByDate = async (date: string) => {
    const prefix = process.env.NEXT_PUBLIC_API_URL;
    setLoading(true); // Set loading state to true while fetching
    try {
      const response = await fetch(`${prefix}/api/tasks/data?date=${date}` );
      
      if (response.ok) {
        const data: Task[] = await response.json();
        
        setTasks(data); // Update tasks state with fetched data
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  useEffect(() => {
    // Only fetch tasks if a valid date is selected
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      fetchTasksByDate(formattedDate);
    }
  }, [selectedDate]); // Re-fetch tasks when selectedDate changes

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Previous Tasks</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold mb-2">
            Tasks for {selectedDate ? formatDate(selectedDate) : 'No date selected'}
          </h3>
          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <>
              {tasks.length > 0 ? (
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li
                      key={task.id} // Use 'id' or another unique identifier instead of 'name'
                      className="flex items-center justify-between p-2 bg-white rounded shadow"
                    >
                      <span className={task.completed ? 'line-through text-gray-500' : ''}>
                        {task.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {task.startTime} - {task.endTime}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks for this date.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
