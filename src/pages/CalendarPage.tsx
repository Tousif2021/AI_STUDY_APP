import React, { useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Calendar } from '../components/calendar/Calendar';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PlusCircle } from 'lucide-react';
import { useCalendarStore } from '../store/useCalendarStore';
import { useAuthStore } from '../store/useAuthStore';
import { CalendarEvent } from '../types';

export const CalendarPage: React.FC = () => {
  const { events, isLoading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useCalendarStore();
  const { user } = useAuthStore();
  const [showAdd, setShowAdd] = React.useState(false);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Show next 2 upcoming events for sidebar
  const upcomingEvents = [...events]
    .filter(e => e.startTime > new Date())
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
    .slice(0, 2);

  const handleEventAdd = async (event: CalendarEvent) => {
    if (!user) return;
    await createEvent({ ...event, createdBy: user.id });
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    await updateEvent(event.id, event);
  };

  const handleEventDelete = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          {error && (
            <p className="text-red-600 dark:text-red-400 mt-1">{error}</p>
          )}
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Manage your study schedule, exams, and deadlines
          </p>
        </div>
        <Button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2"
          disabled={!user}
        >
          <PlusCircle size={20} /> Add Event
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Calendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            isLoading={isLoading}
          />
          {events.length === 0 && !isLoading && (
            <div className="mt-12 flex flex-col items-center text-gray-500 dark:text-gray-400">
              <span className="text-4xl">🗓️</span>
              <span className="mt-2">No events yet. Add one to get started!</span>
            </div>
          )}
        </div>
        <div className="md:col-span-1">
          <Card className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md p-4">
            <h2 className="text-lg font-semibold mb-2">Upcoming</h2>
            {upcomingEvents.length === 0 ? (
              <span className="text-gray-400">No upcoming events.</span>
            ) : (
              upcomingEvents.map(event => (
                <CardContent key={event.id} className="mb-3 last:mb-0">
                  <div className="font-bold">{event.title}</div>
                  <div className="text-xs text-gray-500">
                    {event.startTime.toLocaleString()}<br />
                    {event.location && <span>{event.location}</span>}
                  </div>
                  {event.description && (
                    <div className="text-sm mt-1">{event.description}</div>
                  )}
                </CardContent>
              ))
            )}
          </Card>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[350px]">
            <h3 className="font-bold text-lg mb-4">Add Event</h3>
            {/* Replace with your form */}
            <div className="mb-4">Event form goes here...</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowAdd(false)}>
                Save (demo)
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};