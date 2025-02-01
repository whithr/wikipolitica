import { CurrentEventHeader } from '@/components/president/CurrentEventHeader'
import { DailyItinerary } from '@/components/president/daily-itinerary'
// import { Skeleton } from '@/components/ui/skeleton'
import { Map } from '@/components/president/map'
import { PresidentCalendarProvider } from '@/components/president/president-calendar-context'
import { Outlet } from '@tanstack/react-router'

export const PresidentialSchedule = () => {
  // Then pass relevant props to each child
  return (
    <PresidentCalendarProvider>
      <div className='flex flex-1 flex-col gap-2 p-2 md:gap-4 md:p-4'>
        <CurrentEventHeader />
        <Map />
        <DailyItinerary />
        <Outlet />
      </div>
    </PresidentCalendarProvider>
  )
}
