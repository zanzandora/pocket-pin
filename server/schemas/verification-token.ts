import mongoose, { Schema } from 'mongoose'

const verificationTokenSchema = new Schema(
  {
    identifier: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expires: {
      type: Date,
      required: true,
      validate: {
        validator: (value: Date) => value > new Date(),
        message: 'Token expiry must be in the future',
      },
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields
)

export default mongoose.model('VerificationToken ', verificationTokenSchema)
