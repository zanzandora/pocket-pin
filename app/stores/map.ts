import type { LngLatBounds } from 'maplibre-gl'

import { defineStore } from 'pinia'

import type { MapType } from '~/types/map.type'

export const useMyMapStore = defineStore('myMapStore', () => {
  const mapPoints = ref<MapType[]>([])
  const selectedPoint = ref<MapType | null>(null)
  const shouldFlyTo = ref(true)

  let bounds: LngLatBounds | null = null
  const padding: number = 60

  function selectedPointWithoutFlyTo(point: MapType | null) {
    shouldFlyTo.value = false
    selectedPoint.value = point
  }

  // init function to initialize the map with the first point
  // TODO: Map displays with appropriate zoom level
  // !Prevent render from server cus 2 lib only work on client side
  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl')
    const { LngLatBounds } = await import('maplibre-gl')

    const map = useMap()

    // Compute bounds from points and initially fit
    effect(() => {
      const firstPoint = mapPoints.value[0]
      if (!firstPoint) {
        return
      }

      bounds = mapPoints.value.reduce(
        (b, point) => {
          return b.extend([point.longitude, point.latitude])
        },
        new LngLatBounds(
          [firstPoint.longitude, firstPoint.latitude],
          [firstPoint.longitude, firstPoint.latitude],
        ),
      )

      map.map?.fitBounds(bounds, {
        padding,
      })
    })

    // Control flyTo/fitBounds based on selection and shouldFlyTo flag
    effect(() => {
      if (selectedPoint.value && shouldFlyTo.value) {
        map.map?.flyTo({
          center: [selectedPoint.value.longitude, selectedPoint.value.latitude],
          zoom: 2,
          speed: 1,
          curve: 1,
          easing(t) {
            return t
          },
        })

        // Reset flag so next selection can fly unless explicitly disabled
        shouldFlyTo.value = true
      } else if (bounds && shouldFlyTo.value) {
        map.map?.fitBounds(bounds, {
          padding,
        })
      }
    })
  }

  return {
    init,
    mapPoints,
    selectedPoint,
    selectedPointWithoutFlyTo,
  }
})
