import { requireAuth } from '../../utils/auth'
import { readJson } from '../../utils/validation'
import { saveWarga } from '../../utils/records'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const item = saveWarga(await readJson(event))
  setResponseStatus(event, 201)
  return item
})
