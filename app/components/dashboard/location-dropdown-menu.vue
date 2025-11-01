<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import type { FetchError } from 'ofetch'

const route = useRoute()

const isOpen = ref(false)
const toast = useToast()
const deleting = ref(false)

const items: DropdownMenuItem[][] = [
  [
    {
      label: 'Add',
      icon: 'i-lucide-eye',
      disabled: true,
    },
    {
      label: 'Edit',
      icon: 'i-lucide-pencil',
      to: `/dashboard/location/${route.params.slug}/edit`,
    },
  ],
  [
    {
      label: 'Delete',
      color: 'error',
      icon: 'i-lucide-trash',
      onSelect() {
        isOpen.value = true
      },
    },
  ],
]

async function handleConfirm() {
  try {
    deleting.value = true
    await $fetch(`/api/location/${route.params.slug}`, { method: 'DELETE' })
    isOpen.value = false

    toast.add({
      title: 'Delete successful !',
      description: 'The location has been deleted successfully. ',
      icon: 'lucide:check-check',
      close: {
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      },
    })

    navigateTo('/dashboard')
  } catch (error) {
    const err = error as FetchError
    console.error('Error inserting location:', error)
    toast.add({
      title: 'Error',
      description:
        err.data?.statusMessage || err.statusMessage || 'An error occurred.',
      close: {
        color: 'error',
        variant: 'outline',
        class: 'rounded-full',
      },
    })
    // Re-throw error to prevent form reset on failure
    throw error
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-ellipsis-vertical"
    />
  </UDropdownMenu>

  <DashboardModal
    title="Are you sure ? "
    description="Deleting this location will also delete all the associated logs. This cannot be undone. Do you really wnat to do this ? "
    confirm-label="Yes, delete this location"
    confirm-color="error"
    :is-open="isOpen"
    :deleting="deleting"
    @close="isOpen = $event"
    @on-confirm="handleConfirm"
  />
</template>
