// format.ts — Semua utilitas format teks (docs/06 §5)

const BULAN_SINGKAT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const BULAN_PANJANG = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

/** "02 Agu 2026" — untuk tabel, aktivitas */
export const formatTanggal = (d: Date | string): string => {
  const x = new Date(typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d)
  if (!Number.isFinite(x.getTime())) return '–'
  return `${String(x.getDate()).padStart(2, '0')} ${BULAN_SINGKAT[x.getMonth()]} ${x.getFullYear()}`
}

/** "Gowa, 12 Mei 1988" — untuk Tempat, Tanggal Lahir di detail */
export const formatTanggalPanjang = (d: Date | string): string => {
  const x = new Date(typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00` : d)
  if (!Number.isFinite(x.getTime())) return '–'
  return `${String(x.getDate()).padStart(2, '0')} ${BULAN_PANJANG[x.getMonth()]} ${x.getFullYear()}`
}

/** "Oktober 2026" — untuk select laporan */
export const formatBulanTahun = (d: Date | string): string => {
  const x = new Date(d)
  return `${BULAN_PANJANG[x.getMonth()]} ${x.getFullYear()}`
}

/** 1.248 — titik ribuan id-ID */
export const formatAngka = (n: number): string => n.toLocaleString('id-ID')

/** "01 / 02" — RT / RW */
export const formatRtRw = (rt: number | string, rw: number | string): string =>
  `${rt === '' ? '–' : String(rt).padStart(2, '0')} / ${rw === '' ? '–' : String(rw).padStart(2, '0')}`

/**
 * Inisial dari dua kata pertama nama.
 * "Andi Baso" → "AB", "Hj. Marhani" → "HM", "Admin Desa" → "AD"
 */
export const inisial = (nama: string): string =>
  nama.trim().split(/\s+/).slice(0, 2).map(k => k[0]!.toUpperCase()).join('')
