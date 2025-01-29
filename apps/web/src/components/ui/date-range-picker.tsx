'use client'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { usePresidentCalendar } from '@/components/president/president-calendar-context'

export function DatePickerWithRange() {
  // 1) Get everything from your context
  const { selectedRange, setSelectedRange, minDate, maxDate } =
    usePresidentCalendar()

  // 2) Display text for the button
  // The user might not have selected any range yet, so handle undefined carefully
  const getButtonLabel = (range: DateRange) => {
    if (!range?.from) return 'Pick a range of dates'
    if (range.to) {
      return `${format(range.from, 'LLL dd, y')} - ${format(range.to, 'LLL dd, y')}`
    } else {
      return format(range.from, 'LLL dd, y')
    }
  }

  // 3) Render
  return (
    <div className='grid gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'w-64 justify-start text-left font-normal',
              !selectedRange && 'text-muted-foreground'
            )}
            special='darkBang'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {getButtonLabel(selectedRange)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            numberOfMonths={1}
            // Show the selected range from context
            selected={selectedRange}
            onSelect={(range) => {
              if (range) setSelectedRange(range)
            }}
            // Restrict selection to these bounds
            minDate={minDate}
            maxDate={maxDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
