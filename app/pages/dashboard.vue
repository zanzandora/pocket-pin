<script setup lang="ts">
definePageMeta({
  middleware: 'auth-protect',
})

const route = useRoute()
const mapStore = useMyMapStore()

const isAddPage = computed(() => route.name === 'dashboard-add')

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

    <div class="flex flex-1" :class="isAddPage ? '' : 'flex-col'">
      <NuxtPage />

      <DashboardMap class="flex-1" />
    </div>
  </UDashboardGroup>
</template>
