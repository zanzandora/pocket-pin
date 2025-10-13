<script setup lang="ts">
definePageMeta({
  middleware: 'auth-protect',
})
</script>

<template>
  <UDashboardGroup class="mt-16 h-screen">
    <DashboardSidebar />

    <NuxtPage />
  </UDashboardGroup>
</template>
