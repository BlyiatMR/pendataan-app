// server/api/auth/me.get.ts — GET /api/auth/me
import { getSessionUser } from '../../utils/auth'

export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) return { authenticated: false, username: null }
  return { authenticated: true, username: user }
})
