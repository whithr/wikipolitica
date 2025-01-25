import { useQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import {
  formatDate,
  getLocalNowInMinutes,
  isLocalToday,
  parseTimeToMinutes,
} from '@/lib/time.utils'
import { ActivityPing } from '@/components/animations/activity-ping'

export interface DaySummary {
  trump_property?: string | null
  political_rally?: string | null
  golf?: string | null
  fundraiser?: string | null
  international?: string | null
}

export interface PoolReportSchedule {
  date: string // e.g., "2025-01-23"
  time?: string | null // e.g., "11:00:00"
  time_formatted?: string | null // e.g., "11:00 AM"
  year: number // e.g., 2025
  month: string // e.g., "January"
  day: number // e.g., 23
  day_of_week: string // e.g., "Thursday"
  type: string // e.g., "Pool Report Schedule"
  details: string // Event details
  location: string // Location of the event
  coverage: string // e.g., "In-Town Pool" or "Closed Press"
  daily_text: string // Additional text, if any
  url?: string | null // Optional URL for more information
  video_url?: string | null // Optional video URL
  day_summary?: DaySummary | null // Optional day summary object
  newmonth?: boolean // Indicates if this is the start of a new month
  daycount?: number | null // Optional count of days
  lastdaily: boolean // Indicates if this is the last daily event
}

export type PoolReportSchedules = PoolReportSchedule[]

const fetchTrumpCalendar = async (): Promise<PoolReportSchedules> => {
  const response = await fetch(
    'https://media-cdn.factba.se/rss/json/trump/calendar-full.json'
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const DailyItinerary = () => {
  const { data, isLoading } = useQuery<PoolReportSchedules>({
    queryKey: ['trumpCalendar'],
    queryFn: fetchTrumpCalendar,
  })

  if (isLoading) return <p>Loading...</p>
  if (!data) return null

  const groupedByDate = data.reduce<Record<string, PoolReportSchedule[]>>(
    (acc: Record<string, PoolReportSchedule[]>, event: PoolReportSchedule) => {
      if (!acc[event.date]) {
        acc[event.date] = []
      }
      acc[event.date].push(event)
      return acc
    },
    {}
  )

  // Get user's local time in minutes
  const localNowInMinutes = getLocalNowInMinutes()

  return (
    <div className='flex flex-col gap-4 text-foreground'>
      <div className='rounded-md bg-background p-4 text-center text-xl font-semibold shadow-md'>
        Presidential Daily Schedule
      </div>
      <div className='flex flex-col gap-10 rounded-md bg-background p-2 pt-4 shadow-md'>
        {Object.entries(groupedByDate).map(([date, events]) => {
          // Sort events descending by time
          const sortedEvents = [...events].sort((a, b) => {
            if (!a.time && !b.time) return 0
            if (!a.time) return 1 // no time => last
            if (!b.time) return -1 // no time => last
            // Desc by time: b.time.localeCompare(a.time)
            return b.time.localeCompare(a.time)
          })

          let highlightTime: number | null = null

          // If this date is "today" in the user's local time:
          if (isLocalToday(date)) {
            // Find the "largest event time <= localNowInMinutes"
            for (const evt of sortedEvents) {
              const evtMins = parseTimeToMinutes(evt.time)
              if (
                evtMins !== null &&
                evtMins <= localNowInMinutes &&
                (highlightTime === null || evtMins > highlightTime)
              ) {
                highlightTime = evtMins
              }
            }
          }

          return (
            <div key={date} className='flex flex-col gap-2'>
              <h2 className='px-4 text-lg font-semibold'>{formatDate(date)}</h2>
              <Separator />

              {sortedEvents.map((event, index) => {
                const isIgnoredEvent =
                  (!event.time_formatted &&
                    !event.video_url &&
                    !event.details) ||
                  event.details ===
                    'No official presidential schedule released or announced.'

                if (isIgnoredEvent) {
                  return null
                }

                const eventTimeInMins = parseTimeToMinutes(event.time)
                const shouldHighlight =
                  eventTimeInMins !== null && eventTimeInMins === highlightTime

                return (
                  <div
                    key={index}
                    className='flex flex-row items-center gap-3 py-2'
                  >
                    <ActivityPing shouldHighlight={shouldHighlight} />

                    <div className='flex flex-col'>
                      {event.time_formatted ? (
                        <div className='flex items-center gap-2 text-muted-foreground'>
                          {event.time_formatted} – {event.location}
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
                          Time TBD – {event.location}
                        </div>
                      )}
                      <p>{event.details}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
