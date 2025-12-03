import { insertLocationLogSchema } from '@@/shared/schemas/insert-location-log'
import connectDB from '~~/server/libs/db'

import { insertedLocationLog } from '../../../../server/controllers/location-log.controller'
import { findLocation } from '../../../controllers/location.controller'
import {
  defineAuthenticatedEventHandle,
  sendZodError,
} from '../../../libs/utils'

export default defineAuthenticatedEventHandle(async (event) => {
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

  const result = await readValidatedBody(
    event,
    insertLocationLogSchema.safeParse,
  )

  if (!result.success) {
    sendZodError(event, result.error)
  }

  try {
    const newLocaitonLog = await insertedLocationLog(
      result.data!,
      locaiton._id,
      event.context.user.id,
    )

    return { statusCode: 200, success: true, data: newLocaitonLog }
  } catch (error) {
    console.error('Error inserting location log:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong',
    })
  }
})
