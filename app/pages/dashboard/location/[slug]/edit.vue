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
  <u-dashboard-panel id="edit-location">
    <UContainer>
      <div class="max-w-5xl">
        <div class="px-4 pt-6">
          <h1 class="text-3xl font-semibold">Edit Location</h1>
          <p class="mt-2 text-sm">
            Update the location details. You can modify the name, description,
            and coordinates as needed.
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
        <DashboardFormsEditForm
          v-if="location?.data && status === 'success'"
          :location-id="route.params.slug as string"
          :initial-values="location.data"
          class="mt-4"
        />
      </div>
    </UContainer>
  </u-dashboard-panel>
</template>
