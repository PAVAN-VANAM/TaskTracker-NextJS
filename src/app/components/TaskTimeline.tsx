'use client';

import { Task } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TaskTimelineProps {
  tasks: Task[];
}

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const TOTAL_MINUTES = HOURS_IN_DAY * MINUTES_IN_HOUR;

// Helper function to parse time strings into minutes since midnight
const convertTimeToMinutes = (time: string) => {
  const [hours, minutes] = time.match(/\d+/g)!.map(Number); // Extract hours and minutes
  const isPM = time.toLowerCase().includes('pm'); // Check if it's PM
  const normalizedHours = isPM && hours < 12 ? hours + 12 : hours === 12 && !isPM ? 0 : hours; // Adjust for 12-hour format
  return normalizedHours * MINUTES_IN_HOUR + minutes;
};

export default function TaskTimeline({ tasks }: TaskTimelineProps) {
  const getTaskColor = (index: number) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  const getTaskPosition = (task: Task) => {
    const minutes = convertTimeToMinutes(task.startTime); // Convert start time to minutes
    return (minutes / TOTAL_MINUTES) * 100;
  };

  const getTaskWidth = (task: Task) => {
    const startMinutes = convertTimeToMinutes(task.startTime);
    const endMinutes = convertTimeToMinutes(task.endTime);
    const duration = endMinutes - startMinutes; // Task duration in minutes
    return (duration / TOTAL_MINUTES) * 100;
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-8">Task Timeline</h2>

        {/* Timeline Container for Desktop */}
        <div className="relative h-16 bg-gray-200 rounded mb-4 hidden sm:block">
          {/* Hour markers */}
          {[...Array(HOURS_IN_DAY)].map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 border-l border-gray-300"
              style={{ left: `${(index / HOURS_IN_DAY) * 100}%` }}
            >
              <span className="absolute -top-6 -left-2 text-xs sm:text-sm md:text-md">{index}:00</span>
            </div>
          ))}

          {/* Tasks as bars */}
          {tasks.map((task, index) => (
            <TooltipProvider key={task.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`absolute h-8 top-4 ${getTaskColor(index)} opacity-75 hover:opacity-100 transition-opacity cursor-pointer rounded`}
                    style={{
                      left: `${getTaskPosition(task)}%`,
                      width: `${getTaskWidth(task)}%`,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="p-2">
                    <h3 className="font-bold">{task.name}</h3>
                    <p className="text-sm">
                      {task.startTime} - {task.endTime}
                    </p>
                    <p className="text-sm">{task.completed ? 'Completed' : 'Pending'}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Task List for Mobile and Desktop */}
        <div className="space-y-4 sm:space-y-2 md:space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="flex flex-col sm:flex-row items-center sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
            >
              {/* Mobile View: Time Marker */}
              <div className="sm:w-1/4 md:w-1/6 text-sm text-gray-500 text-center sm:text-left">
                <span>{task.startTime}</span> - <span>{task.endTime}</span>
              </div>

              {/* Task Indicator */}
              <div className={`w-4 h-4 rounded-full ${getTaskColor(index)} hidden sm:block`} />

              {/* Task Details */}
              <div className="sm:w-3/4 md:w-5/6">
                <h3 className="text-lg font-semibold text-center sm:text-left">{task.name}</h3>
                <p className="text-sm text-gray-500 text-center sm:text-left">
                  {task.completed ? 'Completed' : 'Pending'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
