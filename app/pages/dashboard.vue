<script setup lang="ts">
definePageMeta({
  middleware: 'auth-protect',
})
</script>

<template>
  <UDashboardGroup class="mt-16">
    <DashboardSidebar />

    <div class="flex flex-1 flex-col">
      <NuxtPage />

      <DashboardMap class="flex-1" />
    </div>
  </UDashboardGroup>
</template>
