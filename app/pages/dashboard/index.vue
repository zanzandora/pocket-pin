<script setup lang="ts">
const links = ref([
  {
    label: 'Add Location',
    to: '/dashboard/add',
    icon: 'i-lucide-circle-plus',
  },
])

const locationStore = useMyLocationsStore()
const { locations, locationsStatus } = storeToRefs(locationStore)

onMounted(() => {
  locationStore.locationsRefresh()
})
</script>

<template>
  <div class="h-44 p-4">
    <div
      v-if="locationsStatus === 'pending'"
      class="flex flex-col gap-6 sm:flex-row"
    >
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="bg-elevated/50 ring-default divide-default h-28 w-full divide-y overflow-hidden rounded-lg ring"
      />
    </div>

    <div
      v-if="
        locationsStatus !== 'pending' &&
          locations?.data &&
          locations?.data.length > 0
      "
    >
      <UCarousel
        v-slot="{ item }"
        loop
        wheel-gestures
        :items="locations?.data"
        :ui="{
          item: 'basis-1/3',
        }"
      >
        <DashboardLocationCarouselCards
          :key="item._id"
          :map-point="createMapPointFromLocation(item)"
        />
      </UCarousel>
    </div>

    <UPageHero
      v-if="!locations?.data && locations?.data.length === 0"
      title="Don't have any locations ?"
      description="Add a new location to get start your journey now ! "
      :links="links"
      :ui="{ title: 'text-4xl sm:text-6xl' }"
    />
  </div>
</template>
