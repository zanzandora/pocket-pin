import { z } from 'zod'

export const insertLocationLogSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required' }),
    description: z.string().optional(),
    started_at: z.string().min(1, { message: 'Start date is required' }),
    ended_at: z.string().min(1, { message: 'End date is required' }),
    latitude: z
      .number()
      .min(-90, 'Latitude must be >= -90')
      .max(90, 'Latitude must be <= 90'),

    longitude: z
      .number()
      .min(-180, 'Longitude must be >= -180')
      .max(180, 'Longitude must be <= 180'),
  })
  .refine(
    (data) => {
      return new Date(data.ended_at) > new Date(data.started_at)
    },
    {
      message: 'End date must be after start date',
      path: ['ended_at'],
    },
  )

export const insertLocationLogResponseSchema =
  insertLocationLogSchema.safeExtend({
    userId: z.string(),
    location: z.string(),
    slug: z.string().optional(),
  })

export type InsertLocationLogInput = z.infer<typeof insertLocationLogSchema>
export type insertLocationLogResponse = z.infer<
  typeof insertLocationLogResponseSchema
>
