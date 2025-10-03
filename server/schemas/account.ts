import mongoose, { Schema } from 'mongoose'

const accountSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['oauth', 'email', 'credentials'], // Giới hạn kiểu tài khoản
      lowercase: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      index: true,
    },
    providerAccountId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    refresh_token: {
      type: String,
      select: false,
    },
    access_token: {
      type: String,
      select: false,
    },
    expires_at: {
      type: Number,
      min: 0,
    },
    token_type: {
      type: String,
    },
    scope: {
      type: String,
    },
    id_token: {
      type: String,
      select: false,
    },
    session_state: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Account', accountSchema)
