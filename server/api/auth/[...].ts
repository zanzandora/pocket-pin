import env from '@@/server/libs/env'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { NuxtAuthHandler } from '#auth'
import client from '~~/server/libs/db/mongo-client'
import GithubProvider from 'next-auth/providers/github'

export default NuxtAuthHandler({
  secret: env.NUXT_AUTH_SECRET,
  adapter: MongoDBAdapter(client) as any,
  providers: [
    GithubProvider.default({
      clientId: env.AUTH_GITHUB_CLIENT_ID!,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET!,
    }),
  ],
})
