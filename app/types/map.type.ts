export type LatLonItemType = {
  latitude: number
  longitude: number
}

export type MapType = {
  _id?: number
  name: string
  description?: string
} & LatLonItemType
