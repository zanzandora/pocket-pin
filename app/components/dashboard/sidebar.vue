<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

const sidebarStore = storeToRefs(useMySidebarStore())
const mapStore = useMyMapStore()

onMounted(() => {
  if (route.path !== '/dashboard') {
    useMyLocationsStore().refresh()
  }
})

const items = computed<NavigationMenuItem[][]>(() => [
  [
    {
      label: 'Location',
      icon: 'i-lucide-house',
      to: '/dashboard',
    },
    {
      label: 'Add Location',
      icon: 'i-lucide-inbox',
      to: '/dashboard/add',
    },
  ],
  [
    {
      label: 'Map Pin',
      slot: 'map' as const,
    },
  ],
])

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
            active: route.path === item.to,
          }))
        "
        orientation="vertical"
      >
        <template #map>
          <div class="w-full space-y-1">
            <div
              v-for="child in sidebarStore.sidebarItems.value"
              :key="child._id"
              class="flex min-w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors duration-200"
              :class="{
                'hover:bg-elevated': mapStore.selectedPoint?._id === child._id,
                'bg-transparent': mapStore.selectedPoint?._id !== child._id,
              }"
              @mouseenter="
                mapStore.selectedPoint =
                  mapStore.mapPoints.find((point) => point._id === child._id) ||
                  null
              "
              @mouseleave="mapStore.selectedPoint = null"
              @click="goTo(child.to)"
            >
              <UIcon
                :name="child.icon"
                class="h-4 w-4 flex-shrink-0"
                :class="{
                  'text-pink-500': mapStore.selectedPoint?._id === child._id,
                  'text-gray-500 dark:text-gray-400':
                    mapStore.selectedPoint?._id !== child._id,
                }"
              />
              <span class="truncate text-sm font-medium">
                {{ child.label }}
              </span>
            </div>
          </div>
        </template>
      </UNavigationMenu>
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
