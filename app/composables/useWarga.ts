import type { WargaList, WargaPayload, WargaRecord } from '~/types/api'
import { formatTanggal, formatTanggalPanjang } from '~/utils/format'

export function useWarga() {
  const query = ref('')
  const filterRw = ref('')
  const filterRt = ref('')
  const filterStatus = ref('')
  const halaman = ref(1)
  const displayRows = ref<ReturnType<typeof presentation>[]>([])
  const displayTotal = ref(0)
  const feedback = useApiFeedback()
  const PER_HALAMAN = 6
  const applied = ref({ q: '', rw: '', rt: '', status: '' })

  function presentation(w: WargaRecord) {
    return { ...w, nama: w.namaLengkap, jk: w.jenisKelamin, status: w.statusWarga, diperbarui: w.updatedAt }
  }

  const list = (params: Record<string, string | number> = {}) => $fetch<WargaList>('/api/warga', { query: params })
  const get = (id: string) => $fetch<WargaRecord>(`/api/warga/${encodeURIComponent(id)}`)
  const getDetail = async (id: string) => presentation(await get(id))
  const create = (body: WargaPayload) => $fetch<WargaRecord>('/api/warga', { method: 'POST', body })
  const update = (id: string, body: WargaPayload) => $fetch<WargaRecord>(`/api/warga/${encodeURIComponent(id)}`, { method: 'PUT', body })
  const remove = (id: string) => $fetch(`/api/warga/${encodeURIComponent(id)}`, { method: 'DELETE' })

  async function load() {
    await feedback.run(async () => {
      const result = await list({ ...applied.value, page: halaman.value })
      displayRows.value = result.items.map(presentation)
      displayTotal.value = result.total
      halaman.value = result.page
    })
  }

  async function applyFilter() {
    if (feedback.busy.value) return
    applied.value = { q: query.value, rw: filterRw.value, rt: filterRt.value, status: filterStatus.value }
    halaman.value = 1
    await load()
  }

  async function goToPage(page: number) {
    if (feedback.busy.value) return
    halaman.value = page
    await load()
  }

  return {
    query, filterRw, filterRt, filterStatus, halaman, displayRows, displayTotal, PER_HALAMAN,
    list, get, getDetail, create, update, remove, load, applyFilter, goToPage, ...feedback,
    labelJk: (jk: string) => jk === 'L' ? 'Laki-laki' : jk === 'P' ? 'Perempuan' : '–',
    formatTempatTanggalLahir: (tempat: string, tanggal: string) => [tempat, tanggal ? formatTanggalPanjang(tanggal) : ''].filter(Boolean).join(', ') || '–',
    formatTanggal,
  }
}
