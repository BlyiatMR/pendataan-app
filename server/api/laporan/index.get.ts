import { requireAuth } from '../../utils/auth'
import { validatePeriod } from '../../utils/validation'
import { monthlyReport } from '../../utils/reports'

export default defineEventHandler((event) => {
  requireAuth(event)
  return monthlyReport(validatePeriod(getQuery(event).periode))
})
