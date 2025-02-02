import { usePresidentCalendar } from '@/components/president/PresidentCalanderContext'
import { formatDate, parseTimeToMinutes } from '@/lib/time.utils'
import { Separator } from '@/components/ui/separator'
import { WordExplainer } from '@/components/WordExplainer'
import potusSeal from '@/assets/potus-seal.webp'
import { cn, removeBrackets } from '@/lib/utils'
import { SourceTooltip } from '../SourceTooltip'
import { Skeleton } from '../ui/skeleton'
import { usePresidentCalendarStore } from '@/stores/presidentCalendarStore'
import { useEffect } from 'react'

export const CurrentEventHeader = ({
  className,
  blockSourceTooltip,
}: {
  className?: string
  blockSourceTooltip?: boolean
}) => {
  const { isLoading, filteredData, highlightDay, highlightTime } =
    usePresidentCalendar()
  const selectedDayId = usePresidentCalendarStore(
    (state) => state.selectedDayId
  )
  const setSelectedDayId = usePresidentCalendarStore(
    (state) => state.setSelectedDayId
  )

  const selectedEvent = filteredData.find((evt) => evt.id === selectedDayId)

  useEffect(() => {
    if (filteredData.length > 0) {
      const potentialSelection = filteredData.findIndex(
        (d) =>
          parseTimeToMinutes(d.time) === highlightTime &&
          d.date === highlightDay
      )
      if (potentialSelection !== -1) {
        setSelectedDayId(filteredData[potentialSelection]?.id)
      } else {
        setSelectedDayId(filteredData[0]?.id)
      }
    }
  }, [filteredData, highlightTime, highlightDay, setSelectedDayId])

  return (
    <div className={cn('flex flex-col gap-2 px-0 md:px-8', className)}>
      <div className='relative flex min-h-[145px] items-center gap-4 rounded-md border border-border bg-background p-4 text-foreground shadow-sm transition-all dark:border-primary/50 md:min-h-[155px] lg:min-h-[140px] xl:min-h-[105px]'>
        {!blockSourceTooltip && (
          <SourceTooltip
            content={
              <div>
                Schedule from{' '}
                <a
                  href='https://rollcall.com/factbase/trump/calendar/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  FactBa.se
                </a>
              </div>
            }
          />
        )}
        <img
          src={potusSeal}
          className='hidden h-16 w-16 rounded-full shadow-sm md:block'
        />
        <div className='flex flex-col gap-2'>
          <div className='flex justify-between font-semibold'>
            <div className='flex gap-2'>
              <img
                src={potusSeal}
                className='block h-10 w-10 rounded-full shadow-sm md:hidden'
                alt='Potus Seal'
              />
              {isLoading ? (
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-8 w-[400px] rounded-full' />
                  <Skeleton className='h-4 w-[200px] rounded-full' />
                </div>
              ) : (
                selectedEvent && (
                  <div className='flex flex-col gap-0 text-balance'>
                    <p className=''>
                      {selectedEvent.location
                        ? selectedEvent.location
                        : 'No location provided'}{' '}
                    </p>
                    {selectedEvent.time_formatted ? (
                      <span className='text-xs font-normal'>
                        {formatDate(selectedEvent.date)} -{' '}
                        {selectedEvent.time_formatted}{' '}
                        <span className='text-xs'>EST</span>
                      </span>
                    ) : (
                      <span className='text-xs font-normal'>
                        {formatDate(selectedEvent.date)} - No time set
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>

          <Separator />

          {isLoading ? (
            <Skeleton className='h-8 w-[400px] rounded-full' />
          ) : (
            selectedEvent && (
              <div className='text-balance text-foreground'>
                <WordExplainer text={removeBrackets(selectedEvent.details)} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
