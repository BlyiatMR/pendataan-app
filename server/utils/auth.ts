// server/utils/auth.ts — JWT helpers untuk session auth
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import { type H3Event, createError, getCookie, setCookie, deleteCookie } from 'h3'

const COOKIE_NAME = 'si_warga_session'
const EXPIRES_IN  = 60 * 60 * 8 // 8 jam
const devSecret = randomBytes(32).toString('hex')

interface TokenPayload {
  username: string
  iat: number
  exp: number
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  if (secret && secret.length >= 32) return secret
  if (process.env.NODE_ENV === 'production') throw createError({ statusCode: 503, message: 'Konfigurasi sesi belum tersedia.' })
  return devSecret
}

/** Buat token sederhana (HMAC-SHA256 base64url, tanpa library JWT) */
export function signToken(username: string): string {
  const payload: TokenPayload = {
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + EXPIRES_IN,
  }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig  = createHmac('sha256', getSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

/** Verifikasi token — return payload atau null jika invalid/expired */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const [data, sig, extra] = token.split('.')
    if (!data || !sig || extra !== undefined) return null
    const expected = createHmac('sha256', getSecret()).update(data).digest('base64url')
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null
    const payload: TokenPayload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (typeof payload.username !== 'string' || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

/** Set session cookie */
export function setSessionCookie(event: H3Event, username: string) {
  const token = signToken(username)
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.SESSION_COOKIE_SECURE === 'true', // Aktifkan pada deployment HTTPS.
    sameSite: 'lax',
    maxAge:   EXPIRES_IN,
    path:     '/',
  })
}

/** Hapus session cookie (logout) */
export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, { path: '/' })
}

/** Ambil user dari cookie — null jika tidak ada / invalid */
export function getSessionUser(event: H3Event): string | null {
  const token = getCookie(event, COOKIE_NAME)
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.username ?? null
}

/** Guard — lempar 401 jika tidak login */
export function requireAuth(event: H3Event): string {
  const user = getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, message: 'Tidak terautentikasi' })
  return user
}
