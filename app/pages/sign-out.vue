<script setup lang="ts">
const authStore = useAuthStore()

onMounted(async () => {
  await authStore.logout()
})
</script>

<template>
  <div class="flex h-screen items-center justify-center">
    <UIcon name="i-simple-line-icons:reload" class="size-8 animate-spin" />
  </div>
</template>
