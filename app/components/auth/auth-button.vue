<script setup lang="ts">
const authStore = useAuthStore()
</script>

<template>
  <div>
    <template v-if="authStore.isAuthenticated">
      <UButton
        :disabled="authStore.actionLoading || authStore.status === 'loading'"
        icon="i-lucide-rocket"
        loading-auto
        @click="authStore.logout"
      >
        <span v-if="authStore.actionLoading">Loading...</span>
        <span v-else>Sign out</span>
      </UButton>
    </template>
    <template v-else>
      <UButton
        :disabled="authStore.actionLoading || authStore.status === 'loading'"
        icon="i-grommet-icons:github"
        loading-auto
        @click="authStore.login('github')"
      >
        <span v-if="authStore.actionLoading">Loading...</span>
        <span v-else>Sign in</span>
      </UButton>
    </template>
  </div>
</template>
