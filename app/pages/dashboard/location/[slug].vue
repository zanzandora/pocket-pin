<script lang="ts" setup>
import type { ApiResponeType } from '../../../types/api-respone.type'
import type { LocationType } from '../../../types/location.type'

const route = useRoute()
const { slug } = route.params

const mapStore = useMyMapStore()

const {
  data: location,
  status,
  error,
} = await useFetch<ApiResponeType<LocationType>>(`/api/location/${slug}`, {
  lazy: true,
})

effect(() => {
  if (location.value) {
    mapStore.mapPoints = [location.value.data]
  }
})
</script>

<template>
  <div class="h-44">
    <div v-if="status === 'pending'">Loading</div>
    <div v-if="!location?.data">No location found</div>
    <div v-if="location && status !== 'pending'">
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
        tralling-icon="i-lucide:map-pin-plus"
      >
        Add locaiton log
      </UButton>
    </div>
    <div v-if="error && status !== 'pending'" class="text-error">
      {{ error.statusMessage }}
    </div>
  </div>
</template>
