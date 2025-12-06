import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params
    const body = await req.json()
    const { _id, ...updateData } = body

    console.log('PUT /api/projects/:id id =', id)
    console.log('PUT /api/projects/:id body._id =', _id)
    console.log('PUT /api/projects/:id updateData =', updateData)

    const updated = await Project.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    })

    if (!updated) {
      console.log('PUT /api/projects/:id NOT FOUND in DB')
      return NextResponse.json(
        { error: '해당 프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/projects/:id error:', err)
    return NextResponse.json(
      { error: '프로젝트 수정 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params
    console.log('DELETE /api/projects/:id id =', id)

    const deleted = await Project.findOneAndDelete({ _id: id })

    if (!deleted) {
      console.log('DELETE /api/projects/:id NOT FOUND in DB')
      return NextResponse.json(
        { error: '해당 프로젝트를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/projects/:id error:', err)
    return NextResponse.json(
      { error: '프로젝트 삭제 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
