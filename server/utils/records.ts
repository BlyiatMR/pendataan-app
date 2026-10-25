import { randomUUID } from 'node:crypto'
import { createError } from 'h3'
import type { SQLOutputValue } from 'node:sqlite'
import type { WargaRecord, KematianRecord } from '../../app/types/api'
import { getSqlite, transaction } from '../database/index'
import { validateWarga } from './validation'

export type DbRow = Record<string, SQLOutputValue>
const str = (row: DbRow, key: string) => String(row[key] ?? '')

export function wargaRecord(row: DbRow): WargaRecord {
  return {
    id: str(row, 'id'), nik: str(row, 'nik'), noKk: str(row, 'no_kk'),
    namaLengkap: str(row, 'nama_lengkap'), jenisKelamin: str(row, 'jenis_kelamin'),
    tempatLahir: str(row, 'tempat_lahir'), tanggalLahir: str(row, 'tanggal_lahir'),
    agama: str(row, 'agama'), statusPerkawinan: str(row, 'status_perkawinan'), pekerjaan: str(row, 'pekerjaan'),
    kewarganegaraan: str(row, 'kewarganegaraan'), alamat: str(row, 'alamat'),
    rt: str(row, 'rt'), rw: str(row, 'rw'), dusun: str(row, 'dusun'), statusWarga: str(row, 'status_warga'),
    createdAt: str(row, 'created_at'), updatedAt: str(row, 'updated_at'), riwayat: [],
  }
}

export function getWarga(id: string) {
  const db = getSqlite()
  const row = db.prepare('SELECT * FROM warga WHERE id = ?').get(id)
  if (!row) throw createError({ statusCode: 404, message: 'Warga tidak ditemukan.' })
  const record = wargaRecord(row)
  record.riwayat = db.prepare(`SELECT judul, aktor, waktu FROM aktivitas
    WHERE warga_id = ? AND aksi IN ('create', 'update') ORDER BY waktu DESC, id DESC`).all(id)
    .map(r => ({ judul: str(r, 'judul'), aktor: str(r, 'aktor'), tanggal: str(r, 'waktu') }))
  return record
}

export function logActivity(id: string | null, aksi: string, judul: string, nama: string, rt: string, rw: string, snapshot: DbRow | null = null) {
  getSqlite().prepare(`INSERT INTO aktivitas
    (warga_id, aksi, judul, nama, rt, rw, aktor, waktu, snapshot) VALUES (?,?,?,?,?,?,?,?,?)`)
    .run(id, aksi, judul, nama, rt, rw, 'Admin Desa', new Date().toISOString(), snapshot ? JSON.stringify(snapshot) : null)
}

export function saveWarga(body: Record<string, unknown>, id?: string) {
  const db = getSqlite()
  return transaction(db, () => {
    const existing = id ? getWarga(id) : undefined
    const w = validateWarga({ ...existing, ...body })
    if (db.prepare('SELECT id FROM warga WHERE nik = ? AND id != ?').get(w.nik, id ?? '')) {
      throw createError({ statusCode: 409, message: 'NIK sudah terdaftar.', data: { field: 'nik' } })
    }
    const key = id ?? randomUUID()
    const now = new Date().toISOString()
    const columns = ['nik', 'no_kk', 'nama_lengkap', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
      'agama', 'status_perkawinan', 'pekerjaan', 'kewarganegaraan', 'alamat', 'rt', 'rw', 'dusun', 'status_warga']
    const values = [w.nik, w.noKk, w.namaLengkap, w.jenisKelamin, w.tempatLahir, w.tanggalLahir,
      w.agama, w.statusPerkawinan, w.pekerjaan, w.kewarganegaraan, w.alamat, w.rt, w.rw, w.dusun, w.statusWarga]
    if (id) {
      db.prepare(`UPDATE warga SET ${columns.map(c => `${c} = ?`).join(',')}, updated_at = ? WHERE id = ?`).run(...values, now, key)
    } else {
      db.prepare(`INSERT INTO warga (id, ${columns.join(',')}, created_at, updated_at) VALUES (${Array(18).fill('?').join(',')})`).run(key, ...values, now, now)
    }
    logActivity(key, id ? 'update' : 'create', id ? 'Data warga diperbarui' : 'Data warga ditambahkan', w.namaLengkap, w.rt, w.rw,
      db.prepare('SELECT * FROM warga WHERE id = ?').get(key)!)
    return getWarga(key)
  })
}

export const kematianColumns = `id, warga_id, nama_almarhum, nik_almarhum, rt, rw, tanggal_meninggal,
  tempat_meninggal, nama_pelapor, hubungan_pelapor, no_hp_pelapor, catatan, status,
  surat_nama, created_at, updated_at`

export function kematianRecord(row: DbRow): KematianRecord {
  return {
    id: str(row, 'id'), wargaId: row.warga_id ? str(row, 'warga_id') : null,
    namaAlmarhum: str(row, 'nama_almarhum'), nikAlmarhum: str(row, 'nik_almarhum'),
    rt: str(row, 'rt'), rw: str(row, 'rw'), tanggalMeninggal: str(row, 'tanggal_meninggal'),
    tempatMeninggal: str(row, 'tempat_meninggal'), namaPelapor: str(row, 'nama_pelapor'),
    hubunganPelapor: str(row, 'hubungan_pelapor'), noHpPelapor: str(row, 'no_hp_pelapor'), catatan: str(row, 'catatan'),
    status: row.status === 'Terverifikasi' ? 'Terverifikasi' : 'Menunggu',
    suratNama: row.surat_nama ? str(row, 'surat_nama') : null,
    createdAt: str(row, 'created_at'), updatedAt: str(row, 'updated_at') || str(row, 'created_at'),
  }
}

export function getKematian(id: string) {
  const row = getSqlite().prepare(`SELECT ${kematianColumns} FROM kematian WHERE id = ?`).get(id)
  if (!row) throw createError({ statusCode: 404, message: 'Laporan kematian tidak ditemukan.' })
  return kematianRecord(row)
}
