import mongoose, { Schema } from 'mongoose'

import LocationLog from './location-log'

const locationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }, // Automatically create createdAt and updatedAt fields});
)

// TODO: virtual populate để định nghĩa quan hệ ngược (One → Many)
locationSchema.virtual('locationLogs', {
  ref: LocationLog.modelName,
  localField: '_id',
  foreignField: 'location',
})
locationSchema.set('toJSON', { virtuals: true })
locationSchema.set('toObject', { virtuals: true })

const LocationModel =
  (mongoose.models.Location as mongoose.Model<
    LocationDocument,
    object,
    object
  >) || mongoose.model<LocationDocument>('Location', locationSchema)

export default LocationModel

export type LocationDocument = mongoose.InferSchemaType<typeof locationSchema>
