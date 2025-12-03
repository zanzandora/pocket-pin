import type { InsertLocationLogInput } from '~~/shared/schemas/insert-location-log'
import type { Types } from 'mongoose'

import { customAlphabet } from 'nanoid'

import LocationModel from '../schemas/location'
import LocationLogModal from '../schemas/location-log'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 5)

// TODO: fine location log by name
// export async function findLocationByName(
//   existing: InsertLocationInput,
//   userId: string,
// ) {
//   return await LocationModel.findOne({
//     userId,
//     name: existing.name,
//   })
// }

export async function findLocationBySlug(slug: string) {
  return await LocationModel.findOne({
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

// TODO: Insert location log
export async function insertedLocationLog(
  data: InsertLocationLogInput,
  locationId: Types.ObjectId,
  userId: string,
) {
  const newLocationLog = new LocationLogModal({
    ...data,
    location: locationId,
    userId,
  })
  await newLocationLog.save()

  return newLocationLog
}

// TODO: Get all location logs
export async function getAllLocations(userId: string) {
  const locations = await LocationModel.find({ userId })
    .sort({
      createdAt: -1,
    })
    .populate('locationLogs')

  if (locations.length === 0) {
    return { statusCode: 404, success: false, data: [] }
  }

  return locations
}

// TODO: Get a location log
export async function findLocation(userId: string, slug: string) {
  const location = await LocationModel.findOne({ userId, slug })

  return location
}

// TODO: Update location by slug
// export async function updateLocationBySlug(
//   userId: string,
//   slug: string,
//   data: InsertLocationInput,
// ) {
//   const updatedLocation = await LocationModel.findOneAndUpdate(
//     { userId, slug },
//     data,
//     { new: true },
//   )

//   return updatedLocation
// }

// TODO: delete location log by slug
export async function deleteLocationBySlug(userId: string, slug: string) {
  const deletedLocaiton = await LocationModel.deleteOne({ userId, slug })

  return deletedLocaiton
}
