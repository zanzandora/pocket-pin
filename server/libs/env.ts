import { z } from 'zod'

import tryParseEnv from './try-parse-env'

const envSchema = z.object({
  PORT: z.string().default('3000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  MONGODB_URI: z.string().url(),
})

tryParseEnv(envSchema)

// eslint-disable-next-line node/no-process-env
const env = envSchema.parse(process.env)

export default env
