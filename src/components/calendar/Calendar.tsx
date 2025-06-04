import React, { useState, useRef, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import multiMonthPlugin from '@fullcalendar/multimonth';
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, FileDown, FileUp, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EventModal } from './EventModal';
import { CalendarEvent } from '../../types';

// 1. Use a constant for event types to avoid typos and magic strings.
const EVENT_TYPES = [
  { key: 'all', label: 'All', color: 'gray' },
  { key: 'exam', label: 'Exams', color: 'red' },
  { key: 'study', label: 'Study', color: 'blue' },
  { key: 'deadline', label: 'Deadlines', color: 'amber' },
] as const;

type EventType = typeof EVENT_TYPES[number]['key'];

interface CalendarProps {
  events: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}) => {
  const calendarRef = useRef<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState<EventType[]>(['all']);
  // Extra: states for loading, success, error (import/export/sync)
  const [loading, setLoading] = useState(false);

  // 2. Handle filters better with toggle logic.
  const handleFilterChange = (type: EventType) => {
    if (type === 'all') {
      setActiveFilters(['all']);
      return;
    }
    setActiveFilters((prev) => {
      // Remove 'all' if any specific filter is toggled
      let next = prev.filter((t) => t !== 'all');
      if (next.includes(type)) {
        next = next.filter((t) => t !== type);
        // If no filters remain, fallback to 'all'
        if (next.length === 0) return ['all'];
      } else {
        next.push(type);
      }
      return next;
    });
  };

  // 3. Memoize filteredEvents for performance.
  const filteredEvents = useMemo(() => {
    if (activeFilters.includes('all')) return events;
    return events.filter(e => activeFilters.includes(e.type as EventType));
  }, [events, activeFilters]);

  const calendarEvents = useMemo(
    () =>
      filteredEvents.map(event => ({
        id: event.id,
        title: event.title,
        start: event.startTime,
        end: event.endTime,
        classNames: [`event-${event.type}`],
        extendedProps: {
          location: event.location,
          description: event.description,
          type: event.type,
        },
      })),
    [filteredEvents]
  );

  const handleDateSelect = (selectInfo: any) => {
    setSelectedDate(selectInfo.start);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(events.find(e => e.id === clickInfo.event.id) || null);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
    setSelectedEvent(null);
  };

  const handleEventSave = (event: CalendarEvent) => {
    selectedEvent ? onEventUpdate?.(event) : onEventAdd?.(event);
    handleModalClose();
  };

  // 4. Async-friendly: feedback for import/export/sync
  const handleExportCalendar = async () => {
    setLoading(true);
    try {
      const calendar = calendarRef.current?.getApi();
      const events = calendar.getEvents();
      // TODO: implement iCal export
      // Use FileSaver or download API here for actual download
      console.log('Exporting events:', events);
      // Success feedback (toast/snackbar)
    } catch (err) {
      // Error feedback
      console.error('Export failed', err);
    }
    setLoading(false);
  };

  const handleImportCalendar = async () => {
    setLoading(true);
    try {
      // TODO: implement import logic
      console.log('Importing calendar...');
    } catch (err) {
      // Error feedback
      console.error('Import failed', err);
    }
    setLoading(false);
  };

  const handleSyncCalendar = async () => {
    setLoading(true);
    try {
      // TODO: implement sync logic
      console.log('Syncing calendar...');
    } catch (err) {
      // Error feedback
      console.error('Sync failed', err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <motion.div
        className="flex flex-wrap items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleAddEvent}
            disabled={loading}
          >
            Add Event
          </Button>
          <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
            {EVENT_TYPES.map(({ key, label, color }) => (
              <FilterButton
                key={key}
                active={activeFilters.includes(key)}
                onClick={() => handleFilterChange(key)}
                color={color}
              >
                {label}
              </FilterButton>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileDown className="h-4 w-4" />}
            onClick={handleExportCalendar}
            loading={loading}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileUp className="h-4 w-4" />}
            onClick={handleImportCalendar}
            loading={loading}
          >
            Import
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={handleSyncCalendar}
            loading={loading}
          >
            Sync
          </Button>
        </div>
      </motion.div>
      <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
              multiMonthPlugin,
              googleCalendarPlugin,
            ]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear'
            }}
            events={calendarEvents}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="700px"
            stickyHeaderDates={true}
            nowIndicator={true}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            eventDidMount={(info) => {
              // Optional: use Tippy.js for tooltips (cleaner UX)
              // See https://atomiks.github.io/tippyjs/ for implementation
            }}
          />
        </div>
      </Card>
      <AnimatePresence>
        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleEventSave}
            onDelete={onEventDelete}
            selectedDate={selectedDate}
            event={selectedEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable event content rendering
function renderEventContent(eventInfo: any) {
  return (
    <div className="p-1 overflow-hidden">
      <div className="font-medium truncate">{eventInfo.event.title}</div>
      {eventInfo.view.type !== 'dayGridMonth' && eventInfo.event.extendedProps.location && (
        <div className="text-xs opacity-75 truncate">
          {eventInfo.event.extendedProps.location}
        </div>
      )}
    </div>
  );
}

// 5. Better FilterButton
interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  color?: 'blue' | 'red' | 'amber' | 'purple' | 'gray';
}

const FilterButton: React.FC<FilterButtonProps> = ({
  children,
  active,
  onClick,
  color = 'blue',
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return (
    <motion.button
      type="button"
      aria-pressed={active}
      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
        active
          ? colorClasses[color]
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};
