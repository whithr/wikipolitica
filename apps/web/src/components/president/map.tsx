import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useTheme } from '@/components/theme-provider'
import { Slider } from '@/components/ui/slider'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { DivIcon } from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'

import { usePresidentCalendar } from './president-calendar-context'
import { ActivityPing } from '../animations/activity-ping'
import { MapCenterUpdater } from './map-center-updater'
import { parseTimeToMinutes } from '@/lib/time.utils'
import { Button } from '../ui/button'
import { FastForward, Pause, Play } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { Skeleton } from '../ui/skeleton'
import { usePresidentCalendarStore } from '@/stores/presidentCalendarStore'

export const Map = () => {
  const { resolvedTheme } = useTheme()
  const { isLoading, filteredData, highlightDay, highlightTime } =
    usePresidentCalendar()

  const selectedDayId = usePresidentCalendarStore(
    (state) => state.selectedDayId
  )
  const setSelectedDayId = usePresidentCalendarStore(
    (state) => state.setSelectedDayId
  )

  // State to track if the popup should close
  const [shouldClosePopup, setShouldClosePopup] = useState(false)

  // 1) State to track whether we are "playing"
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(3000) // Default playback speed: 3 seconds

  // 2) Stop the "animation" if user manually changes the slider or clicks a marker
  const handleUserAction = useCallback(
    (newId: number) => {
      setIsPlaying(false)
      setShouldClosePopup(true)
      setSelectedDayId(newId)
    },
    [setSelectedDayId]
  )

  // Extract only the events that have lat/long
  const eventsWithCoords = useMemo(() => {
    return filteredData.filter((evt) => {
      return evt.latitude != null && evt.longitude != null
    })
  }, [filteredData])

  // 3) Whenever isPlaying = true, increment selectedDayIndex every second
  useEffect(() => {
    if (!isPlaying) return

    const intervalId = setInterval(() => {
      const { selectedDayId } = usePresidentCalendarStore.getState()

      // Find the index of the current event
      const currentIndex = eventsWithCoords.findIndex(
        (evt) => evt.id === selectedDayId
      )

      // If at the first event, stop the playback
      if (currentIndex <= 0) {
        setIsPlaying(false)
        return // Retain the current ID to prevent overflow
      }

      const newId = eventsWithCoords[currentIndex - 1]?.id ?? selectedDayId

      setSelectedDayId(newId)
    }, playbackSpeed)

    // Cleanup the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId)
  }, [
    isPlaying,
    eventsWithCoords,
    playbackSpeed,
    setIsPlaying,
    setSelectedDayId,
  ])

  // Fallback if no coords found at all
  const fallbackCenter = useMemo(
    () => [39.8283, -98.5795] as [number, number],
    []
  )

  const firstCoords = useMemo(() => {
    return eventsWithCoords.length
      ? ([eventsWithCoords[0].latitude, eventsWithCoords[0].longitude] as [
          number,
          number,
        ])
      : fallbackCenter
  }, [eventsWithCoords, fallbackCenter])

  const zoom = eventsWithCoords.length > 0 ? 5 : 4

  const createPingIcon = (shouldHighlight: boolean, id: number) =>
    new DivIcon({
      html: renderToStaticMarkup(
        <ActivityPing
          shouldHighlight={shouldHighlight}
          shouldAnimate={id === selectedDayId}
          variant='map'
          className='!m-0'
        />
      ),
      className: 'custom-icon', // Optional: custom wrapper styles
      iconAnchor: [8, 0], // Center the icon
    })

  // Determine the position of the selected event
  const selectedPosition = useMemo(() => {
    const selectedEvent = eventsWithCoords.find(
      (evt) => evt.id === selectedDayId
    )
    if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
      return [selectedEvent.latitude, selectedEvent.longitude] as [
        number,
        number,
      ]
    }
    return firstCoords
  }, [selectedDayId, eventsWithCoords, firstCoords])

  return (
    <div className='mb-4 flex flex-col'>
      {/* <div className='h-8 bg-background'> hello</div> */}
      {isLoading ? (
        <Skeleton className='h-[250px] w-full rounded-sm bg-foreground/10 p-4 md:h-[400px]' />
      ) : (
        <div
          className='z-10 flex h-[250px] flex-col gap-4 rounded-md bg-background shadow-md md:h-[400px]'
          id='map'
        >
          <MapContainer
            center={firstCoords}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: '500px', width: '100%' }}
          >
            <TileLayer
              key={`tilelayer-${resolvedTheme}`}
              url={
                resolvedTheme === 'light'
                  ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                  : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
              }
            />

            {/* Update the map's center when the selected index changes */}
            <MapCenterUpdater
              position={selectedPosition}
              shouldClosePopup={shouldClosePopup}
            />

            {/* Place a Marker for each event with coords */}
            {eventsWithCoords.map((evt) => {
              const eventTimeInMins = parseTimeToMinutes(evt.time)
              const shouldHighlight =
                highlightDay === evt.date && highlightTime === eventTimeInMins

              return (
                <Marker
                  key={evt.id}
                  position={[evt.latitude!, evt.longitude!]}
                  icon={createPingIcon(shouldHighlight, evt.id)}
                  eventHandlers={{
                    click: () => handleUserAction(evt.id),
                  }}
                >
                  <Popup>
                    <div className='flex flex-col gap-1'>
                      <div className='font-semibold'>
                        <span className='font-semibold'>{evt.date}</span> -{' '}
                        {evt.time_formatted}
                      </div>
                      <div>{evt.details}</div>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      )}
      <div className='z-10 mx-6 -mt-16 flex flex-row gap-2 rounded-sm bg-background/60 bg-clip-padding px-2 py-2 shadow-lg backdrop-blur-sm backdrop-filter'>
        <Button
          size='icon'
          variant={isPlaying ? 'default' : 'outline'}
          className='min-w-9'
          onClick={() => {
            // If we press play and are already at the last index, reset to 0
            if (selectedDayId === eventsWithCoords[0]?.id) {
              setSelectedDayId(
                eventsWithCoords[eventsWithCoords.length - 1]?.id
              )
            }
            setIsPlaying(!isPlaying)
          }}
        >
          <Play />
        </Button>
        <Button
          size='icon'
          variant={playbackSpeed === 1500 ? 'default' : 'outline'}
          className='min-w-9'
          onClick={() => setPlaybackSpeed(playbackSpeed === 3000 ? 1500 : 3000)} // Toggle speed
        >
          <FastForward />
        </Button>
        <Button
          size='icon'
          variant={isPlaying ? 'outline' : 'default'}
          className='min-w-9'
          onClick={() => setIsPlaying(!isPlaying)} // Toggle speed
        >
          <Pause />
        </Button>
        <Separator
          orientation='vertical'
          className='mx-2 w-auto bg-sidebar-border'
        />
        <Slider
          // Calculate the "reversed" value for the slider
          value={[
            eventsWithCoords.length -
              1 -
              eventsWithCoords.findIndex((evt) => evt.id === selectedDayId),
          ]}
          max={eventsWithCoords.length - 1}
          step={1}
          onValueChange={(value) => {
            // Map the reversed index back to the correct event ID
            const reversedIndex = eventsWithCoords.length - 1 - value[0]
            const newId = eventsWithCoords[reversedIndex]?.id

            if (newId != null) {
              handleUserAction(newId)
            }
          }}
        />
      </div>
    </div>
  )
}
