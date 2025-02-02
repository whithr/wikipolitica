import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

export const MapCenterUpdater = ({
  position,
  shouldClosePopup,
}: {
  position: [number, number]
  shouldClosePopup: boolean
}) => {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), {
        animate: true,
        duration: 1,
      })

      if (shouldClosePopup) {
        map.closePopup()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, map])

  return null
}
