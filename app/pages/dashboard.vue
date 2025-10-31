<script setup lang="ts">
import { EDIT_PAGES } from '../libs/constant'

definePageMeta({
  middleware: 'auth-protect',
})

const route = useRoute()
const mapStore = useMyMapStore()

const isAddPage = computed(() => !EDIT_PAGES.has(route.name?.toString() || ''))

// Reset addedPoint when entering dashboard to ensure map functionality works
onMounted(() => {
  if (route.path === '/dashboard') {
    mapStore.addedPoint = null
  }
})
</script>

<template>
  <UDashboardGroup class="mt-16">
    <DashboardSidebar />

    <div class="flex flex-1" :class="isAddPage ? 'flex-col' : ''">
      <NuxtPage />

      <DashboardMap class="flex-1" />
    </div>
  </UDashboardGroup>
</template>
