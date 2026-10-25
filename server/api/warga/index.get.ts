import { requireAuth } from '../../utils/auth'
import { getSqlite } from '../../database/index'
import { wargaRecord } from '../../utils/records'
import { invalid } from '../../utils/validation'

export default defineEventHandler((event) => {
  requireAuth(event)
  const db = getSqlite()
  const query = getQuery(event)
  const filters: Record<string, string> = {}
  for (const key of ['q', 'rw', 'rt', 'status', 'page']) {
    const value = query[key] ?? ''
    if (typeof value !== 'string' || value.length > 150) invalid('Filter tidak valid.')
    filters[key] = value.trim()
  }
  const requestedPage = Number(filters.page || 1)
  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) invalid('Halaman tidak valid.')
  const conditions: string[] = []
  const params: string[] = []
  if (filters.q) {
    conditions.push("(nik LIKE ? ESCAPE '\\' OR nama_lengkap LIKE ? ESCAPE '\\')")
    const pattern = `%${filters.q.replace(/[\\%_]/g, '\\$&')}%`
    params.push(pattern, pattern)
  }
  for (const key of ['rw', 'rt']) {
    if (filters[key]) {
      const value = filters[key]!.replace(new RegExp(`^${key}`, 'i'), '')
      if (!/^\d{1,2}$/.test(value)) invalid('Wilayah tidak valid.')
      conditions.push(`${key} = ?`)
      params.push(value.padStart(2, '0'))
    }
  }
  if (filters.status) {
    if (!['Tetap', 'Pendatang'].includes(filters.status)) invalid('Status warga tidak valid.')
    conditions.push('status_warga = ?')
    params.push(filters.status)
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const total = Number(db.prepare(`SELECT COUNT(*) AS total FROM warga ${where}`).get(...params)!.total)
  const perPage = 6
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(total / perPage)))
  const items = db.prepare(`SELECT * FROM warga ${where} ORDER BY created_at DESC, id ASC LIMIT ? OFFSET ?`)
    .all(...params, perPage, (page - 1) * perPage).map(wargaRecord)
  return { items, total, perPage, page }
})
