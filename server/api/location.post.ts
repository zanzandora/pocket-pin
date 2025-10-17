import { insertLocationSchema } from '@@/shared/schemas/insert-location'

import connectDB from '../libs/db'
import locationSchema from '../schemas/location'

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

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

  const exitedLocation = await locationSchema.findOne({
    userId: event.context.user.id,
    name: result.data.name,
  })

  if (exitedLocation) {
    throw createError({
      statusCode: 409,
      statusMessage: 'The location already exits !',
    })
  }

  let slug = result.data.name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\W+/g, '-')
    .replace(/^-+|-+$/g, '')

  let counter = 1

  // Kiểm tra trùng lặp slug trong database
  while (await locationSchema.exists({ slug })) {
    slug = `${slug}-${counter}`
    counter++
  }

  // eslint-disable-next-line new-cap
  const newLocation = new locationSchema({
    ...result.data,
    userId: event.context.user.id,
    slug,
  })
  await newLocation.save()

  return { statusCode: 200, success: true, data: newLocation }
})
