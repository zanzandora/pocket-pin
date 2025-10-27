import type { H3Event, H3EventContext } from 'h3'
import type { User } from 'next-auth'
import type { ZodError } from 'zod'

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

export function sendZodError(event: H3Event, error: ZodError) {
  const statusMessage = error.issues
    .map((issue) => `${issue.path.join('')}: ${issue.message}`)
    .join('; ')

  const data = error.issues.reduce(
    (errors, issue) => {
      errors[issue.path.join('')] = issue.message
      return errors
    },
    {} as Record<string, string>,
  )

  throw sendError(
    event,
    createError({
      statusCode: 422,
      statusMessage,
      data,
    }),
  )
}
