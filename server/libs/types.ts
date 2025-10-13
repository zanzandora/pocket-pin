import type { User } from 'next-auth'

/* eslint-disable ts/consistent-type-definitions */
declare module 'h3' {
  interface H3EventContext {
    user?: User
  }
}
