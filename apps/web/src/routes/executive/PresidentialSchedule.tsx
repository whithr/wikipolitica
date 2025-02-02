import { CurrentEventHeader } from '@/components/president/CurrentEventHeader'
import { DailyItinerary } from '@/components/president/DailyItinerary'
import { LeafletMap } from '@/components/president/map'
import { Outlet } from '@tanstack/react-router'
export const PresidentialSchedule = () => {
  // Then pass relevant props to each child
  return (
    <div className='flex flex-1 flex-col gap-2 p-2 md:gap-4 md:p-4'>
      <CurrentEventHeader />
      <LeafletMap />
      <DailyItinerary />
      <Outlet />
    </div>
  )
}
