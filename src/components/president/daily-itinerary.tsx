import { useQuery } from '@tanstack/react-query';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';

export interface DaySummary {
  trump_property?: string | null;
  political_rally?: string | null;
  golf?: string | null;
  fundraiser?: string | null;
  international?: string | null;
}

export interface PoolReportSchedule {
  date: string; // e.g., "2025-01-23"
  time?: string | null; // e.g., "11:00:00"
  time_formatted?: string | null; // e.g., "11:00 AM"
  year: number; // e.g., 2025
  month: string; // e.g., "January"
  day: number; // e.g., 23
  day_of_week: string; // e.g., "Thursday"
  type: string; // e.g., "Pool Report Schedule"
  details: string; // Event details
  location: string; // Location of the event
  coverage: string; // e.g., "In-Town Pool" or "Closed Press"
  daily_text: string; // Additional text, if any
  url?: string | null; // Optional URL for more information
  video_url?: string | null; // Optional video URL
  day_summary?: DaySummary | null; // Optional day summary object
  newmonth?: boolean; // Indicates if this is the start of a new month
  daycount?: number | null; // Optional count of days
  lastdaily: boolean; // Indicates if this is the last daily event
}

export type PoolReportSchedules = PoolReportSchedule[];

const fetchTrumpCalendar = async (): Promise<PoolReportSchedules> => {
  const response = await fetch(
    'https://media-cdn.factba.se/rss/json/trump/calendar-full.json'
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const formatDate = (dateString: string): string => {
  // Split the date string and manually construct the date to avoid time zone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Month is zero-indexed

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const DailyItinerary = () => {
  const { data, isLoading } = useQuery(['trumpCalendar'], fetchTrumpCalendar);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <></>;

  const groupedByDate = data.reduce(
    (acc, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    },
    {} as Record<string, PoolReportSchedule[]>
  );

  return (
    <div className='p-2 bg-background shadow-md rounded-md'>
      {Object.entries(groupedByDate).map(([date, events]) => {
        // Sort events in descending order by time (later times first)
        const sortedEvents = [...events].sort((a, b) => {
          if (!a.time && !b.time) return 0; // Both have no time
          if (!a.time) return 1; // Events without a time come last
          if (!b.time) return -1; // Events without a time come last
          return b.time.localeCompare(a.time); // Descending order
        });

        console.log(sortedEvents);

        return (
          <div key={date} className='flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>{formatDate(date)}</h2>
            <Separator />
            {!sortedEvents && <p>No events scheduled for {date}</p>}
            {sortedEvents.map(
              (event, index) =>
                (event.time_formatted || event.video_url || event.details) &&
                event.details !==
                  'No official presidential schedule released or announced.' && (
                  <div key={index} className='flex flex-col py-2'>
                    <div className='flex flex-col'>
                      {/* Display time if available */}
                      {event.time_formatted ? (
                        <div className='flex gap-2 text-muted-foreground items-center'>
                          {event.time_formatted} - {event.location}
                          <div className='flex-1' />
                          {event.video_url && (
                            <Button asChild size='xs' variant='outline'>
                              <Link
                                to={event.video_url}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                Watch Video
                              </Link>
                            </Button>
                          )}
                          {event.url && (
                            <Button asChild size='xs' variant='outline'>
                              <Link
                                to={event.url}
                                target='_blank'
                                rel='noopener noreferrer'
                              >
                                More Info
                              </Link>
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className='flex gap-2 text-muted-foreground'>
                          No time set - {event.location}
                        </div>
                      )}
                      <p>{event.details}</p>
                    </div>
                  </div>
                )
            )}
          </div>
        );
      })}
    </div>
  );
};
