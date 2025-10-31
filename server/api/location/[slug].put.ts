import {
  findLocationByName,
  updateLocationBySlug,
} from '@@/server/controllers/location.controller'
import connectDB from '@@/server/libs/db'
import {
  defineAuthenticatedEventHandle,
  sendZodError,
} from '@@/server/libs/utils'
import { insertLocationSchema } from '~~/shared/schemas/insert-location'

export default defineAuthenticatedEventHandle(async (event) => {
  try {
    await connectDB()

    const slug = getRouterParam(event, 'slug') as string
    const result = await readValidatedBody(
      event,
      insertLocationSchema.safeParse,
    )

    if (!result.success) {
      return sendZodError(event, result.error)
    }

    if (!slug) {
      return sendError(
        event,
        createError({
          statusCode: 400,
          statusMessage: 'Slug does not exist.',
        }),
      )
    }

    const locaiton = await findLocationByName(
      result.data!,
      event.context.user.id,
    )

    if (locaiton?.slug !== slug && locaiton) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: 'Location with that name already exist.',
        }),
      )
    }

    const updateLocation = await updateLocationBySlug(
      event.context.user.id,
      slug,
      result.data!,
    )

    return { statusCode: 200, success: true, data: updateLocation }
  } catch (error) {
    console.error('Error inserting location:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong',
    })
  }
})
