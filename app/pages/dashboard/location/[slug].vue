<script lang="ts" setup>
const route = useRoute()

const mapStore = useMyMapStore()
const locationStore = useMyLocationsStore()
const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore)

watch(
  () => route.params.slug,
  (slug) => {
    if (
      route.name === 'dashboard-location-slug' &&
      slug &&
      slug !== 'undefined'
    ) {
      locationStore.currentLocationRefresh()
    }
  },
  { immediate: true },
)

effect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value.data]
  }
})
</script>

<template>
  <div class="h-44 p-4">
    <div v-if="status === 'pending'">Loading</div>
    <div v-if="!location?.data && location?.data === null">
      No location found
    </div>
    <div
      v-if="
        route.name === 'dashboard-location-slug' &&
        location &&
        status !== 'pending'
      "
    >
      <h1>{{ location.data.name }}</h1>
      <p>{{ location.data.description }}</p>
      <p
        v-if="!location.data?.locationLogs?.length"
        class="mt-4 text-sm italic"
      >
        Add a location log to get start
      </p>
      <UButton
        type="button"
        variant="outline"
        class="my-2 px-6 py-2"
        trailing-icon="i-lucide:map-pin-plus"
      >
        Add location log
      </UButton>
    </div>
    <div v-if="error && status !== 'pending'" class="text-error">
      {{ error.statusMessage }}
    </div>
  </div>
</template>
