import mongoose, { Document, Schema } from 'mongoose'

export interface ITechnology extends Document {
  name: string
  iconName: string
}

const TechnologySchema: Schema<ITechnology> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model<ITechnology>('Technology', TechnologySchema)
