import { defineStore } from 'pinia'

import type { MapType } from '~/types/map.type'

export const useMyMapStore = defineStore('myMapStore', () => {
  const mapPoints = ref<MapType[]>([])

  // init function to initialize the map with the first point
  // TODO: Map displays with appropriate zoom level
  // !Prevent render from server cus 2 lib only work on client side
  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl')
    const { LngLatBounds } = await import('maplibre-gl')

    const map = useMap()

    effect(() => {
      const firstPoint = mapPoints.value[0]
      if (!firstPoint) {
        return
      }

      const bounds = mapPoints.value.reduce(
        (bounds, point) => {
          return bounds.extend([point.long, point.lat])
        },
        new LngLatBounds(
          [firstPoint.long, firstPoint.lat],
          [firstPoint.long, firstPoint.lat],
        ),
      )

      map.map?.fitBounds(bounds, {
        padding: 60,
      })
    })
  }

  return {
    init,
    mapPoints,
  }
})
