import { requireAuth } from '../../utils/auth'
import { getWarga } from '../../utils/records'

export default defineEventHandler((event) => {
  requireAuth(event)
  return getWarga(getRouterParam(event, 'id')!)
})
