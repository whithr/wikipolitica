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

export const Map = () => {
  const { resolvedTheme } = useTheme()
  const {
    isLoading,
    filteredData,
    selectedDayIndex,
    setSelectedDayIndex,
    highlightDay,
    highlightTime,
  } = usePresidentCalendar()

  // State to track if the popup should close
  const [shouldClosePopup, setShouldClosePopup] = useState(false)

  // 1) State to track whether we are "playing"
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(3000) // Default playback speed: 3 seconds

  // 2) Whenever isPlaying = true, increment selectedDayIndex every second
  useEffect(() => {
    if (!isPlaying) return

    const intervalId = setInterval(() => {
      setSelectedDayIndex((prev: number) => {
        if (prev >= filteredData.length - 1) {
          setIsPlaying(false) // Stop playing if we're at the last index
          return prev
        }
        return prev + 1
      })
    }, playbackSpeed)

    return () => clearInterval(intervalId)
  }, [isPlaying, playbackSpeed, filteredData.length, setSelectedDayIndex])

  // 3) Stop the "animation" if user manually changes the slider or clicks a marker
  const handleUserAction = useCallback(
    (newIndex: number) => {
      setIsPlaying(false)
      setShouldClosePopup(true)
      setSelectedDayIndex(newIndex)
    },
    [setSelectedDayIndex]
  )

  // Extract only the events that have lat/long
  const eventsWithCoords = useMemo(() => {
    return filteredData.filter((evt) => {
      return evt.latitude != null && evt.longitude != null
    })
  }, [filteredData])

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

  const createPingIcon = (shouldHighlight: boolean, index: number) =>
    new DivIcon({
      html: renderToStaticMarkup(
        <ActivityPing
          shouldHighlight={shouldHighlight}
          shouldAnimate={index === selectedDayIndex}
          className='!m-0'
        />
      ),
      className: 'custom-icon', // Optional: custom wrapper styles
      iconAnchor: [8, 0], // Center the icon
    })

  // Determine the position of the selected event
  const selectedPosition = useMemo(() => {
    if (
      selectedDayIndex >= 0 &&
      selectedDayIndex < eventsWithCoords.length &&
      eventsWithCoords[selectedDayIndex]
    ) {
      return [
        eventsWithCoords[selectedDayIndex].latitude,
        eventsWithCoords[selectedDayIndex].longitude,
      ] as [number, number]
    }
    return firstCoords
  }, [selectedDayIndex, eventsWithCoords, firstCoords])

  if (isLoading) {
    return <p>Loading map...</p>
  }

  return (
    <div className='flex flex-col'>
      {/* <div className='h-8 bg-background'> hello</div> */}
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

          {/* Update the map's center when the selected index changes */}
          <MapCenterUpdater
            position={selectedPosition}
            shouldClosePopup={shouldClosePopup}
          />

          {/* Place a Marker for each event with coords */}
          {eventsWithCoords.map((evt, i) => {
            const eventTimeInMins = parseTimeToMinutes(evt.time)
            const shouldHighlight =
              highlightDay === evt.date && highlightTime === eventTimeInMins

            return (
              <Marker
                key={i}
                position={[evt.latitude!, evt.longitude!]}
                icon={createPingIcon(shouldHighlight, i)}
                eventHandlers={{
                  click: () => handleUserAction(i),
                }}
              >
                <Popup>
                  <div className='flex flex-col gap-1'>
                    <div className='font-semibold'>
                      <span className='font-semibold'>{evt.date}</span> -{' '}
                      {evt.time_formatted}
                    </div>
                    {/* <p>Location: {evt.location}</p> */}
                    <div>{evt.details}</div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
      <div className='z-10 mx-6 -mt-14 flex flex-row gap-2 rounded-sm bg-background/50 bg-clip-padding px-2 py-1 backdrop-blur-sm backdrop-filter'>
        <Button
          size='icon'
          variant={isPlaying ? 'default' : 'outline'}
          className='min-w-9'
          onClick={() => {
            // If we press play and are already at the last index, reset to 0
            if (selectedDayIndex >= filteredData.length - 1) {
              setSelectedDayIndex(0)
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
          onClick={() => setIsPlaying(false)} // Toggle speed
        >
          <Pause />
        </Button>
        <Slider
          defaultValue={[filteredData.length - 1]}
          value={[selectedDayIndex]}
          max={filteredData.length - 1}
          step={1}
          onValueChange={(value) => {
            handleUserAction(value[0])
          }}
        />
      </div>
    </div>
  )
}
