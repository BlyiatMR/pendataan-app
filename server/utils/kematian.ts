import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import { getSqlite, transaction } from '../database/index'
import { getKematian, getWarga, logActivity } from './records'
import { choice, invalid, objectBody, text, validateKematian } from './validation'

function validateSurat(value: unknown) {
  if (value === null) return { nama: null, tipe: null, data: null }
  const file = objectBody(value)
  const nama = text(file, 'nama', 150, true).replace(/[\r\n/\\]/g, '_')
  const base64 = text(file, 'base64', 2_796_204, true)
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 !== 0) invalid('Isi berkas tidak valid.', 'surat')
  const data = Buffer.from(base64, 'base64')
  if (!data.length || data.length > 2 * 1024 * 1024) invalid('Ukuran file maksimal 2 MB.', 'surat')
  const pdf = /\.pdf$/i.test(nama) && data.subarray(0, 5).toString() === '%PDF-'
  const jpg = /\.jpe?g$/i.test(nama) && data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff
  if (!pdf && !jpg) invalid('Berkas harus PDF atau JPG yang valid.', 'surat')
  return { nama, tipe: pdf ? 'application/pdf' : 'image/jpeg', data }
}

export function saveKematian(body: Record<string, unknown>, id?: string) {
  const db = getSqlite()
  return transaction(db, () => {
    const existing = id ? getKematian(id) : undefined
    const input = { ...existing, ...body }
    const data = validateKematian(input)
    const wargaId = text(input, 'wargaId', 100)
    if (!wargaId && (!existing || existing.wargaId)) invalid('Pilih warga terlebih dahulu.', 'wargaId')
    // Laporan lama tanpa relasi tetap dapat diubah, tetapi identitasnya tidak dipercayakan ke klien.
    const warga = wargaId ? getWarga(wargaId) : null
    const nama = warga?.namaLengkap ?? existing!.namaAlmarhum
    const nik = warga?.nik ?? existing!.nikAlmarhum
    const rt = warga?.rt ?? existing!.rt
    const rw = warga?.rw ?? existing!.rw
    if (warga?.tanggalLahir && data.tanggalMeninggal < warga.tanggalLahir) invalid('Tanggal meninggal tidak boleh sebelum tanggal lahir.', 'tanggalMeninggal')
    if (db.prepare(`SELECT id FROM kematian WHERE (nik_almarhum = ? OR warga_id = ?) AND id != ?`).get(nik, wargaId, id ?? '')) {
      throw createError({ statusCode: 409, message: 'Laporan kematian warga ini sudah tercatat.' })
    }
    const status = choice(input, 'status', ['Menunggu', 'Terverifikasi']) || 'Menunggu'
    const key = id ?? randomUUID()
    const now = new Date().toISOString()
    const columns = ['warga_id', 'nama_almarhum', 'nik_almarhum', 'rt', 'rw', 'tanggal_meninggal',
      'tempat_meninggal', 'nama_pelapor', 'hubungan_pelapor', 'no_hp_pelapor', 'catatan', 'status']
    const values = [wargaId || null, nama, nik, rt, rw, data.tanggalMeninggal, data.tempatMeninggal,
      data.namaPelapor, data.hubunganPelapor, data.noHpPelapor, data.catatan, status]
    if (id) {
      db.prepare(`UPDATE kematian SET ${columns.map(c => `${c} = ?`).join(',')}, updated_at = ? WHERE id = ?`).run(...values, now, key)
    } else {
      db.prepare(`INSERT INTO kematian (id, ${columns.join(',')}, created_at, updated_at) VALUES (${Array(15).fill('?').join(',')})`).run(key, ...values, now, now)
    }
    if (body.surat !== undefined) {
      const file = validateSurat(body.surat)
      db.prepare('UPDATE kematian SET surat_nama = ?, surat_tipe = ?, surat_data = ? WHERE id = ?').run(file.nama, file.tipe, file.data, key)
    }
    logActivity(wargaId || null, 'kematian', id ? 'Laporan kematian diperbarui' : 'Laporan kematian dicatat', nama, rt, rw)
    return getKematian(key)
  })
}
