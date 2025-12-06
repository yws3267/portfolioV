import * as dotenv from 'dotenv'
dotenv.config()

import express, { Express } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

const projectRoutes = require('../src/routes/projectRoutes')
const technologyRoutes = require('../src/routes/technologyRoutes')

const app: Express = express()

const MONGO_URI: string = process.env.MONGO_URI || ''
const CLIENT_URL: string =
  process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'

app.use(
  cors({
    origin: CLIENT_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
)
app.use(express.json())

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB is already connected.')
      return true
    }

    if (!MONGO_URI) {
      console.error('MongoDB URI가 환경 변수에 설정되지 않았습니다.')
      return false
    }

    await mongoose.connect(MONGO_URI)
    console.log('MongoDB 연결 성공')
    return true
  } catch (err) {
    console.error('MongoDB 연결 오류:', err)
    return false
  }
}

app.use(async (req, res, next) => {
  if (
    req.path.startsWith('/projects') ||
    req.path.startsWith('/technologies')
  ) {
    const isConnected = await connectDB()
    if (!isConnected) {
      return res.status(500).json({
        error:
          'Database connection failed. Check MONGO_URI, Credentials, and Network Access.',
      })
    }
  }
  next()
})

app.get('/', (req, res) => {
  res.send('Portfolio API Server Running')
})

app.use('/projects', projectRoutes.default || projectRoutes)
app.use('/technologies', technologyRoutes.default || technologyRoutes)

export default app
