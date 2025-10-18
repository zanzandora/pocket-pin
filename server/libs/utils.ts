import type { H3Event, H3EventContext } from 'h3'
import type { User } from 'next-auth'

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: User
  }
}
export function defineAuthenticatedEventHandle<T>(
  handler: (event: AuthenticatedEvent) => T,
) {
  return defineEventHandler(async (event) => {
    if (!event.context.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    // *Continue event when authenticate
    return handler(event as AuthenticatedEvent)
  })
}
