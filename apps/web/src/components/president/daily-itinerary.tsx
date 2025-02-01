import { DatePickerWithRange } from '@/components/ui/date-range-picker'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { ActivityPing } from '@/components/animations/activity-ping'

import { formatDate, parseTimeToMinutes } from '@/lib/time.utils'
import { usePresidentCalendar } from './president-calendar-context'
import { WordExplainer } from '../word-explainer'
import { SourceTooltip } from '../source-tooltip'
import { ExternalLink } from '../external-link'
import { Skeleton } from '../ui/skeleton'
import { usePresidentCalendarStore } from '@/stores/presidentCalendarStore'

import { toWords } from 'number-to-words'
import { OrderItineraryItem } from '../orders/order-itinerary-item'

export const DailyItinerary = () => {
  const {
    isLoading,
    isOrdersLoading,
    sortedDays,
    sortedEventsByDay,
    sortedOrdersByDay,
    highlightDay,
    highlightTime,
  } = usePresidentCalendar()

  const selectedDayId = usePresidentCalendarStore(
    (state) => state.selectedDayId
  )

  return (
    <div className='flex flex-col gap-2 text-foreground md:gap-4'>
      {/* Top controls */}
      <div className='flex flex-wrap items-center justify-center gap-2 rounded-md border border-border bg-background p-4 text-center shadow-sm'>
        <h2 className='mx-2 whitespace-nowrap text-xl font-semibold'>
          Presidential Daily Schedule
        </h2>
        <DatePickerWithRange />
      </div>

      {/* List of grouped & sorted events */}
      <div className='relative flex flex-col gap-10 rounded-md border border-border bg-background p-2 pt-4 shadow-sm'>
        <SourceTooltip
          content={
            <div>
              <p>
                Schedule from{' '}
                <ExternalLink
                  href='https://rollcall.com/factbase/trump/calendar/'
                  label='FactBa.se'
                />
              </p>
              <p>Geocodes from Google's Maps Geocoding API.</p>
              <p>
                Orders from{' '}
                <ExternalLink
                  href='https://www.archives.gov/'
                  label='National Archives'
                />{' '}
                &{' '}
                <ExternalLink
                  href='https://www.presidency.ucsb.edu/'
                  label='The American Presidency Project'
                />
              </p>
            </div>
          }
        />
        {isLoading || isOrdersLoading ? (
          <div className='flex flex-col gap-2'>
            <Skeleton className='h-6 w-2/12 rounded-sm' />
            <Skeleton className='h-6 w-4/12 rounded-sm' />
            <Separator />
            <Skeleton className='h-6 w-4/12 rounded-sm' />
            <Skeleton className='h-6 w-7/12 rounded-sm' />
            <Separator />
            <Skeleton className='h-6 w-5/12 rounded-sm' />
            <Skeleton className='h-6 w-9/12 rounded-sm' />
          </div>
        ) : (
          sortedDays.map((date) => {
            const dayEvents = sortedEventsByDay[date]
            const dayOrders = sortedOrdersByDay[date]
            const numberOfOrders = dayOrders ? dayOrders.length : 0

            return (
              <div key={date} className='flex flex-col gap-2'>
                <h2 className='w-full justify-between px-4 text-lg font-semibold'>
                  {formatDate(date)}
                  <span className='text-xs font-normal'>
                    {numberOfOrders > 0 && (
                      <div className='text-xs font-normal'>
                        <span className='capitalize'>
                          {toWords(numberOfOrders)}
                        </span>{' '}
                        executive{' '}
                        {numberOfOrders > 1 ? 'orders were' : 'order was'}{' '}
                        signed today
                      </div>
                    )}
                  </span>
                </h2>
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
                          <div className='flex flex-col gap-1 text-muted-foreground md:flex-row md:gap-2'>
                            {event.time_formatted} –{' '}
                            {event.location
                              ? event.location
                              : 'No location set'}
                            <div className='flex gap-2'>
                              {event.video_url && (
                                <Button
                                  asChild
                                  size='xs'
                                  variant='outline'
                                  special='darkBang'
                                >
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
                                <Button
                                  asChild
                                  size='xs'
                                  variant='outline'
                                  special='darkBang'
                                >
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
                          </div>
                        ) : (
                          <div className='flex gap-2 text-muted-foreground'>
                            Time not provided –{' '}
                            {event.location
                              ? event.location
                              : 'Location not provided'}
                          </div>
                        )}
                        <p>
                          {' '}
                          <WordExplainer text={event.details} />
                        </p>
                      </div>
                    </div>
                  )
                })}
                {numberOfOrders > 0 && (
                  <div className='flex flex-col gap-3'>
                    {dayOrders?.map((order) => (
                      <OrderItineraryItem order={order} key={order.id} />
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
