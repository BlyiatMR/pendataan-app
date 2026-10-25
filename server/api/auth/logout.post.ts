// server/api/auth/logout.post.ts — POST /api/auth/logout
import { clearSessionCookie } from '../../utils/auth'

export default defineEventHandler((event) => {
  clearSessionCookie(event)
  return { ok: true }
})
