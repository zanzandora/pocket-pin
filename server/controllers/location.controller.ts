import type { InsertLocationInput } from '~~/shared/schemas/insert-location'

import LocationSchema from '../schemas/location'

// TODO: fine location by name
export async function findLocationByName(
  existing: InsertLocationInput,
  userId: string,
) {
  return await LocationSchema.findOne({
    userId,
    name: existing.name,
  })
}

// TODO: get unique slug
export async function getUniqueSlug(name: string) {
  let slug = name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\W+/g, '-')
    .replace(/^-+|-+$/g, '')

  let counter = 1

  // Kiểm tra trùng lặp slug trong database
  while (await LocationSchema.exists({ slug })) {
    slug = `${slug}-${counter}`
    counter++
  }
  return slug
}

// TODO: Insert location
export async function insertedLocation(
  data: InsertLocationInput,
  userId: string,
  slug: string,
) {
  const newLocation = new LocationSchema({
    ...data,
    userId,
    slug,
  })
  await newLocation.save()

  return newLocation
}

// TODO: Get all locations
export async function getAllLocations(userId: string) {
  const locations = await LocationSchema.find({ userId }).sort({
    createdAt: -1,
  })

  if (locations.length === 0) {
    return { statusCode: 404, success: false, data: [] }
  }

  return locations
}

// TODO: Get a location
export async function findLocation(userId: string) {
  const location = await LocationSchema.findOne({ userId })

  return location
}
