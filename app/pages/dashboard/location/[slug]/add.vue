<script lang="ts" setup>
const route = useRoute()
const router = useRouter()

const locationStore = useMyLocationsStore()
const {
  currentLocation: location,
  currentLocationStatus: status,
  currentLocationError: error,
} = storeToRefs(locationStore)

// Redirect if no location data
watch(
  [location, status],
  ([loc, stat]) => {
    if (stat === 'success' && !loc?.data) {
      router.push(`/dashboard/location/${loc?.data.slug}`)
    }
  },
  { immediate: true },
)

// Load location data
onMounted(() => {
  if (route.params.slug && route.params.slug !== 'undefined') {
    locationStore.currentLocationRefresh()
  }
})
</script>

<template>
  <u-dashboard-panel id="add-location-logs">
    <UContainer>
      <div class="max-w-5xl">
        <div class="px-4 pt-6">
          <h1 class="text-3xl font-semibold">Add Location Logs</h1>
          <p class="mt-2 text-sm">
            Add the location logs. You can add specific times you visited this
            location.
          </p>
        </div>

        <!-- Loading state -->
        <div v-if="status === 'pending'" class="px-4 pt-6">
          <div class="flex items-center justify-center py-8">
            <UIcon name="i-lucide:loader-2" class="animate-spin text-2xl" />
            <span class="ml-2">Loading location data...</span>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="error" class="px-4 pt-6">
          <div class="rounded-lg bg-red-50 p-4 text-red-700">
            <h3 class="font-semibold">Error loading location</h3>
            <p>{{ error.statusMessage }}</p>
          </div>
        </div>

        <!-- Edit form -->
        <DashboardFormsAddLocationLogForm
          v-if="location?.data && status === 'success'"
          :location-id="route.params.slug as string"
          class="mt-4"
        />
      </div>
    </UContainer>
  </u-dashboard-panel>
</template>
