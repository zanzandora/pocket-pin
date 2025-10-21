export type LatLonItemType = {
  lat: number
  long: number
}

export type MapType = {
  id: number
  label: string
} & LatLonItemType
