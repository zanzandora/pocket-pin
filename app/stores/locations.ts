import { defineStore } from 'pinia'

import type { ApiResponeType } from '~/types/api-respone.type'
import type { LocationType } from '~/types/location.type'

export const useMyLocationsStore = defineStore('locations', () => {
  const {
    data: locations,
    status,
    refresh,
  } = useFetch<ApiResponeType<LocationType[]>>('/api/location', {
    lazy: true,
  })

  const sidebarStore = useMySidebarStore()

  watchEffect(() => {
    if (locations.value?.data) {
      sidebarStore.sidebarItems = locations.value.data.map((location) => ({
        label: location?.name ?? 'Unknown',
        icon: 'i-lucide-map',
        to: `/dashboard`,
      }))
    }
  })

  return {
    locations,
    status,
    refresh,
  }
})
