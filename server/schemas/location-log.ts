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

const LocationLogModal =
  (mongoose.models.Location as mongoose.Model<
    LocationLogDocument,
    object,
    object
  >) || mongoose.model<LocationLogDocument>('LocationLog', locationLogSchema)

export default LocationLogModal

export type LocationLogDocument = mongoose.InferSchemaType<
  typeof locationLogSchema
>
