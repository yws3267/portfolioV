import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Technology from '@/models/Technology'

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()

    const { id } = await context.params
    const body = await req.json()
    const { _id, ...updateData } = body

    console.log('PUT /api/technologies/:id id =', id)

    const updated = await Technology.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    })

    if (!updated) {
      return NextResponse.json(
        { error: '해당 기술을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/technologies/:id error:', err)
    return NextResponse.json(
      { error: '기술 수정 중 서버 오류가 발생했습니다.' },
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
    console.log('DELETE /api/technologies/:id id =', id)

    const deleted = await Technology.findOneAndDelete({ _id: id })

    if (!deleted) {
      return NextResponse.json(
        { error: '해당 기술을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/technologies/:id error:', err)
    return NextResponse.json(
      { error: '기술 삭제 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
