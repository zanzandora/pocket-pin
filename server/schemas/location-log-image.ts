import mongoose, { Schema } from 'mongoose'

const locationLogImageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
    },
    location_log: {
      type: Schema.Types.ObjectId,
      ref: 'location-log',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'location',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields});
)

export default mongoose.model('location-log-image', locationLogImageSchema)
