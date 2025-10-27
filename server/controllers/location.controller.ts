import type { InsertLocationInput } from '~~/shared/schemas/insert-location'

import { customAlphabet } from 'nanoid'

import LocationSchema from '../schemas/location'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

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

export async function findLocationBySlug(slug: string) {
  return await LocationSchema.findOne({
    slug,
  })
}

// TODO: get unique slug
export async function getUniqueSlug(name: string) {
  let existing = !!(await findLocationBySlug(name))

  while (existing) {
    const id = nanoid()
    const idSlug = `${name}-${id}`
    existing = !!(await findLocationBySlug(idSlug))
    if (!existing) {
      return idSlug
    }
  }

  return name
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
