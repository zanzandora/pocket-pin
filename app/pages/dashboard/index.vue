<script setup lang="ts">
import type { ApiResponeType } from '~/types/api-respone.type'
import type { LocationType } from '~/types/location.type'

const links = ref([
  {
    label: 'Add Location',
    to: '/dashboard/add',
    icon: 'i-lucide-circle-plus',
  },
])

const { data: locations, pending } = await useFetch<
  ApiResponeType<LocationType[]>
>('/api/location', {
  lazy: true,
})
</script>

<template>
  <UMain class="mx-auto mt-8">
    <div v-if="pending">Loading...</div>

    <div v-else-if="locations?.data && locations?.data.length > 0">
      <UBlogPosts>
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
      </UBlogPosts>
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
