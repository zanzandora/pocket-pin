/* eslint-disable node/no-process-env */
import type { ZodObject, ZodRawShape } from 'zod'

import { z, ZodError } from 'zod'

export default function tryParseEnv<T extends ZodRawShape>(
  EnvSchema: ZodObject<T>,
  buildEnv: Record<string, string | undefined> = process.env,
) {
  try {
    EnvSchema.parse(buildEnv)
  } catch (error) {
    if (error instanceof ZodError) {
      const pretty = z.prettifyError(error)
      console.error(pretty)
      throw new Error(pretty)
    }
  }
}
