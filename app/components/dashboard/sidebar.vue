<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

const items: NavigationMenuItem[][] = [
  [
    {
      label: 'Location',
      icon: 'i-lucide-house',
      path: '/dashboard/location',
      active: false,
    },
    {
      label: 'Add Location',
      icon: 'i-lucide-inbox',
      path: '/dashboard/add',
      active: false,
    },
  ],
]

const goTo = (path?: string) => {
  if (path) router.push(path)
}
</script>

<template>
  <UDashboardSidebar
    collapsible
    resizable
    :ui="{
      footer: 'border-t border-default',
      header: 'hidden',
      body: 'flex-none',
    }"
  >
    <template #default="{ collapsed }">
      <UNavigationMenu
        v-for="(item, index) in items"
        :key="index"
        :collapsed="collapsed"
        :items="
          item?.map((item) => ({
            ...item,
            active: route.path === item.path,
            onClick: () => goTo(item.path),
          }))
        "
        orientation="vertical"
      />
    </template>

    <template #footer="{ collapsed }">
      <UButton
        icon="i-heroicons-outline:logout"
        :label="collapsed ? undefined : 'Sign Out'"
        color="neutral"
        variant="ghost"
        class="text-error w-full transition-all duration-300 ease-in-out"
        :block="collapsed"
        @click="goTo('/sign-out')"
      />
    </template>
  </UDashboardSidebar>
</template>
