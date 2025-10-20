import { defineStore } from 'pinia'

export type SideBarItem = {
  label: string
  icon: string
  to: string
}

export const useMySidebarStore = defineStore('sidebar', () => {
  const sidebarItems = ref<SideBarItem[]>([])

  return {
    sidebarItems,
  }
})
