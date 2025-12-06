import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI as string

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error('MONGO_URI 환경 변수가 설정되어 있지 않습니다.')
  }

  if (mongoose.connection.readyState >= 1) {
    return
  }

  await mongoose.connect(MONGO_URI)
}
