import { requireAuth } from '../../utils/auth'
import { readJson } from '../../utils/validation'
import { saveWarga } from '../../utils/records'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  return saveWarga(await readJson(event), getRouterParam(event, 'id')!)
})
