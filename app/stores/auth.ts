import { useDebounceFn, useEventListener } from '@vueuse/core'
import { useAuth } from '#imports'
import { defineStore } from 'pinia'
import { computed, onUnmounted, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const { status, data, getSession, signIn, signOut } = useAuth()

  const actionLoading = ref(false)
  const isAuthenticated = computed(() => status.value === 'authenticated')

  // --- Login / Logout ---
  async function login(provider = 'github') {
    try {
      actionLoading.value = true
      const callbackUrl = '/dashboard'
      await signIn(provider, { callbackUrl })
      await getSession()
    } catch (err) {
      console.error('signIn error', err)
    } finally {
      actionLoading.value = false
    }
  }

  async function logout() {
    try {
      actionLoading.value = true
      await signOut({ callbackUrl: '/' })
      await getSession()
    } catch (err) {
      console.error('signOut error', err)
    } finally {
      actionLoading.value = false
    }
  }

  // --- Debounced refresh session ---
  const debouncedRefresh = useDebounceFn(async () => {
    if (status.value !== 'loading') {
      try {
        await getSession()
      } catch (e) {
        console.error('getSession error', e)
      }
    }
  }, 600)

  // --- Event listeners ---
  useEventListener(window, 'focus', debouncedRefresh)
  useEventListener(document, 'visibilitychange', () => {
    if (!document.hidden) debouncedRefresh()
  })

  // Cleanup khi store unmount (Pinia + VueUse)
  onUnmounted(() => {
    ;(debouncedRefresh as any).cancel?.()
  })

  return {
    actionLoading,
    isAuthenticated,
    status,
    data,
    login,
    logout,
    getSession,
  }
})
