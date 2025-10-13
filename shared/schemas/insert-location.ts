import { z } from 'zod'

export const insertLocationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  latitude: z.coerce
    .number()
    .min(-90, 'Latitude must be >= -90')
    .max(90, 'Latitude must be <= 90'),

  longitude: z.coerce
    .number()
    .min(-180, 'Longitude must be >= -180')
    .max(180, 'Longitude must be <= 180'),
})

export const insertLocationResponseSchema = insertLocationSchema.extend({
  userId: z.string(),
  slug: z.string().optional(),
})

export type InsertLocationInput = z.infer<typeof insertLocationSchema>
export type insertLocationResponse = z.infer<
  typeof insertLocationResponseSchema
>
