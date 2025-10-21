import { defineStore } from 'pinia'

import type { ApiResponeType } from '~/types/api-respone.type'
import type { LocationType } from '~/types/location.type'

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
      sidebarStore.sidebarItems = locations.value.data.map((location) => ({
        label: location?.name ?? 'Unknown',
        icon: 'i-lucide-map',
        to: `/dashboard`,
      }))

      mapStore.mapPoints = locations.value.data.map((location, index) => ({
        id: index,
        label: location?.name ?? 'Unknow name',
        lat: location?.latitude ?? 0,
        long: location?.longitude ?? 0,
      }))
    }
  })

  return {
    locations,
    status,
    refresh,
  }
})
