import { DailyItinerary } from '@/components/president/daily-itinerary'
import { createLazyFileRoute } from '@tanstack/react-router'

const President = () => {
  return (
    <div className='p-2'>
      <DailyItinerary />
    </div>
  )
}

export const Route = createLazyFileRoute('/executive/president')({
  component: President,
})
