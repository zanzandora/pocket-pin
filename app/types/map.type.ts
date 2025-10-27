export type LatLonItemType = {
  latitude: number
  longitude: number
}

export type MapType = {
  _id?: number
  name: string
  description?: string
} & LatLonItemType

export type NominatimLocationsType = {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: number
  lon: number
  class: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  boundingbox: number[]
}
