<script lang="ts" setup>
const route = useRoute()

const mapStore = useMyMapStore()
const locationStore = useMyLocationsStore()
const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore)

effect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value.data]
  }
})

onMounted(() => {
  locationStore.currentLocationRefresh()
})

onBeforeRouteUpdate((to) => {
  if (to.name === 'dashboard-location-slug') {
    locationStore.currentLocationRefresh()
  }
})
</script>

<template>
  <div class="h-44 p-4">
    <div
      v-if="status === 'pending' && route.name === 'dashboard-location-slug'"
    >
      Loading
    </div>

    <div v-if="!location?.data && location?.data === null">
      No location found
    </div>

    <div v-if="error && status !== 'pending'" class="text-error">
      {{ error.statusMessage }}
    </div>

    <div class="grid grid-cols-3">
      <div
        v-if="
          route.name === 'dashboard-location-slug' &&
            location &&
            status !== 'pending'
        "
      >
        <div class="flex">
          <h1>{{ location.data.name }}</h1>
          <DashboardLocationDropdownMenu class="mx-4" />
        </div>
        <p>{{ location.data.description }}</p>
        <div v-if="!location.data?.locationLogs?.length">
          <p class="mt-4 text-sm italic">Add a location log to get start</p>
          <UButton
            type="button"
            variant="outline"
            class="my-2 px-6 py-2"
            trailing-icon="i-lucide:map-pin-plus"
            :to="{
              name: 'dashboard-location-slug-add',
              params: { slug: route.params.slug },
            }"
          >
            Add location log
          </UButton>
        </div>
      </div>

      <div
        v-if="
          route.name === 'dashboard-location-slug' &&
            status !== 'pending' &&
            location?.data &&
            (location.data.locationLogs?.length ?? 0) > 0
        "
        class="relative col-span-2 px-4"
      >
        <USeparator orientation="vertical" size="sm" class="absolute left-0" />

        <UCarousel
          v-slot="{ item }"
          loop
          wheel-gestures
          :items="location?.data.locationLogs"
          :ui="{
            item: 'basis-1/3',
          }"
        >
          <DashboardLocationCarouselCards
            :key="item._id"
            :map-point="createMapPointFromLocationLog(item)"
          >
            <template #top>
              <span
                v-if="
                  formatDate(item.started_at)?.toString() !==
                    formatDate(item.ended_at)?.toString()
                "
                class="text-muted text-right text-xs italic"
              >
                {{ formatDate(item?.started_at) }} -
                {{ formatDate(item.ended_at) }}
              </span>
              <span v-else class="text-muted text-right text-xs italic">{{
                formatDate(item?.started_at)
              }}</span>
            </template>
          </DashboardLocationCarouselCards>
        </UCarousel>
      </div>
    </div>

    <div v-if="route.name !== 'dashboard-location-slug'">
      <NuxtPage />
    </div>
  </div>
</template>
