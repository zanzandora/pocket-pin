import type { LocationLogType } from './location-log.type'

export type LocationType = {
  _id?: number
  name: string
  description: string
  latitude: number
  longitude: number
  userId: string
  slug: string
  locationLogs?: LocationLogType[]
}
