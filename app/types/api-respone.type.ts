export type ApiResponeType<T> = {
  status: number
  success: boolean
  data: T
} | null
