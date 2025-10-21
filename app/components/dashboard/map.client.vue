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
      :key="point.id"
      :coordinates="[point.long, point.lat]"
    >
      <template #marker>
        <UTooltip
          :content="{
            align: 'center',
            side: 'top',
            sideOffset: 8,
          }"
          :text="point.label"
        >
          <UIcon class="text-2xl text-pink-500" name="i-picon:marker" />
        </UTooltip>
      </template>
    </MglMarker>
  </MglMap>
</template>
