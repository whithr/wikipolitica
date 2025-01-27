import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useTheme } from '@/components/theme-provider'
// import { Slider } from '@/components/ui/slider'
import { useMemo } from 'react'

import { usePresidentCalendar } from './president-calendar-context'

export const Map = () => {
  const { resolvedTheme } = useTheme()
  const { isLoading, filteredData } = usePresidentCalendar()

  // Extract only the events that have lat/long
  const eventsWithCoords = useMemo(() => {
    return filteredData.filter((evt) => {
      return evt.latitude != null && evt.longitude != null
    })
  }, [filteredData])

  if (isLoading) {
    return <p>Loading map...</p>
  }

  // Fallback if no coords found at all
  const fallbackCenter: [number, number] = [39.8283, -98.5795]
  // If we have at least one event, center on the first
  const firstCoords = eventsWithCoords.length
    ? ([eventsWithCoords[0].latitude, eventsWithCoords[0].longitude] as [
        number,
        number,
      ])
    : fallbackCenter

  const zoom = eventsWithCoords.length > 0 ? 5 : 4

  return (
    <div
      className='z-10 flex h-[250px] flex-col gap-4 rounded-md bg-background shadow-md md:h-[500px]'
      id='map'
    >
      <MapContainer
        center={firstCoords}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url={
            resolvedTheme === 'light'
              ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
              : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
          }
        />

        {/* Place a Marker for each event with coords */}
        {eventsWithCoords.map((evt, i) => (
          <Marker key={i} position={[evt.latitude!, evt.longitude!]}>
            <Popup>
              <div>
                <p>Date: {evt.date}</p>
                <p>Location: {evt.location}</p>
                <p>{evt.details}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
