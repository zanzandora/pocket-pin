import { MongoClient, ServerApiVersion } from 'mongodb'

import env from '../env'

const uri = env.MONGODB_URI!
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

// eslint-disable-next-line import/no-mutable-exports
let client: MongoClient

if (env.NODE_ENV === 'development') {
  const globalWithMongo = globalThis as typeof globalThis & {
    _mongoClient?: MongoClient
    _mongoClientPromise?: Promise<MongoClient>
  }
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options)
    // không await ở đây
    globalWithMongo._mongoClientPromise = globalWithMongo._mongoClient
      .connect()
      .then(() => globalWithMongo._mongoClient!)
  }
  client = globalWithMongo._mongoClient
} else {
  client = new MongoClient(uri, options)
}

export const clientPromise: Promise<MongoClient> = client
  .connect()
  .then(() => client)

export default client
