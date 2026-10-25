import { requireAuth } from '../../utils/auth'
import { readJson } from '../../utils/validation'
import { saveKematian } from '../../utils/kematian'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const item = saveKematian(await readJson(event))
  setResponseStatus(event, 201)
  return item
})
