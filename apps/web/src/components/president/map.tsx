import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useTheme } from '@/components/theme-provider'
// import { Slider } from '@/components/ui/slider'
import { useState, useEffect } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch'
import { useDebounce } from '@/hooks/useDebounce'

// var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
//https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png
export const Map = ({ location }: { location: string }) => {
  const { resolvedTheme } = useTheme()

  const [coords, setCoords] = useState<[number, number] | null>(null)
  const debouncedLocation = useDebounce(location, 5000)

  useEffect(() => {
    if (!debouncedLocation) return

    // 2. Once the debounced location is stable for 1s, geocode it
    const provider = new OpenStreetMapProvider()
    provider
      .search({ query: debouncedLocation })
      .then((results) => {
        if (results && results.length > 0) {
          // Note: leaflet-geosearch returns { x: lon, y: lat }
          const { x, y } = results[0]
          setCoords([y, x])
        } else {
          console.warn('No geocoding results found for:', debouncedLocation)
        }
      })
      .catch((err) => console.error('Geocoding error:', err))
  }, [debouncedLocation])

  const fallbackCenter: [number, number] = [39.8283, -98.5795] // roughly the center of the US

  return (
    <div
      className='z-10 flex h-[250px] flex-col gap-4 rounded-md bg-background shadow-md md:h-[500px]'
      id='map'
    >
      <MapContainer
        center={coords || fallbackCenter}
        zoom={coords ? 13 : 4}
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

        {/* 
        4. Provide a search control from react-leaflet-geosearch
           so the user can search for other addresses, too.
           This will place a search box on the map. 
      */}
        {/* <GeoSearchControlElement
          provider={new OpenStreetMapProvider()}
          showMarker={true}
          showPopup={true}
          popupFormat={({ query, result }) => result.label}
          maxMarkers={1}
          retainZoomLevel={false}
          animateZoom={true}
          autoClose={true}
          searchLabel='Enter location'
          keepResult={true}
        /> */}

        {/* 5. If we got coordinates from geocoding, place a Marker and Popup */}
        {coords && (
          <Marker position={coords}>
            <Popup>{location}</Popup>
          </Marker>
        )}
      </MapContainer>
      {/* <Slider defaultValue={[33]} max={100} step={1} /> */}
    </div>
  )
}
