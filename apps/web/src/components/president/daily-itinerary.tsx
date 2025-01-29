// DailyItinerary.tsx

import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ActivityPing } from '@/components/animations/activity-ping'

import { formatDate, parseTimeToMinutes } from '@/lib/time.utils'

import { usePresidentCalendar } from './president-calendar-context'

export const DailyItinerary = () => {
  const {
    isLoading,
    filteredData,
    sortedDays,
    sortedEventsByDay,
    highlightDay,
    highlightTime,
    selectedDayId,
  } = usePresidentCalendar()

  if (isLoading) return <p>Loading...</p>
  if (!filteredData || filteredData.length === 0)
    return <p>No data available.</p>

  return (
    <div className='flex flex-col gap-4 text-foreground'>
      {/* Top controls */}
      <div className='flex flex-wrap items-center justify-center gap-2 rounded-md bg-background p-4 text-center shadow-sm'>
        <h2 className='mx-2 whitespace-nowrap text-xl font-semibold'>
          Presidential Daily Schedule
        </h2>
        <DatePickerWithRange />
      </div>

      {/* List of grouped & sorted events */}
      <div className='flex flex-col gap-10 rounded-md bg-background p-2 pt-4 shadow-sm'>
        {sortedDays.map((date) => {
          const dayEvents = sortedEventsByDay[date]

          return (
            <div key={date} className='flex flex-col gap-2'>
              <h2 className='px-4 text-lg font-semibold'>{formatDate(date)}</h2>
              <Separator />

              {dayEvents.map((event, index) => {
                // Optionally hide certain no-info events
                const isIgnoredEvent =
                  (!event.time_formatted &&
                    !event.video_url &&
                    !event.details) ||
                  event.details ===
                    'No official presidential schedule released or announced.'
                if (isIgnoredEvent) return null

                const eventTimeInMins = parseTimeToMinutes(event.time)
                const shouldHighlight =
                  highlightDay === date && highlightTime === eventTimeInMins

                return (
                  <div
                    key={index}
                    className='flex flex-row items-center gap-3 py-2'
                  >
                    <ActivityPing
                      shouldHighlight={shouldHighlight}
                      shouldAnimate={selectedDayId === event.id}
                    />

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
