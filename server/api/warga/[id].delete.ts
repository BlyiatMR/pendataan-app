import { requireAuth } from '../../utils/auth'
import { getSqlite, transaction } from '../../database/index'
import { getWarga, logActivity } from '../../utils/records'

export default defineEventHandler((event) => {
  requireAuth(event)
  const db = getSqlite()
  return transaction(db, () => {
    const w = getWarga(getRouterParam(event, 'id')!)
    if (db.prepare('SELECT 1 FROM kematian WHERE warga_id = ? OR nik_almarhum = ?').get(w.id, w.nik)) {
      throw createError({ statusCode: 409, message: 'Warga masih memiliki laporan kematian. Hapus laporan terkait terlebih dahulu.' })
    }
    logActivity(w.id, 'delete', 'Data warga dihapus', w.namaLengkap, w.rt, w.rw)
    db.prepare('DELETE FROM warga WHERE id = ?').run(w.id)
    return { ok: true }
  })
})
