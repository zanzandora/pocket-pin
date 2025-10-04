<script setup lang="ts">
const route = useRoute()

// Lấy query param ?error=...
const errorMessage = computed(() => {
  const error = route.query.error
  if (Array.isArray(error)) {
    return error.join(', ')
  }
  return error || 'Unxpected error occurred'
})
</script>

<template>
  <UError
    redirect="/"
    :error="{
      statusCode: 400,
      statusMessage: 'Oh no ! Somnething went wrong',
      message: errorMessage,
    }"
  />
</template>
