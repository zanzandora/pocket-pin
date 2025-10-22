import { defineStore } from 'pinia'

export type SideBarItem = {
  label: string
  icon: string
  to: string
  _id?: number
}

export const useMySidebarStore = defineStore('mySidebarStore', () => {
  const sidebarItems = ref<SideBarItem[]>([])

  return {
    sidebarItems,
  }
})
