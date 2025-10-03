import mongoose, { Schema } from 'mongoose'

const locationLogSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    started_at: {
      type: Date,
      required: true,
    },
    ended_at: {
      type: Date,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
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

export default mongoose.model('location-log', locationLogSchema)
