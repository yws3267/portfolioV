import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Technology from '@/models/Technology'

export async function GET() {
  await connectDB()

  const technologies = await Technology.find().sort({ createdAt: -1 })

  return NextResponse.json(technologies)
}

export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()

  const created = await Technology.create(body)

  return NextResponse.json(created, { status: 201 })
}
