<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import type { RouteLocationRaw } from 'vue-router'

import {
  CURRENT_LOCATION_LOG_PAGES,
  // CURRENT_LOCATION_LOG_PAGES,
  CURRENT_LOCATION_PAGES,
  LOCATION_PAGES,
} from '../../libs/constant'

const route = useRoute()
const router = useRouter()

const sidebarStore = storeToRefs(useMySidebarStore())
const locationsStore = useMyLocationsStore()
const { currentLocation, currentLocationStatus } = storeToRefs(locationsStore)
const mapStore = useMyMapStore()

onMounted(() => {
  if (route.path !== '/dashboard') {
    useMyLocationsStore().locationsRefresh()
  }
})

const items = computed<NavigationMenuItem[][]>(() => [
  sidebarStore.sidebarTopItems.value,
  [
    {
      label: 'Map Pin',
      slot: 'map' as const,
      children: [],
    },
  ],
])

const goTo = (path?: RouteLocationRaw) => {
  if (path) router.push(path)
}

// TODO: dynamic sidebar items top based on route
effect(() => {
  if (LOCATION_PAGES.has(route.name?.toString() || '')) {
    sidebarStore.sidebarTopItems.value = [
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
    ]
  } else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || '')) {
    sidebarStore.sidebarTopItems.value = [
      {
        label: 'Back to Locations',
        to: '/dashboard',
        icon: 'tabler:arrow-left',
      },
    ]

    if (currentLocation.value && currentLocationStatus.value !== 'pending') {
      sidebarStore.sidebarTopItems.value.push(
        {
          label: currentLocation.value.data.name,
          to: {
            name: 'dashboard-location-slug',
            params: {
              slug: route.params.slug,
            },
          },
          icon: 'tabler:map',
        },
        {
          label: 'Edit Location',
          to: {
            name: 'dashboard-location-slug-edit',
            params: {
              slug: route.params.slug,
            },
          },
          icon: 'tabler:map-pin-cog',
        },
        {
          label: 'Add Location Log',
          to: {
            name: 'dashboard-location-slug-add',
            params: {
              slug: route.params.slug,
            },
          },
          icon: 'tabler:circle-plus-filled',
        },
      )
    }
  } else if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || '')) {
    if (currentLocation.value && currentLocationStatus.value !== 'pending') {
      sidebarStore.sidebarTopItems.value = [
        {
          label: `Back to "${currentLocation.value.data.name}"`,
          to: {
            name: 'dashboard-location-slug',
            params: {
              slug: route.params.slug,
            },
          },
          icon: 'tabler:arrow-left',
        },
        {
          label: 'View Log',
          to: {
            name: 'dashboard-location-slug-id',
            params: {
              slug: route.params.slug,
              id: route.params.id,
            },
          },
          icon: 'tabler:map-pin',
        },
        {
          label: 'Edit Log',
          to: {
            name: 'dashboard-location-slug-id-edit',
            params: {
              slug: route.params.slug,
              id: route.params.id,
            },
          },
          icon: 'tabler:map-pin-cog',
        },
        {
          label: 'Manage Images',
          to: {
            name: 'dashboard-location-slug-id-images',
            params: {
              slug: route.params.slug,
              id: route.params.id,
            },
          },
          icon: 'tabler:photo-cog',
        },
      ]
    }
  } else {
    // Fallback to default items for other routes
    sidebarStore.sidebarTopItems.value = [
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
    ]
  }
})

if (LOCATION_PAGES.has(route.name?.toString() || '')) {
  await locationsStore.locationsRefresh()
}

if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || '')) {
  await locationsStore.currentLocationRefresh()
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
          <div class="max-h-1/2 w-full space-y-1 overflow-y-auto">
            <NuxtLink
              v-for="child in sidebarStore.sidebarItems.value"
              :key="child._id"
              class="flex min-w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 transition-colors duration-200"
              :class="{
                'hover:bg-elevated': mapStore.selectedPoint?._id === child._id,
                'bg-transparent': mapStore.selectedPoint?._id !== child._id,
              }"
              :to="child.href || child.to"
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
            </NuxtLink>
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
