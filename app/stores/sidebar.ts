import type { RouteLocationRaw } from 'vue-router'

import { defineStore } from 'pinia'

import type { MapType } from '~/types/map.type'

export type SideBarItem = {
  label: string
  icon: string
  to: RouteLocationRaw
  href?: string
  slug?: string
  _id?: number
  mapPoints?: MapType | null
}

export const useMySidebarStore = defineStore('mySidebarStore', () => {
  const sidebarItems = ref<SideBarItem[]>([])
  const sidebarTopItems = ref<SideBarItem[]>([
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
  ])

  return {
    sidebarItems,
    sidebarTopItems,
  }
})
