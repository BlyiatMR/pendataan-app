import type { DashboardResponse, LaporanResponse, RekapRw, StatItem } from '../../app/types/api'
import { getSqlite } from '../database/index'
import { wargaRecord, type DbRow } from './records'
import { currentPeriod } from './validation'

const longMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
const number = (value: number) => value.toLocaleString('id-ID')
export const periodLabel = (period: string) => `${longMonths[Number(period.slice(5)) - 1]} ${period.slice(0, 4)}`
export function shiftPeriod(period: string, shift: number) {
  return new Date(Date.UTC(Number(period.slice(0, 4)), Number(period.slice(5)) - 1 + shift, 1)).toISOString().slice(0, 7)
}

export function deathStats(): StatItem[] {
  const db = getSqlite()
  const period = currentPeriod()
  const previous = shiftPeriod(period, -1)
  const count = (p: string) => Number(db.prepare('SELECT COUNT(*) AS c FROM kematian WHERE substr(tanggal_meninggal,1,7) = ?').get(p)!.c)
  const pending = Number(db.prepare("SELECT COUNT(*) AS c FROM kematian WHERE status = 'Menunggu'").get()!.c)
  return [
    { label: 'Bulan Ini', value: number(count(period)), caption: periodLabel(period), icon: 'lucide:heart' },
    { label: 'Bulan Lalu', value: number(count(previous)), caption: periodLabel(previous), icon: 'lucide:calendar' },
    { label: 'Menunggu Verifikasi', value: number(pending), caption: 'Perlu ditinjau admin', icon: 'lucide:triangle-alert' },
  ]
}

export function monthlyReport(period: string): LaporanResponse {
  const db = getSqlite()
  // Snapshot terakhir per warga pada akhir periode. Delete tidak menghilangkan bulan sebelumnya.
  const snapshots = db.prepare(`WITH ranked AS (
    SELECT aksi, snapshot, ROW_NUMBER() OVER (PARTITION BY warga_id ORDER BY waktu DESC, id DESC) AS position
    FROM aktivitas WHERE aksi IN ('create','update','delete')
    AND substr(datetime(waktu, '+8 hours'),1,7) <= ?
  ) SELECT snapshot FROM ranked WHERE position = 1 AND aksi != 'delete'`).all(period)
  const residents = snapshots.map(s => wargaRecord(JSON.parse(String(s.snapshot)) as DbRow))
  const deaths = db.prepare('SELECT rw FROM kematian WHERE substr(tanggal_meninggal,1,7) = ?').all(period)
  const keys = new Set(['01', '02', '03', '04', ...residents.map(w => w.rw), ...deaths.map(k => String(k.rw ?? ''))])
  const rekap: RekapRw[] = [...keys].sort().map(rw => {
    const rows = residents.filter(w => w.rw === rw)
    return {
      rw, kk: new Set(rows.map(w => w.noKk).filter(Boolean)).size, wargaCount: rows.length,
      l: rows.filter(w => w.jenisKelamin === 'L').length, p: rows.filter(w => w.jenisKelamin === 'P').length,
      meninggal: deaths.filter(k => String(k.rw ?? '') === rw).length,
    }
  })
  const countEvents = (action: string) => Number(db.prepare(`SELECT COUNT(DISTINCT warga_id) AS c FROM aktivitas
    WHERE aksi = ? AND substr(datetime(waktu, '+8 hours'),1,7) = ?`).get(action, period)!.c)
  const total: RekapRw = {
    rw: 'Total', kk: new Set(residents.map(w => w.noKk).filter(Boolean)).size,
    wargaCount: residents.length, l: rekap.reduce((n, r) => n + r.l, 0),
    p: rekap.reduce((n, r) => n + r.p, 0), meninggal: deaths.length,
  }
  const periods = new Set<string>([period])
  const now = currentPeriod()
  for (let i = 0; i < 12; i++) periods.add(shiftPeriod(now, -i))
  for (const row of db.prepare(`SELECT DISTINCT substr(datetime(waktu, '+8 hours'),1,7) AS periode FROM aktivitas
    UNION SELECT DISTINCT substr(tanggal_meninggal,1,7) AS periode FROM kematian`).all()) {
    const p = String(row.periode ?? '')
    if (/^\d{4}-\d{2}$/.test(p) && p <= now) periods.add(p)
  }
  return {
    periode: period, periodeLabel: periodLabel(period),
    periodeOptions: [...periods].sort().reverse().map(value => ({ value, label: periodLabel(value) })),
    stats: { totalWarga: residents.length, kematian: deaths.length, diperbarui: countEvents('update'), baru: countEvents('create') },
    rekap, total,
  }
}

export function dashboardReport(): DashboardResponse {
  const db = getSqlite()
  const period = currentPeriod()
  const report = monthlyReport(period)
  const pending = Number(db.prepare("SELECT COUNT(*) AS c FROM kematian WHERE status = 'Menunggu' AND substr(tanggal_meninggal,1,7) = ?").get(period)!.c)
  const rw = Number(db.prepare("SELECT COUNT(DISTINCT rw) AS c FROM warga WHERE COALESCE(rw,'') != ''").get()!.c)
  const completeFields = ['jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'agama', 'status_perkawinan', 'pekerjaan', 'alamat', 'rt', 'rw', 'dusun']
  const incomplete = Number(db.prepare(`SELECT COUNT(*) AS c FROM warga WHERE ${completeFields.map(k => `COALESCE(TRIM(${k}),'') = ''`).join(' OR ')}`).get()!.c)
  return {
    stats: [
      { label: 'Total Warga', value: number(report.stats.totalWarga), caption: `Data per ${periodLabel(period)}`, icon: 'lucide:users' },
      { label: 'Kartu Keluarga', value: number(report.total.kk), caption: `Tersebar di ${rw} RW`, icon: 'lucide:file-text' },
      { label: 'Kematian Bulan Ini', value: number(report.stats.kematian), caption: `${pending} menunggu verifikasi`, icon: 'lucide:heart' },
      { label: 'Data Belum Lengkap', value: number(incomplete), caption: 'Perlu dilengkapi petugas', icon: 'lucide:triangle-alert' },
    ],
    grafik: Array.from({ length: 6 }, (_, i) => {
      const p = shiftPeriod(period, i - 5)
      return { label: shortMonths[Number(p.slice(5)) - 1]!, value: Number(db.prepare('SELECT COUNT(*) AS c FROM kematian WHERE substr(tanggal_meninggal,1,7) = ?').get(p)!.c) }
    }),
    aktivitas: db.prepare('SELECT judul, nama, rt, rw, waktu FROM aktivitas ORDER BY waktu DESC, id DESC LIMIT 4').all().map(a => ({
      judul: String(a.judul), sub: `${a.nama} • RT ${a.rt || '–'} / RW ${a.rw || '–'}`,
      waktu: new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Makassar', day: '2-digit', month: 'short' }).format(new Date(String(a.waktu))),
    })),
  }
}
