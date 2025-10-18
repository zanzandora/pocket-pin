import { insertLocationSchema } from '@@/shared/schemas/insert-location'

import {
  findLocationByName,
  getUniqueSlug,
  insertedLocation,
} from '../controllers/location.controller'
import connectDB from '../libs/db'
import { defineAuthenticatedEventHandle } from '../libs/utils'

export default defineAuthenticatedEventHandle(async (event) => {
  await connectDB()

  const result = await readValidatedBody(event, insertLocationSchema.safeParse)

  if (!result.success) {
    const statusMessage = result.error.issues
      .map((issue) => `${issue.path.join('')}: ${issue.message}`)
      .join('; ')

    const data = result.error.issues.reduce(
      (errors, issue) => {
        errors[issue.path.join('')] = issue.message
        return errors
      },
      {} as Record<string, string>,
    )

    throw createError({
      statusCode: 422,
      statusMessage,
      data,
    })
  }

  const exitedLocation = await findLocationByName(
    result.data,
    event.context.user.id,
  )

  if (exitedLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: 'The location already exits !',
    })
  }

  const slug = await getUniqueSlug(result.data.name)

  try {
    const newLocation = await insertedLocation(
      result.data,
      event.context.user.id,
      slug,
    )

    return { statusCode: 200, success: true, data: newLocation }
  } catch (error) {
    console.error('Error inserting location:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong',
    })
  }
})
