<script setup lang="ts">
const links = ref([
  {
    label: 'Add Location',
    to: '/dashboard/add',
    icon: 'i-lucide-circle-plus',
  },
])
const locationStore = useMyLocationsStore()

const { locations, status } = storeToRefs(locationStore)

onMounted(() => {
  locationStore.refresh()
})
</script>

<template>
  <UMain class="min-h-auto mx-2 my-4">
    <div v-if="status === 'pending'" class="flex flex-col gap-6 sm:flex-row">
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="bg-elevated/50 ring-default divide-default h-28 w-full divide-y overflow-hidden rounded-lg ring"
      />
    </div>

    <div
      v-if="
        status !== 'pending' && locations?.data && locations?.data.length > 0
      "
    >
      <UCarousel
        v-slot="{ item }"
        loop
        wheel-gestures
        :items="locations?.data"
        :ui="{ item: 'basis-1/3' }"
      >
        <UCard
          variant="subtle"
          :ui="{ header: 'sm:px-4 p-2', body: 'sm:px-4 p-2' }"
        >
          <template #header>
            <h1 class="text-xl">{{ item?.name }}</h1>
          </template>

          <p class="text-sm">
            {{ item?.description || ' There is nothing to desc' }}
          </p>
        </UCard>
      </UCarousel>
    </div>

    <UPageHero
      v-else
      title="Don't have any locations ?"
      description="Add a new location to get start your journey now ! "
      :links="links"
      :ui="{ title: 'text-4xl sm:text-6xl' }"
    />
  </UMain>
</template>
