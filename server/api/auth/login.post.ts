// server/api/auth/login.post.ts — POST /api/auth/login
import { setSessionCookie } from '../../utils/auth'
import { readJson, text } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readJson(event)
  const username = text(body, 'username', 100, true)

  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminUser || !adminPass) throw createError({ statusCode: 503, message: 'Akun petugas belum dikonfigurasi di server.' })

  if (username !== adminUser || body.password !== adminPass) {
    throw createError({ statusCode: 401, message: 'Username atau password salah' })
  }

  setSessionCookie(event, username)
  return { ok: true, username }
})
