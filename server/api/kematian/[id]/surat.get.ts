import { requireAuth } from '../../../utils/auth'
import { getSqlite } from '../../../database/index'

export default defineEventHandler((event) => {
  requireAuth(event)
  const row = getSqlite().prepare('SELECT surat_nama, surat_tipe, surat_data FROM kematian WHERE id = ?').get(getRouterParam(event, 'id')!)
  if (!row?.surat_data) throw createError({ statusCode: 404, message: 'Surat kematian tidak ditemukan.' })
  setResponseHeaders(event, {
    'Content-Type': String(row.surat_tipe),
    'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(String(row.surat_nama))}`,
    'X-Content-Type-Options': 'nosniff',
  })
  return Buffer.from(row.surat_data as Uint8Array)
})
