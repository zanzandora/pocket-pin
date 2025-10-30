import { defineStore } from 'pinia'

import type { ApiResponeType } from '~/types/api-respone.type'
import type { LocationType } from '~/types/location.type'
import type { MapType } from '~/types/map.type'

import type { SideBarItem } from './sidebar'

import { CURRENT_LOCATION_PAGES, LOCATION_PAGES } from '../libs/constant'
import { createMapPointFromLocation } from '../utils/map-point'

export const useMyLocationsStore = defineStore('myLocationsStore', () => {
  const route = useRoute()

  const {
    data: locations,
    status: locationsStatus,
    refresh: locationsRefresh,
  } = useFetch<ApiResponeType<LocationType[]>>('/api/location', {
    lazy: true,
  })

  const locationUrlWithSlug = computed(
    () => `/api/location/${route.params.slug}`,
  )

  const {
    data: currentLocation,
    status: currentLocationStatus,
    error: currentLocationError,
    refresh: currentLocationRefresh,
  } = useFetch<ApiResponeType<LocationType>>(() => locationUrlWithSlug.value, {
    lazy: true,
    immediate: false,
    server: false,
  })

  const sidebarStore = useMySidebarStore()
  const mapStore = useMyMapStore()

  effect(() => {
    if (
      locations.value?.data &&
      LOCATION_PAGES.has(route.name?.toString() || '')
    ) {
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
    } else if (
      currentLocation.value &&
      CURRENT_LOCATION_PAGES.has(route.name?.toString() || '')
    ) {
      sidebarStore.sidebarItems = []
      mapStore.mapPoints = [currentLocation.value.data]
    }
  })

  return {
    // Locations
    locations,
    locationsStatus,
    locationsRefresh,

    // location
    currentLocation,
    currentLocationStatus,
    currentLocationError,
    currentLocationRefresh,
  }
})
