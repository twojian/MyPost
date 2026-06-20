import { NextRequest } from 'next/server'
import { verifyCredentials, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return Response.json({ error: '请输入邮箱和密码' }, { status: 400 })
  }

  const valid = await verifyCredentials(email, password)
  if (!valid) {
    return Response.json({ error: '邮箱或密码错误' }, { status: 401 })
  }

  await createSession(email)
  return Response.json({ ok: true })
}
