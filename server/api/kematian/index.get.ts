import { requireAuth } from '../../utils/auth'
import { getSqlite } from '../../database/index'
import { kematianColumns, kematianRecord } from '../../utils/records'
import { deathStats } from '../../utils/reports'

export default defineEventHandler((event) => {
  requireAuth(event)
  const items = getSqlite().prepare(`SELECT ${kematianColumns} FROM kematian ORDER BY tanggal_meninggal DESC, id`).all().map(kematianRecord)
  return { items, stats: deathStats() }
})
