import { DailyItinerary } from '@/components/president/daily-itinerary'
// import { Skeleton } from '@/components/ui/skeleton'
import { Map } from '@/components/president/map'
import { PresidentCalendarProvider } from '@/components/president/president-calendar-context'

import { createLazyFileRoute } from '@tanstack/react-router'

const President = () => {
  // Then pass relevant props to each child
  return (
    <PresidentCalendarProvider>
      <div className='flex flex-col gap-4 p-2'>
        <Map />
        <DailyItinerary />
      </div>
    </PresidentCalendarProvider>
  )
}

export const Route = createLazyFileRoute('/executive/president')({
  component: President,
})
