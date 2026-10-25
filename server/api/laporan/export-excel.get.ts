import { createRequire } from 'node:module'
import { requireAuth } from '../../utils/auth'
import { monthlyReport } from '../../utils/reports'
import { validatePeriod } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const periode = validatePeriod(getQuery(event).periode)

  // Load xlsx via createRequire untuk menghindari masalah Windows ESM path di Nitro
  let XLSX: typeof import('xlsx')
  try {
    const req = createRequire(import.meta.url)
    XLSX = req('xlsx')
  } catch {
    throw createError({ statusCode: 500, message: 'Library xlsx tidak tersedia. Jalankan: npm install xlsx' })
  }

  const laporanData = monthlyReport(periode)

  const bulanLabel = periodeLabel(periode)

  // Sheet 1 — Statistik Ringkasan
  const statsSheet = XLSX.utils.aoa_to_sheet([
    ['Laporan Bulanan — Desa Sunggumanai'],
    [`Periode: ${bulanLabel}`],
    [],
    ['Metrik', 'Nilai', 'Keterangan'],
    ['Total Warga', laporanData.stats.totalWarga, `Per akhir ${bulanLabel}`],
    ['Warga Meninggal', laporanData.stats.kematian, 'Bulan ini'],
    ['Data Diperbarui', laporanData.stats.diperbarui, 'Bulan ini'],
    ['Warga Baru', laporanData.stats.baru, 'Ditambahkan bulan ini'],
  ])

  // Sheet 2 — Rekap per RW
  const rekap = laporanData.rekap
  const rekapRows = rekap.map(r => [r.rw ? `RW ${r.rw}` : 'Belum diisi', r.kk, r.wargaCount, r.l, r.p, r.meninggal])
  const rekapSheet = XLSX.utils.aoa_to_sheet([
    ['RW', 'Jumlah KK', 'Jumlah Warga', 'Laki-laki', 'Perempuan', 'Meninggal'],
    ...rekapRows,
    [
      'Total',
      laporanData.total.kk,
      rekap.reduce((a, r) => a + r.wargaCount, 0),
      rekap.reduce((a, r) => a + r.l, 0),
      rekap.reduce((a, r) => a + r.p, 0),
      laporanData.stats.kematian,
    ],
  ])

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, statsSheet, 'Statistik')
  XLSX.utils.book_append_sheet(wb, rekapSheet, 'Rekap per RW')

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  setResponseHeaders(event, {
    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="laporan-${periode}.xlsx"`,
  })
  return buf
})

function periodeLabel(p: string): string {
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const [y, m] = p.split('-')
  return `${BULAN[parseInt(m ?? '1') - 1]} ${y}`
}
