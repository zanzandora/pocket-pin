<script setup lang="ts">
const links = ref([
  {
    label: 'Get started',
    to: '/dashboard',
    icon: 'i-lucide-square-play',
  },
])
</script>

<template>
  <UPageHero
    title="Travle Log"
    description="Keep track of your travels and adventures with Travel Log, the ultimate travel journaling app. Add locations, photos, and notes to create a digital journal of your journeys."
    :links="links"
  />
</template>
