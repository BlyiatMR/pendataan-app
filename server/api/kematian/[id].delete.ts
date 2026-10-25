import { requireAuth } from '../../utils/auth'
import { getSqlite, transaction } from '../../database/index'
import { getKematian, logActivity } from '../../utils/records'

export default defineEventHandler((event) => {
  requireAuth(event)
  const db = getSqlite()
  return transaction(db, () => {
    const k = getKematian(getRouterParam(event, 'id')!)
    db.prepare('DELETE FROM kematian WHERE id = ?').run(k.id)
    logActivity(k.wargaId, 'kematian', 'Laporan kematian dihapus', k.namaAlmarhum, k.rt, k.rw)
    return { ok: true }
  })
})
