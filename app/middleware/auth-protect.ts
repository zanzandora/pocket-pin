// middleware/auth-protect.ts
import { navigateTo } from '#imports'

const PUBLIC_ROUTES = new Set(['/', '/sign-in', '/sign-out', '/error'])

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.has(to.path)) return

  if (import.meta.client) {
    const auth = useAuth()

    if (auth.status.value === 'loading') {
      await auth.getSession()
    }

    const isAuthenticated = !!(auth.data.value && (auth.data.value as any).user)
    if (!isAuthenticated) {
      // SPA redirect to home
      return navigateTo('/')
    }
  }
})
