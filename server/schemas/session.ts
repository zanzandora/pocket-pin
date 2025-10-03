import mongoose, { Schema } from 'mongoose'

const sessionSchema = new Schema(
  {
    sessionToken: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expires: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value > new Date(),
        message: 'Session expiry must be in the future',
      },
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields
)

export default mongoose.model('Session', sessionSchema)
