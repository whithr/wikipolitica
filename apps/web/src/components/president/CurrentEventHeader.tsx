import { usePresidentCalendar } from '@/components/president/president-calendar-context'
import { formatDate } from '@/lib/time.utils'
import { Separator } from '@/components/ui/separator'
import { WordExplainer } from '@/components/word-explainer'
import potusSeal from '@/assets/potus-seal.png'
import { removeBrackets } from '@/lib/utils'
import { SourceTooltip } from '../source-tooltip'
import { Skeleton } from '../ui/skeleton'

export const CurrentEventHeader = () => {
  const { isLoading, filteredData, selectedDayId } = usePresidentCalendar()

  const selectedEvent = filteredData.find((evt) => evt.id === selectedDayId)

  return (
    <div className='flex flex-col gap-2 px-0 md:px-8'>
      <div className='relative flex min-h-[145px] items-center gap-4 rounded-md border border-border bg-background p-4 text-foreground shadow-sm transition-all dark:border-primary/50 md:min-h-[155px] lg:min-h-[140px] xl:min-h-[105px]'>
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
              />
              {isLoading ? (
                <div className='flex flex-col gap-2'>
                  <Skeleton className='h-8 w-[400px] rounded-full' />
                  <Skeleton className='h-4 w-[200px] rounded-full' />
                </div>
              ) : (
                selectedEvent && (
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
                )
              )}
            </div>
          </div>

          <Separator />

          {isLoading ? (
            <Skeleton className='h-8 w-[400px] rounded-full' />
          ) : (
            selectedEvent && (
              <div className='text-foreground'>
                <WordExplainer text={removeBrackets(selectedEvent.details)} />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
