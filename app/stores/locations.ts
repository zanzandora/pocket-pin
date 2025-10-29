import { defineStore } from 'pinia'

import type { ApiResponeType } from '~/types/api-respone.type'
import type { LocationType } from '~/types/location.type'
import type { MapType } from '~/types/map.type'

export const useMyLocationsStore = defineStore('myLocationsStore', () => {
  const {
    data: locations,
    status,
    refresh,
  } = useFetch<ApiResponeType<LocationType[]>>('/api/location', {
    lazy: true,
  })

  const sidebarStore = useMySidebarStore()
  const mapStore = useMyMapStore()

  effect(() => {
    if (locations.value?.data) {
      const mapPoints: MapType[] = []
      const sidebarItems: SideBarItem[] = []

      locations.value.data.forEach((location) => {
        const mapPoint = createMapPointFromLocation(location)
        mapPoints.push(mapPoint)
        sidebarItems.push({
          label: location?.name ?? 'Unknown',
          icon: 'i-lucide-map',
          to: {
            name: 'dashboard-location-slug',
            params: { slug: location.slug },
          },
          slug: location.slug,
          _id: location._id,
          mapPoints: mapPoint,
        })
      })

      sidebarStore.sidebarItems = sidebarItems

      mapStore.mapPoints = mapPoints
    }
  })

  return {
    locations,
    status,
    refresh,
  }
})
