import { createError, getRequestHeader, readBody, type H3Event } from 'h3'
import { optAgama, optDusun, optHubunganPelapor, optStatusPerkawinan } from '../../app/data/options'

export function invalid(message: string, field?: string): never {
  throw createError({ statusCode: 422, message, data: field ? { field } : undefined })
}

export function objectBody(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) invalid('Data harus berupa objek.')
  return value as Record<string, unknown>
}

export async function readJson(event: H3Event) {
  if (!getRequestHeader(event, 'content-type')?.startsWith('application/json')) {
    throw createError({ statusCode: 415, message: 'Gunakan format application/json.' })
  }
  return objectBody(await readBody<unknown>(event))
}

export function text(body: Record<string, unknown>, field: string, max = 255, required = false) {
  const value = body[field] ?? ''
  if (typeof value !== 'string') invalid('Nilai harus berupa teks.', field)
  const result = value.trim()
  if (required && !result) invalid('Field ini wajib diisi.', field)
  if (result.length > max) invalid(`Maksimal ${max} karakter.`, field)
  return result
}

export function choice(body: Record<string, unknown>, field: string, options: string[]) {
  const value = text(body, field)
  if (value && !options.includes(value)) invalid('Pilihan tidak valid.', field)
  return value
}

export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date())
export const currentPeriod = () => today().slice(0, 7)

export function dateValue(body: Record<string, unknown>, field: string, required = false) {
  let value = text(body, field, 32, required)
  if (!value) return ''
  const local = /^(\d{2})\s*\/\s*(\d{2})\s*\/\s*(\d{4})$/.exec(value)
  if (local) value = `${local[3]}-${local[2]}-${local[1]}`
  const parsed = new Date(`${value}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
    invalid('Tanggal tidak valid. Gunakan DD / MM / YYYY.', field)
  }
  if (value > today()) invalid('Tanggal tidak boleh di masa depan.', field)
  return value
}

export function validateWarga(body: Record<string, unknown>) {
  const nik = text(body, 'nik', 16, true)
  const noKk = text(body, 'noKk', 16, true)
  if (!/^\d{16}$/.test(nik)) invalid('NIK harus 16 digit.', 'nik')
  if (!/^\d{16}$/.test(noKk)) invalid('No. KK harus 16 digit.', 'noKk')
  const wilayah = (key: string) => {
    const value = text(body, key, 2)
    if (value && !/^\d{1,2}$/.test(value)) invalid('Gunakan 1–2 digit.', key)
    return value ? value.padStart(2, '0') : ''
  }
  return {
    nik, noKk, namaLengkap: text(body, 'namaLengkap', 150, true),
    jenisKelamin: choice(body, 'jenisKelamin', ['L', 'P']),
    tempatLahir: text(body, 'tempatLahir'), tanggalLahir: dateValue(body, 'tanggalLahir'),
    agama: choice(body, 'agama', optAgama.map(o => o.value)),
    statusPerkawinan: choice(body, 'statusPerkawinan', optStatusPerkawinan.map(o => o.value)),
    pekerjaan: text(body, 'pekerjaan'), kewarganegaraan: text(body, 'kewarganegaraan', 50) || 'WNI',
    alamat: text(body, 'alamat', 1000), rt: wilayah('rt'), rw: wilayah('rw'),
    dusun: choice(body, 'dusun', optDusun.map(o => o.value)),
    statusWarga: choice(body, 'statusWarga', ['Tetap', 'Pendatang']) || 'Tetap',
  }
}

export function validateKematian(body: Record<string, unknown>) {
  const phone = text(body, 'noHpPelapor', 25)
  if (phone && !/^\+?[\d\s()-]{8,25}$/.test(phone)) invalid('Nomor HP tidak valid.', 'noHpPelapor')
  return {
    tanggalMeninggal: dateValue(body, 'tanggalMeninggal', true),
    tempatMeninggal: text(body, 'tempatMeninggal'), namaPelapor: text(body, 'namaPelapor', 150, true),
    hubunganPelapor: choice(body, 'hubunganPelapor', optHubunganPelapor.map(o => o.value)),
    noHpPelapor: phone, catatan: text(body, 'catatan', 2000),
  }
}

export function validatePeriod(value: unknown) {
  const period = value === undefined ? currentPeriod() : value
  if (typeof period !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(period) || period < '1900-01' || period > currentPeriod()) {
    invalid('Periode tidak valid.')
  }
  return period
}
