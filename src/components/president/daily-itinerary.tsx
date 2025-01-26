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
import { useState } from 'react'
import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { addDays, isAfter, isBefore } from 'date-fns'
import { DateRange } from 'react-day-picker'

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
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    // For example: last 7 days up to "tomorrow"
    from: addDays(new Date(), -6),
    to: addDays(new Date(), 1),
  })

  if (isLoading) return <p>Loading...</p>
  if (!data) return null

  // Filter by date range if we have from/to
  let filteredData = data
  if (selectedRange?.from && selectedRange?.to) {
    filteredData = data.filter((event) => {
      // event.date is "YYYY-MM-DD"
      // Turn it into a real Date at midnight local
      const eventDate = new Date(`${event.date}T00:00:00`)
      return (
        !isBefore(eventDate, selectedRange.from!) &&
        !isAfter(eventDate, selectedRange.to!)
      )
    })
  }

  // Group the filtered data by date
  const groupedByDate = filteredData.reduce<
    Record<string, PoolReportSchedule[]>
  >((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = []
    }
    acc[event.date].push(event)
    return acc
  }, {})

  const sortedDays = Object.keys(groupedByDate).sort(
    (a, b) => +new Date(`${b}T00:00:00`) - +new Date(`${a}T00:00:00`)
  )

  const sortedEventsByDay: Record<string, PoolReportSchedule[]> = {}
  for (const day of sortedDays) {
    // Sort descending by time (largest first)
    const dayEvents = [...groupedByDate[day]].sort((a, b) => {
      if (!a.time && !b.time) return 0
      if (!a.time) return 1 // no time => last
      if (!b.time) return -1
      return b.time.localeCompare(a.time) // desc
    })
    sortedEventsByDay[day] = dayEvents
  }

  // We'll compute highlightDay & highlightTime once
  let highlightDay: string | null = null
  let highlightTime: number | null = null

  const formatYMD = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  const localToday = formatYMD(new Date())
  const localNowInMinutes = getLocalNowInMinutes()

  // 6) If "today" is in sortedDays:
  //    a) Check if there's an event that already happened => highlight that
  //    b) If none found, highlight the last event from the previous day
  // 7) If "today" is not in sortedDays, highlight the last event from the
  //    latest day < today
  if (sortedDays.length > 0) {
    if (sortedDays.includes(localToday)) {
      // We do the "already passed event" logic
      const dayEvents = sortedEventsByDay[localToday]

      // Find the largest event time <= localNowInMinutes
      let foundOne = false
      for (const evt of dayEvents) {
        const evtMins = parseTimeToMinutes(evt.time)
        if (evtMins !== null && evtMins <= localNowInMinutes) {
          highlightDay = localToday
          highlightTime = evtMins
          foundOne = true
          break // because dayEvents are sorted descending, the first match is the largest
        }
      }

      // If no event has started yet, highlight the last event from the previous day
      if (!foundOne) {
        // find the index of localToday in sortedDays
        const idx = sortedDays.indexOf(localToday)
        if (idx > 0) {
          // previous day
          const prevDay = sortedDays[idx - 1]
          const prevEvents = sortedEventsByDay[prevDay]
          // The first item in prevEvents is the largest time because we sorted descending
          const lastEvent = prevEvents[0]
          highlightDay = prevDay
          highlightTime = parseTimeToMinutes(lastEvent.time)
        }
      }
    } else {
      // localToday is not in sortedDays
      // So we find the last day which is strictly < localToday
      // (Because sortedDays is ascending, we find the greatest day that is < localToday)
      // We'll do a simple loop from the end of the array
      let fallbackDay: string | null = null
      for (let i = sortedDays.length - 1; i >= 0; i--) {
        const d = sortedDays[i]
        if (d < localToday) {
          fallbackDay = d
          break
        }
      }
      if (fallbackDay) {
        // highlight the last event from fallbackDay
        const fallbackEvents = sortedEventsByDay[fallbackDay]
        const lastEvent = fallbackEvents[0] // sorted descending
        highlightDay = fallbackDay
        highlightTime = parseTimeToMinutes(lastEvent.time)
      }
    }
  }

  const parseEventDate = (d: string) => {
    return new Date(`${d}T00:00:00`)
  }

  const allDates = data.map((event) => parseEventDate(event.date))
  const minDate = new Date(Math.min(...allDates.map((d) => d.getTime())))
  const maxDate = new Date(Math.max(...allDates.map((d) => d.getTime())))

  return (
    <div className='flex flex-col gap-4 text-foreground'>
      <div className='flex flex-wrap items-center justify-center gap-2 rounded-md bg-background p-4 text-center shadow-sm'>
        <h2 className='mx-2 whitespace-nowrap text-xl font-semibold'>
          Presidential Daily Schedule
        </h2>

        <DatePickerWithRange
          initialRange={selectedRange}
          onChange={setSelectedRange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
      <div className='flex flex-col gap-10 rounded-md bg-background p-2 pt-4 shadow-sm'>
        {sortedDays.map((date) => {
          // We already have sortedEventsByDay[date]
          const dayEvents = sortedEventsByDay[date]

          return (
            <div key={date} className='flex flex-col gap-2'>
              <h2 className='px-4 text-lg font-semibold'>{formatDate(date)}</h2>
              <Separator />

              {dayEvents.map((event, index) => {
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
                  highlightDay === date && highlightTime === eventTimeInMins

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
