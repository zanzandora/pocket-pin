import type { NominatimLocationsType } from '@@/app/types/map.type'

import { searchSchema } from '@@/shared/schemas/search'

import { defineAuthenticatedEventHandle, sendZodError } from '../libs/utils'

export default defineAuthenticatedEventHandle(
  defineCachedFunction(
    async (event) => {
      try {
        const result = await getValidatedQuery(event, searchSchema.safeParse)

        if (!result.success) {
          sendZodError(event, result.error)
        }

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${result.data?.q}&format=json`,
          {
            // *Nếu API fetch quá 5s, tự động cancel
            signal: AbortSignal.timeout(5000),
            headers: {
              'User-Agent': 'nuxt-pocket-pin | maiminhtu130803@gmail.com',
            },
          },
        )

        if (!res.ok) {
          return sendError(
            event,
            createError({
              statusCode: 504,
              statusMessage: 'Unable to reach search API.',
            }),
          )
        }

        const searchResults = (await res.json()) as NominatimLocationsType[]

        return { statusCode: 200, success: true, data: searchResults }
      } catch (error) {
        console.error('error when fetching search api :>> ', error)
        return sendError(
          event,
          createError({
            statusCode: 504,
            statusMessage: 'Something wrong when searching, please try again.',
          }),
        )
      }
    },
    {
      maxAge: 60 * 60 * 24, // 24 hour
      name: 'search-nominatim',
      getKey: async (event) => {
        const query = await getQuery(event)
        return query.q?.toString() || ''
      },
    },
  ),
)
