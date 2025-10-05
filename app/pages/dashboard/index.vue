<script setup lang="ts">
definePageMeta({
  middleware: 'auth-protect',
})
</script>

<template>
  <UDashboardGroup>
    <DashboardSidebar />

    <slot />
  </UDashboardGroup>
</template>
