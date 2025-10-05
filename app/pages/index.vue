<script setup lang="ts">
const authStore = useAuthStore()

const heroLinksDashboard = computed(() => [
  {
    label: 'Go to Dashboard',
    to: '/dashboard',
    icon: 'i-lucide-layout-dashboard',
  },
])

const heroDescription =
  'Keep track of your travels and adventures with Travel Log, the ultimate travel journaling app. Add locations, photos, and notes to create a digital journal of your journeys.'
</script>

<template>
  <div>
    <UPageHero
      v-if="authStore.isAuthenticated"
      title="Travel Log"
      :description="heroDescription"
      :links="heroLinksDashboard"
    />

    <UPageHero v-else title="Travel Log" :description="heroDescription">
      <template #links>
        <UButton
          :disabled="authStore.actionLoading || authStore.status === 'loading'"
          icon="i-grommet-icons:github"
          size="lg"
          :loading="authStore.actionLoading"
          @click="authStore.login('github')"
        >
          <span v-if="authStore.actionLoading">Loading...</span>
          <span v-else>Sign in</span>
        </UButton>
      </template>
    </UPageHero>
  </div>
</template>
