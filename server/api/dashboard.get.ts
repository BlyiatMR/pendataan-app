import { requireAuth } from '../utils/auth'
import { dashboardReport } from '../utils/reports'

export default defineEventHandler((event) => {
  requireAuth(event)
  return dashboardReport()
})
