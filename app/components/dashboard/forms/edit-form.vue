<script setup lang="ts">
import type {
  InsertLocationInput,
  insertLocationResponse,
} from '@@/shared/schemas/insert-location'

const props = defineProps<{
  locationId: string
  initialValues: InsertLocationInput
}>()

// Protect from CSRF attack
const { $csrfFetch } = useNuxtApp()

const handleSubmit = async (data: InsertLocationInput) => {
  await $csrfFetch<insertLocationResponse>(
    `/api/location/${props.locationId}`,
    {
      method: 'PUT',
      body: data,
    },
  )
}
</script>

<template>
  <DashboardLocationForm
    :initial-values="initialValues"
    :on-submit="handleSubmit"
    submit-button-text="Update Location"
    submit-button-icon="i-lucide:save"
    :show-cancel-button="true"
    :cancel-route="`/dashboard/location/${locationId}`"
    :is-edit-mode="true"
  />
</template>
