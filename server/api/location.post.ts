import { insertLocationSchema } from '@@/shared/schemas/insert-location'
import slugify from 'slug'

import {
  findLocationByName,
  getUniqueSlug,
  insertedLocation,
} from '../controllers/location.controller'
import connectDB from '../libs/db'
import { defineAuthenticatedEventHandle, sendZodError } from '../libs/utils'

export default defineAuthenticatedEventHandle(async (event) => {
  await connectDB()

  const result = await readValidatedBody(event, insertLocationSchema.safeParse)

  if (!result.success) {
    sendZodError(event, result.error)
  }

  const exitedLocation = await findLocationByName(
    result.data!,
    event.context.user.id,
  )

  if (exitedLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: 'The location already exits !',
    })
  }

  const slug = await getUniqueSlug(slugify(result.data!.name))

  try {
    const newLocation = await insertedLocation(
      result.data!,
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
