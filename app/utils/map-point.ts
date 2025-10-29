import type { LocationType } from '~/types/location.type'
import type { MapType } from '~/types/map.type'

export function createMapPointFromLocation(location: LocationType): MapType {
  return {
    ...location,
    to: { name: 'dashboard-location-slug', params: { slug: location.slug } },
    toLabel: 'View',
  }
}

export function isPointSelected(
  item: Pick<MapType, '_id' | 'latitude' | 'longitude'> | null | undefined,
  selectedPoint: MapType | null | undefined,
) {
  if (!item || !selectedPoint) {
    return false
  }
  return (
    item._id === selectedPoint._id &&
    item.latitude === selectedPoint.latitude &&
    item.longitude === selectedPoint.longitude
  )
}
