<script setup lang="ts">
import type {
  InsertLocationLogInput,
  insertLocationLogResponse,
} from '~~/shared/schemas/insert-location-log'

const props = defineProps<{
  locationId: string
}>()

// Protect from CSRF attack
const { $csrfFetch } = useNuxtApp()

const handleSubmit = async (data: InsertLocationLogInput) => {
  await $csrfFetch<insertLocationLogResponse>(
    `/api/location/${props.locationId}/add`,
    {
      method: 'POST',
      body: data,
    },
  )
}
</script>

<template>
  <DashboardLocationLogForm
    :on-submit="handleSubmit"
    submit-button-text="Add Logs"
    submit-button-icon="i-lucide:save"
    :show-cancel-button="true"
    :cancel-route="`/dashboard/location/${locationId}`"
  />
</template>
