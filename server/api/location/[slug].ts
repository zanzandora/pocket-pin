import { findLocation } from '@@/server/controllers/location.controller'
import connectDB from '@@/server/libs/db'
import { defineAuthenticatedEventHandle } from '@@/server/libs/utils'

export default defineAuthenticatedEventHandle(async (event) => {
  try {
    await connectDB()

    const slug = getRouterParam(event, 'slug') as string

    if (!slug) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: 'Slug does not exist.',
        }),
      )
    }

    const locaiton = await findLocation(event.context.user.id, slug)

    if (!locaiton) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'Location does not exist.',
        }),
      )
    }

    return { statusCode: 200, success: true, data: locaiton }
  } catch (error) {
    console.error('Error inserting location:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong',
    })
  }
})
