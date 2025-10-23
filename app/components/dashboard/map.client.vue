<script setup lang="ts">
import { CENTER_VI } from '../../libs/constant'

const colorMode = useColorMode()
const mapStore = useMyMapStore()

const style = computed(() =>
  colorMode.value === 'dark'
    ? '/styles/dark.json'
    : 'https://tiles.openfreemap.org/styles/liberty',
)
const zoom = 5

onMounted(() => {
  mapStore.init()
})
</script>

<template>
  <MglMap :map-style="style" :center="CENTER_VI" :zoom="zoom">
    <MglNavigationControl />
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
          :open="mapStore.selectedPoint === point"
          :delay-duration="0"
          :text="point.name"
        >
          <div
            @mouseenter="mapStore.selectedPointWithoutFlyTo(point)"
            @mouseleave="mapStore.selectedPointWithoutFlyTo(null)"
          >
            <UIcon
              class="cursor-pointer text-2xl"
              :class="
                mapStore.selectedPoint === point
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
      </MglPopup>
    </MglMarker>
  </MglMap>
</template>
