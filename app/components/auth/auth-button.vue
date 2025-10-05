<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const authStore = useAuthStore()

// Dropdown items
const items = computed<DropdownMenuItem[]>(() => [
  {
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    to: '/sign-out',
    // action: async () => {
    //   await authStore.logout()
    // },
  },
])
</script>

<template>
  <div class="relative inline-block">
    <!-- Nếu chưa login -->
    <template v-if="!authStore.isAuthenticated">
      <UButton
        :disabled="authStore.actionLoading || authStore.status === 'loading'"
        icon="i-grommet-icons:github"
        :loading="authStore.actionLoading"
        @click="authStore.login('github')"
      >
        <span v-if="authStore.actionLoading">Loading...</span>
        <span v-else>Sign in</span>
      </UButton>
    </template>

    <!-- Nếu đã login -->
    <template v-else>
      <UDropdownMenu
        :items="items"
        :content="{
          align: 'start',
          side: 'bottom',
        }"
        width="48"
      >
        <UButton class="flex items-center gap-2" variant="outline">
          <UAvatar
            size="sm"
            :src="authStore.data?.user?.image ?? '/placeholder.png'"
            alt="avatar"
          />
          <span class="text-sm font-medium">
            {{ authStore.data?.user?.name }}
          </span>
        </UButton>
      </UDropdownMenu>
    </template>
  </div>
</template>
