<script setup lang="ts">
const links = ref([
  {
    label: 'Add Location',
    to: '/dashboard/add',
    icon: 'i-lucide-circle-plus',
  },
])

const { locations, locationsStatus } = storeToRefs(useMyLocationsStore())
const mapStore = useMyMapStore()

onMounted(() => {
  useMyLocationsStore().locationsRefresh()
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
        <div
          :key="item._id"
          class="rounded-lg border-2 transition-colors duration-200"
          :class="{
            'border-pink-500': mapStore.selectedPoint?._id === item._id,
            'border-transparent': mapStore.selectedPoint?._id !== item._id,
          }"
          @mouseenter="
            mapStore.selectedPoint = createMapPointFromLocation(item)
          "
          @mouseleave="mapStore.selectedPoint = null"
        >
          <NuxtLink
            :to="{
              name: 'dashboard-location-slug',
              params: { slug: item.slug },
            }"
          >
            <UCard
              variant="subtle"
              :ui="{
                header: 'sm:px-4 p-2',
                body: 'sm:px-4 p-2',
                root: 'hover:cursor-pointer',
              }"
            >
              <template #header>
                <h1 class="text-xl">{{ item?.name }}</h1>
              </template>

              <p class="text-sm">
                {{ item?.description || 'There is nothing to desc' }}
              </p>
            </UCard>
          </NuxtLink>
        </div>
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
