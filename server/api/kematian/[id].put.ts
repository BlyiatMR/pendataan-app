import { requireAuth } from '../../utils/auth'
import { readJson } from '../../utils/validation'
import { saveKematian } from '../../utils/kematian'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  return saveKematian(await readJson(event), getRouterParam(event, 'id')!)
})
