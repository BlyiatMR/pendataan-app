// server/api/laporan/export-pdf.get.ts — GET /api/laporan/export-pdf?periode=2026-10
import { requireAuth } from '../../utils/auth'
import { monthlyReport } from '../../utils/reports'
import { validatePeriod } from '../../utils/validation'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const periode = validatePeriod(getQuery(event).periode)

  // Import jsPDF secara lazy
  let jsPDF: typeof import('jspdf')['jsPDF']
  let autoTable: typeof import('jspdf-autotable')['default']
  try {
    const jspdfMod = await import('jspdf')
    const autoMod  = await import('jspdf-autotable')
    jsPDF     = jspdfMod.jsPDF
    autoTable = autoMod.default
  } catch {
    throw createError({ statusCode: 500, message: 'Library jspdf tidak tersedia. Jalankan: npm install jspdf jspdf-autotable' })
  }

  const laporanData = monthlyReport(periode)

  const bulanLabel = periodeLabel(periode)
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('LAPORAN BULANAN', 105, 18, { align: 'center' })
  doc.setFontSize(11)
  doc.text('Desa Sunggumanai, Kabupaten Gowa, Sulawesi Selatan', 105, 25, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Periode: ${bulanLabel}`, 105, 32, { align: 'center' })

  doc.setDrawColor(85, 122, 69)
  doc.setLineWidth(0.5)
  doc.line(14, 36, 196, 36)

  // Tabel statistik
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Statistik Ringkasan', 14, 44)

  autoTable(doc, {
    startY: 48,
    head: [['Metrik', 'Nilai', 'Keterangan']],
    body: [
      ['Total Warga', String(laporanData.stats.totalWarga), `Per akhir ${bulanLabel}`],
      ['Warga Meninggal', String(laporanData.stats.kematian), 'Bulan ini'],
      ['Data Diperbarui', String(laporanData.stats.diperbarui), 'Bulan ini'],
      ['Warga Baru', String(laporanData.stats.baru), 'Ditambahkan bulan ini'],
    ],
    headStyles: { fillColor: [85, 122, 69], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [238, 242, 232] },
    styles: { fontSize: 10 },
  })

  // Tabel rekap
  const afterStats = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Rekap Penduduk per RW', 14, afterStats)

  const rekap = laporanData.rekap
  autoTable(doc, {
    startY: afterStats + 4,
    head: [['RW', 'Jumlah KK', 'Jumlah Warga', 'Laki-laki', 'Perempuan', 'Meninggal']],
    body: [
      ...rekap.map(r => [r.rw ? `RW ${r.rw}` : 'Belum diisi', r.kk, r.wargaCount, r.l, r.p, r.meninggal]),
      ['Total',
        laporanData.total.kk,
        rekap.reduce((a, r) => a + r.wargaCount, 0),
        rekap.reduce((a, r) => a + r.l, 0),
        rekap.reduce((a, r) => a + r.p, 0),
        laporanData.stats.kematian,
      ],
    ],
    headStyles: { fillColor: [85, 122, 69], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [238, 242, 232] },
    styles: { fontSize: 10 },
  })

  const pageH = doc.internal.pageSize.height
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(95, 107, 88)
  doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, pageH - 10)
  doc.text('SI Pendataan Warga — Desa Sunggumanai', 196, pageH - 10, { align: 'right' })

  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  setResponseHeaders(event, {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="laporan-${periode}.pdf"`,
  })
  return pdfBuffer
})

function periodeLabel(p: string): string {
  const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
  const [y, m] = p.split('-')
  return `${BULAN[parseInt(m ?? '1') - 1]} ${y}`
}
