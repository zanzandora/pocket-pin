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
      ref: 'LocationLog',
      required: true,
    },
    location: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields});
)

export default mongoose.model('LocationLogImage', locationLogImageSchema)
