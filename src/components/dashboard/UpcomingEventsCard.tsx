import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Calendar, BookOpen, FileClock, PlusCircle } from 'lucide-react';
import { CalendarEvent } from '../../types';
import { format } from 'date-fns';
import { Button } from '../ui/Button';

interface UpcomingEventsCardProps {
  events: CalendarEvent[];
}

export const UpcomingEventsCard: React.FC<UpcomingEventsCardProps> = ({ events }) => {
  return (
    <Card className="mb-6 shadow-lg border-none bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-[#1e293b] dark:via-[#0f172a] dark:to-[#1e293b] rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between px-6 pt-6 pb-3">
        <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">📅 Upcoming Events</CardTitle>
        <div className="flex space-x-2">
          <a
            href="/calendar"
            className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            View all
          </a>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<PlusCircle className="h-4 w-4" />}
            className="hover:bg-cyan-100 dark:hover:bg-cyan-900/20 text-cyan-600 dark:text-cyan-300"
          >
            Add
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="py-6 text-center text-slate-500 dark:text-slate-400 italic">
              No upcoming events. Add study sessions or exams to your calendar!
            </div>
          ) : (
            events.map((event) => <EventItem key={event.id} event={event} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface EventItemProps {
  event: CalendarEvent;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const getEventIcon = () => {
    switch (event.type) {
      case 'study':
        return <BookOpen className="h-6 w-6 text-cyan-500" />;
      case 'exam':
        return <FileClock className="h-6 w-6 text-rose-500" />;
      default:
        return <Calendar className="h-6 w-6 text-violet-500" />;
    }
  };

  const getEventTypeLabel = () => {
    switch (event.type) {
      case 'study':
        return 'Study Session';
      case 'exam':
        return 'Exam';
      case 'meeting':
        return 'Meeting';
      case 'deadline':
        return 'Deadline';
      default:
        return 'Event';
    }
  };

  const getEventTypeColor = () => {
    switch (event.type) {
      case 'study':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300';
      case 'exam':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300';
      case 'meeting':
        return 'bg-violet-100 text-violet-800 dark:bg-violet-900/20 dark:text-violet-300';
      case 'deadline':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-white dark:bg-slate-800/50 hover:shadow-md hover:scale-[1.01] transition-transform duration-200 ease-in-out">
      <div className="flex-shrink-0">{getEventIcon()}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-slate-900 dark:text-white">{event.title}</p>
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium ${getEventTypeColor()}`}
          >
            {getEventTypeLabel()}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {format(new Date(event.startTime), 'EEE, MMM d • h:mm a')}
        </p>
        {event.location && (
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{event.location}</p>
        )}
      </div>
    </div>
  );
};
