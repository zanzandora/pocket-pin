<script setup lang="ts">
import type { MglEvent } from '@indoorequal/vue-maplibre-gl'
import type { LngLat } from 'maplibre-gl'

import { CENTER_VI } from '../../libs/constant'

const colorMode = useColorMode()
const mapStore = useMyMapStore()

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
)
const zoom = 5

function updateAddedPoint(location: LngLat) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.latitude = location.lat
    mapStore.addedPoint.longitude = location.lng
  }
}

function onDoubleClick(mglEvent: MglEvent<'dblclick'>) {
  if (mapStore.addedPoint) {
    mapStore.addedPoint.latitude = mglEvent.event.lngLat.lat
    mapStore.addedPoint.longitude = mglEvent.event.lngLat.lng
  }
}

onMounted(() => {
  mapStore.init()
})
</script>

<template>
  <MglMap
    :map-style="style"
    :center="CENTER_VI"
    :zoom="zoom"
    @map:dblclick="onDoubleClick"
  >
    <MglNavigationControl />

    <!-- Special Location Mark -->
    <MglMarker
      v-if="mapStore.addedPoint"
      draggable
      :coordinates="[
        mapStore.addedPoint.longitude,
        mapStore.addedPoint.latitude,
      ]"
      @update:coordinates="updateAddedPoint"
    >
      <template #marker>
        <UTooltip
          :content="{
            align: 'center',
            side: 'top',
            sideOffset: 8,
          }"
          :open="true"
          text="Drag to your desired location"
        >
          <UIcon
            class="text-warning cursor-pointer text-2xl"
            name="i-picon:marker"
          />
        </UTooltip>
      </template>
    </MglMarker>

    <!-- Location Marks -->
    <MglMarker
      v-for="point in mapStore.mapPoints"
      :key="point._id"
      :coordinates="[point.longitude, point.latitude]"
    >
      <template #marker>
        <UTooltip
          :content="{
            align: 'center',
            side: 'top',
            sideOffset: 8,
          }"
          :open="isPointSelected(point, mapStore.selectedPoint)"
          :delay-duration="0"
          :text="point.name"
        >
          <div
            @mouseenter="mapStore.selectedPoint = point"
            @mouseleave="mapStore.selectedPoint = null"
          >
            <UIcon
              class="cursor-pointer text-2xl"
              :class="
                isPointSelected(point, mapStore.selectedPoint)
                  ? 'text-pink-500'
                  : 'text-secondary'
              "
              name="i-picon:marker"
            />
          </div>
        </UTooltip>
      </template>
      <MglPopup>
        <h1 class="text-xl">{{ point.name }}</h1>
        <p>{{ point.description || '' }}</p>
        <div v-if="point.to" class="flex justify-end">
          <UButton :to="point.to" color="neutral" variant="link" class="pl-0">
            {{ point.toLabel || 'View' }}
          </UButton>
        </div>
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
