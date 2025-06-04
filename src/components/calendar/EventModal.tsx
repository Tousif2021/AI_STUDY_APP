import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarEvent } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  selectedDate?: Date | null;
  event?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedDate,
  event,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CalendarEvent>({
    defaultValues: event || {
      startTime: selectedDate || new Date(),
      endTime: selectedDate || new Date(),
      type: 'study',
    },
  });

  if (!isOpen) return null;

  const onSubmit = (data: CalendarEvent) => {
    onSave({
      ...data,
      id: event?.id || Date.now().toString(),
      createdBy: '1', // Replace with actual user ID
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {event ? 'Edit Event' : 'Add Event'}
              </h3>

              <div className="space-y-4">
                <Input
                  label="Title"
                  error={errors.title?.message}
                  {...register('title', { required: 'Title is required' })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="datetime-local"
                    label="Start Time"
                    error={errors.startTime?.message}
                    {...register('startTime', { required: 'Start time is required' })}
                  />
                  <Input
                    type="datetime-local"
                    label="End Time"
                    error={errors.endTime?.message}
                    {...register('endTime', { required: 'End time is required' })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Event Type
                  </label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700"
                    {...register('type', { required: 'Event type is required' })}
                  >
                    <option value="study">Study Session</option>
                    <option value="exam">Exam</option>
                    <option value="deadline">Deadline</option>
                    <option value="meeting">Meeting</option>
                  </select>
                </div>

                <Input
                  label="Location (optional)"
                  {...register('location')}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    className="mt-1 block w-full px-3 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700"
                    rows={3}
                    {...register('description')}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200 dark:border-gray-700">
              <Button type="submit" leftIcon={<Save className="h-4 w-4" />}>
                {event ? 'Update' : 'Create'}
              </Button>
              {event && (
                <Button
                  type="button"
                  variant="danger"
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  onClick={() => onDelete?.(event.id)}
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};