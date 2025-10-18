import { getAllLocations } from '../controllers/location.controller'
import connectDB from '../libs/db'
import { defineAuthenticatedEventHandle } from '../libs/utils'

export default defineAuthenticatedEventHandle(async (event) => {
  try {
    await connectDB()

    const locaitons = await getAllLocations(event.context.user.id)

    return { statusCode: 200, success: true, data: locaitons }
  } catch (error) {
    console.error('Error inserting location:', error)
    throw createError({
      statusCode: 422,
      statusMessage: 'something wrong',
    })
  }
})
