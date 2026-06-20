import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'dev-secret-change-me-in-production'
)
const COOKIE_NAME = 'admin-session'
const EXPIRY = '7d'

export async function verifyCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH
  if (!adminEmail || !adminHash) return false
  if (email !== adminEmail) return false
  return bcrypt.compare(password, adminHash)
}

export async function createSession(email: string) {
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(SECRET)

  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  })
}

export async function getSession() {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { email: string; role: string }
  } catch {
    return null
  }
}

export async function destroySession() {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}
