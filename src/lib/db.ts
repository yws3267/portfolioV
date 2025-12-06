import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI as string

if (!MONGODB_URI) {
  throw new Error('MONGO_URI 환경 변수가 설정되어 있지 않습니다.')
}

let cached = (global as any).mongoose
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'portfolio', // ← 여기 portfolio 로 고정
      })
      .then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  return cached.conn
}
