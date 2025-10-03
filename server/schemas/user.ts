import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Number,
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields
)

export default mongoose.model('user', userSchema)
