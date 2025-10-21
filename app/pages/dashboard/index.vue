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
    <div v-if="status === 'pending'">
      <UBlogPosts class="gap-6 lg:gap-y-12">
        <USkeleton
          v-for="i in 9"
          :key="i"
          class="bg-elevated/50 ring-default divide-default w-xs h-32 divide-y overflow-hidden rounded-lg ring"
        />
      </UBlogPosts>
    </div>

    <div
      v-if="
        status !== 'pending' && locations?.data && locations?.data.length > 0
      "
    >
      <!-- <UBlogPosts class="gap-6 lg:gap-y-12">
        <UCard
          v-for="(location, index) in locations?.data"
          :key="index"
          variant="subtle"
        >
          <template #header>
            <h1 class="text-2xl">{{ location?.name }}</h1>
          </template>

          <p class="text-base">
            {{ location?.description || ' There is nothing to desc' }}
          </p>
        </UCard>
      </UBlogPosts> -->

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
