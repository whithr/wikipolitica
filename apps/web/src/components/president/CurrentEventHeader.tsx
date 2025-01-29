import { usePresidentCalendar } from '@/components/president/president-calendar-context'
import { formatDate, parseTimeToMinutes } from '@/lib/time.utils'
import { Separator } from '../ui/separator'

export const CurrentEventHeader = () => {
  const {
    isLoading,
    filteredData,
    selectedDayId,
    highlightDay,
    highlightTime,
  } = usePresidentCalendar()

  if (isLoading) return <p>Loading...</p>

  const selectedEvent = filteredData.find((evt) => evt.id === selectedDayId)
  if (!selectedEvent || !highlightDay) return null

  const eventDate = new Date(selectedEvent.date)
  const highlightDate = new Date(highlightDay)
  const eventTimeInMinutes = selectedEvent.time
    ? parseTimeToMinutes(selectedEvent.time)
    : null

  let statusLabel = 'Upcoming'
  let statusColor = 'bg-blue-500 dark:bg-blue-900'

  if (
    eventDate < highlightDate ||
    (highlightTime &&
      eventDate.getTime() === highlightDate.getTime() &&
      eventTimeInMinutes !== null &&
      eventTimeInMinutes < highlightTime)
  ) {
    statusLabel = 'Past'
    statusColor = 'bg-slate-500'
  } else if (
    eventDate.getTime() === highlightDate.getTime() &&
    eventTimeInMinutes !== null &&
    eventTimeInMinutes === highlightTime
  ) {
    statusLabel = 'Current'
    statusColor = 'bg-green-500 dark:bg-green-700'
  }

  return (
    <div className='flex flex-col gap-2 rounded-md bg-background p-4 text-foreground shadow-sm'>
      <div className='flex justify-between font-semibold'>
        <div className='flex flex-col gap-0'>
          <span>{selectedEvent.location} </span>
          {selectedEvent.time_formatted ? (
            <span className='text-xs font-normal'>
              {formatDate(selectedEvent.date)} - {selectedEvent.time_formatted}
            </span>
          ) : (
            <span className='text-xs font-normal'>
              {formatDate(selectedEvent.date)} - No time set
            </span>
          )}
        </div>
        {statusLabel && (
          <div
            className={`h-fit rounded-full px-3 py-1 text-xs text-white ${statusColor}`}
          >
            {statusLabel}
          </div>
        )}
      </div>

      <Separator />

      <div className='text-foreground'>{selectedEvent.details}</div>
    </div>
  )
}
