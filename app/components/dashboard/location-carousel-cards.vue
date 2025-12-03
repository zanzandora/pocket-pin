<script setup lang="ts">
import type { MapType } from '../../types/map.type'

defineProps<{
  mapPoint: MapType
}>()

const mapStore = useMyMapStore()
</script>

<template>
  <div
    :key="mapPoint._id"
    class="rounded-lg border-2 transition-colors duration-200"
    :class="{
      'border-pink-500': mapStore.selectedPoint?._id === mapPoint._id,
      'border-transparent': mapStore.selectedPoint?._id !== mapPoint._id,
    }"
    @mouseenter="mapStore.selectedPoint = mapPoint"
    @mouseleave="mapStore.selectedPoint = null"
  >
    <NuxtLink :to="mapPoint.to">
      <UCard
        variant="subtle"
        :ui="{
          header: 'sm:px-4 p-2',
          body: 'sm:px-4 p-2',
          root: 'hover:cursor-pointer',
        }"
      >
        <template #header>
          <slot name="top" />
          <h1 class="text-xl">{{ mapPoint?.name }}</h1>
        </template>

        <p class="text-sm">
          <slot name="content" />
          {{ mapPoint?.description || 'There is nothing to desc' }}
        </p>
      </UCard>
    </NuxtLink>
  </div>
</template>
