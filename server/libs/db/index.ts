import env from '@@/server/libs/env'
import mongoose from 'mongoose'

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return // Already connected
  }
  try {
    await mongoose.connect(env.MONGODB_URI as string)
    await import('../../schemas')
    console.warn('MongoDB connected')
  } catch (error) {
    console.warn('Error connecting to MongoDB:', error)
  }
}

export default connectDB
