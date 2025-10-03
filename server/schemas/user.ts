import mongoose, { Schema } from 'mongoose'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    emailVerified: { type: Date },
    image: String,
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields
)

export default mongoose.model('User', userSchema)
