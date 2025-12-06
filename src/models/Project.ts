import mongoose, { Document, Schema } from 'mongoose'

export interface IProject extends Document {
  title: string
  description: string
  link: string
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    link: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model<IProject>('Project', ProjectSchema)
