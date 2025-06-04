import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CalendarEvent } from '../types';

interface CalendarState {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  events: [],
  isLoading: false,
  error: null,

  fetchEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;

      const events: CalendarEvent[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description || undefined,
        startTime: new Date(event.start_time),
        endTime: new Date(event.end_time),
        location: event.location || undefined,
        type: event.type,
        reminder: event.reminder ? new Date(event.reminder) : undefined,
        courseId: event.course_id || undefined,
        createdBy: event.created_by
      }));

      set({ events, isLoading: false });
    } catch (error) {
      console.error('Error fetching events:', error);
      set({ error: 'Failed to fetch events', isLoading: false });
    }
  },

  createEvent: async (event) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .insert([{
          title: event.title,
          description: event.description,
          start_time: event.startTime.toISOString(),
          end_time: event.endTime.toISOString(),
          location: event.location,
          type: event.type,
          reminder: event.reminder?.toISOString(),
          course_id: event.courseId,
          created_by: event.createdBy
        }])
        .select()
        .single();

      if (error) throw error;

      const newEvent: CalendarEvent = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        startTime: new Date(data.start_time),
        endTime: new Date(data.end_time),
        location: data.location || undefined,
        type: data.type,
        reminder: data.reminder ? new Date(data.reminder) : undefined,
        courseId: data.course_id || undefined,
        createdBy: data.created_by
      };

      set(state => ({
        events: [...state.events, newEvent],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error creating event:', error);
      set({ error: 'Failed to create event', isLoading: false });
    }
  },

  updateEvent: async (id, eventUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .update({
          title: eventUpdate.title,
          description: eventUpdate.description,
          start_time: eventUpdate.startTime?.toISOString(),
          end_time: eventUpdate.endTime?.toISOString(),
          location: eventUpdate.location,
          type: eventUpdate.type,
          reminder: eventUpdate.reminder?.toISOString(),
          course_id: eventUpdate.courseId
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        events: state.events.map(event =>
          event.id === id
            ? {
                ...event,
                ...eventUpdate
              }
            : event
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error updating event:', error);
      set({ error: 'Failed to update event', isLoading: false });
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.filter(event => event.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ error: 'Failed to delete event', isLoading: false });
    }
  }
}));