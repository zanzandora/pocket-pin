import { deleteLocationBySlug } from '@@/server/controllers/location.controller'
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

    const deleted = await deleteLocationBySlug(event.context.user.id, slug)

    if (!deleted) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'Location not found',
        }),
      )
    }

    return { statusCode: 204, success: true }
  } catch (error) {
    console.error('Error inserting location:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong when deleting locaiton',
    })
  }
})
