<script setup lang="ts">
const links = ref([
  {
    label: 'Get started',
    to: '/docs/getting-started',
    icon: 'i-lucide-square-play',
  },
  {
    label: 'Learn more',
    to: '/docs/getting-started/theme/design-system',
    variant: 'subtle' as const,
    trailingIcon: 'i-lucide-arrow-right',
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
