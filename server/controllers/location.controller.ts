import type { InsertLocationInput } from '~~/shared/schemas/insert-location'

import LocationSchema from '../schemas/location'

export async function findLocationByName(
  existing: InsertLocationInput,
  userId: string,
) {
  return await LocationSchema.findOne({
    userId,
    name: existing.name,
  })
}

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
