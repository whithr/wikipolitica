import { usePresidentCalendar } from '@/components/president/president-calendar-context'
import { formatDate } from '@/lib/time.utils'
import { Separator } from '@/components/ui/separator'
import { WordExplainer } from '@/components/word-explainer'
import potusSeal from '@/assets/potus-seal.png'
import { removeBrackets } from '@/lib/utils'

export const CurrentEventHeader = () => {
  const { isLoading, filteredData, selectedDayId, highlightDay } =
    usePresidentCalendar()

  if (isLoading) return <p>Loading...</p>

  const selectedEvent = filteredData.find((evt) => evt.id === selectedDayId)
  if (!selectedEvent || !highlightDay) return null

  //   const eventDate = new Date(selectedEvent.date)
  //   const highlightDate = new Date(highlightDay)
  //   const eventTimeInMinutes = selectedEvent.time
  //     ? parseTimeToMinutes(selectedEvent.time)
  //     : null

  //   let statusLabel = 'Upcoming'
  //   let statusColor = 'bg-emerald-500 dark:bg-emerald-900'

  //   if (
  //     eventDate < highlightDate ||
  //     (highlightTime &&
  //       eventDate.getTime() === highlightDate.getTime() &&
  //       eventTimeInMinutes !== null &&
  //       eventTimeInMinutes < highlightTime)
  //   ) {
  //     statusLabel = 'Past'
  //     statusColor = 'bg-slate-500'
  //   } else if (
  //     eventDate.getTime() === highlightDate.getTime() &&
  //     eventTimeInMinutes !== null &&
  //     eventTimeInMinutes === highlightTime
  //   ) {
  //     statusLabel = 'Current'
  //     statusColor = 'bg-primary'
  //   }

  return (
    <div className='flex flex-col gap-2 px-0 md:px-8'>
      {/* {statusLabel && (
        <div
          className={`h-fit w-fit rounded-full px-3 py-1 text-xs text-white ${statusColor}`}
        >
          {statusLabel}
        </div>
      )} */}
      <div className='flex min-h-[185px] items-center gap-4 rounded-md border border-border bg-background p-4 text-foreground shadow-sm transition-all dark:border-primary/50 md:min-h-[165px] lg:min-h-[140px] xl:min-h-[105px]'>
        <img src={potusSeal} className='h-16 w-16 rounded-full shadow-sm' />
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between font-semibold'>
            <div className='flex flex-col gap-0'>
              <p className=''>{selectedEvent.location} </p>
              {selectedEvent.time_formatted ? (
                <span className='text-xs font-normal'>
                  {formatDate(selectedEvent.date)} -{' '}
                  {selectedEvent.time_formatted}
                </span>
              ) : (
                <span className='text-xs font-normal'>
                  {formatDate(selectedEvent.date)} - No time set
                </span>
              )}
            </div>
          </div>

          <Separator />

          <div className='text-foreground'>
            <WordExplainer text={removeBrackets(selectedEvent.details)} />
          </div>
        </div>
      </div>
    </div>
  )
}
