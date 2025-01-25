import { DailyItinerary } from '@/components/president/daily-itinerary'
// import { Skeleton } from '@/components/ui/skeleton'
import { Map } from '@/components/president/map'
import { createLazyFileRoute } from '@tanstack/react-router'

const President = () => {
  return (
    <div className='flex flex-col gap-4 p-2'>
      {/* <Skeleton className='h-[500px] w-full shadow-md' /> */}
      <Map />
      <DailyItinerary />
    </div>
  )
}

export const Route = createLazyFileRoute('/executive/president')({
  component: President,
})
