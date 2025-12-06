import mongoose, { Document, Schema, models } from 'mongoose'

export interface ITechnology extends Document {
  name: string
  iconName: string
}

const TechnologySchema: Schema<ITechnology> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    iconName: { type: String, required: true },
  },
  { timestamps: true }
)

const Technology =
  models.Technology ||
  mongoose.model<ITechnology>('Technology', TechnologySchema)

export default Technology
