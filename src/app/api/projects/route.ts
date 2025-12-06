import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ createdAt: -1 })
    return NextResponse.json(projects)
  } catch (err) {
    console.error('GET /api/projects error:', err)
    return NextResponse.json(
      { error: '프로젝트 목록 조회 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const created = await Project.create(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('POST /api/projects error:', err)
    return NextResponse.json(
      { error: '프로젝트 생성 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
