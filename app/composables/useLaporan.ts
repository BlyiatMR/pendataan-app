import type { LaporanResponse, RekapRw } from '~/types/api'
import { formatAngka } from '~/utils/format'

export function useLaporan() {
  const selectedPeriode = ref(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Makassar' }).format(new Date()).slice(0, 7))
  const data = ref<LaporanResponse>()
  const feedback = useApiFeedback()
  const load = () => feedback.run(async () => { data.value = await $fetch<LaporanResponse>('/api/laporan', { query: { periode: selectedPeriode.value } }) })
  const optPeriode = computed(() => data.value?.periodeOptions ?? [])
  const stats = computed(() => {
    if (!data.value) return []
    const s = data.value.stats
    return [
      { label: 'Total Warga', value: formatAngka(s.totalWarga), caption: `Per akhir ${data.value.periodeLabel}`, icon: 'lucide:users' },
      { label: 'Warga Meninggal', value: formatAngka(s.kematian), caption: 'Bulan ini', icon: 'lucide:heart' },
      { label: 'Data Diperbarui', value: formatAngka(s.diperbarui), caption: 'Bulan ini', icon: 'lucide:pencil' },
      { label: 'Warga Baru', value: formatAngka(s.baru), caption: 'Ditambahkan bulan ini', icon: 'lucide:users' },
    ]
  })
  const formatRow = (r: RekapRw, isTotal = false) => ({
    rw: isTotal ? 'Total' : r.rw ? `RW ${r.rw}` : 'Belum diisi',
    kk: formatAngka(r.kk), warga: formatAngka(r.wargaCount), l: formatAngka(r.l),
    p: formatAngka(r.p), meninggal: r.meninggal, isTotal,
  })
  const rows = computed(() => data.value ? [...data.value.rekap.map(r => formatRow(r)), formatRow(data.value.total, true)] : [])
  const kolom = [
    { key: 'rw', label: 'RW' }, { key: 'kk', label: 'Jumlah KK' }, { key: 'warga', label: 'Jumlah Warga' },
    { key: 'l', label: 'Laki-laki' }, { key: 'p', label: 'Perempuan' }, { key: 'meninggal', label: 'Meninggal' },
  ]
  async function download(format: 'pdf' | 'excel') {
    await feedback.run(async () => {
      const blob = await $fetch<Blob>(`/api/laporan/export-${format}`, { query: { periode: selectedPeriode.value }, responseType: 'blob' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `laporan-${selectedPeriode.value}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    })
  }
  watch(selectedPeriode, load)
  return { selectedPeriode, optPeriode, stats, rows, kolom, gridTemplate: '110px 1fr 150px 130px 130px 130px', load, download, ...feedback }
}
