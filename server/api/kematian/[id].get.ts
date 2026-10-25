import { requireAuth } from '../../utils/auth'
import { getKematian } from '../../utils/records'

export default defineEventHandler((event) => {
  requireAuth(event)
  return getKematian(getRouterParam(event, 'id')!)
})
