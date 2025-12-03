import type { LngLatBounds } from 'maplibre-gl'

import { defineStore } from 'pinia'

import type { MapType } from '~/types/map.type'

export const useMyMapStore = defineStore('myMapStore', () => {
  const mapPoints = ref<MapType[]>([])
  const selectedPoint = ref<MapType | null>(null)
  const addedPoint = ref<(MapType & { zoom?: number }) | null>(null)
  // const shouldFlyTo = ref(true)

  let bounds: LngLatBounds | null = null
  const padding: number = 60

  // function selectedPointWithoutFlyTo(point: MapType | null) {
  //   shouldFlyTo.value = false
  //   selectedPoint.value = point
  // }

  // init function to initialize the map with the first point
  // TODO: Map displays with appropriate zoom level
  // !Prevent render from server cus 2 lib only work on client side
  async function init() {
    const { useMap } = await import('@indoorequal/vue-maplibre-gl')
    const { LngLatBounds } = await import('maplibre-gl')

    const map = useMap()

    // Compute bounds from points and initially fit
    effect(() => {
      // Don't fit bounds when there's an addedPoint (in add mode)
      if (addedPoint.value) {
        return
      }

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
        maxZoom: 8,
      })
    })

    // Control flyTo/fitBounds based on selection and shouldFlyTo flag
    // effect(() => {
    //   if (addedPoint.value) return

    //   if (selectedPoint.value) {
    //     if (shouldFlyTo.value) {
    //       map.map?.flyTo({
    //         center: [
    //           selectedPoint.value.longitude,
    //           selectedPoint.value.latitude,
    //         ],
    //         zoom: 1,
    //         speed: 1,
    //         curve: 1,
    //         easing(t) {
    //           return t
    //         },
    //       })
    //     }
    //     // Reset flag so next selection can fly unless explicitly disabled
    //     shouldFlyTo.value = true
    //   }
    // })

    watch(
      addedPoint,
      (newValue, oldValue) => {
        if (newValue && !oldValue) {
          // When addedPoint is set (first time), fly to it
          map.map?.flyTo({
            center: [newValue.longitude, newValue.latitude],
            zoom: newValue.zoom || 6,
            speed: 2,
          })
        } else if (newValue && oldValue) {
          // When addedPoint coordinates change, fly to new location
          map.map?.flyTo({
            center: [newValue.longitude, newValue.latitude],
            speed: 1,
            zoom: newValue.zoom || 10,
          })
        }
      },
      {
        immediate: true,
      },
    )
  }

  return {
    init,
    mapPoints,
    addedPoint,
    selectedPoint,
  }
})
