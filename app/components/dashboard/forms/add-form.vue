<script setup lang="ts">
import type {
  InsertLocationInput,
  insertLocationResponse,
} from '@@/shared/schemas/insert-location'

// Protect from CSRF attack
const { $csrfFetch } = useNuxtApp()

const handleSubmit = async (data: InsertLocationInput) => {
  await $csrfFetch<insertLocationResponse>('/api/location', {
    method: 'POST',
    body: data,
  })
  navigateTo('/dashboard')
}
</script>

<template>
  <DashboardLocationForm
    :on-submit="handleSubmit"
    submit-button-text="Add Location"
    submit-button-icon="i-lucide:circle-plus"
    :show-cancel-button="true"
    cancel-route="/dashboard"
    :is-edit-mode="false"
  />
</template>
