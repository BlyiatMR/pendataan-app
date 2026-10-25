import type { KematianList, KematianPayload, KematianRecord } from '~/types/api'
import { formatTanggal, formatRtRw } from '~/utils/format'

export function useKematian() {
  const data = ref<KematianList>({ items: [], stats: [] })
  const feedback = useApiFeedback()
  const get = (id: string) => $fetch<KematianRecord>(`/api/kematian/${encodeURIComponent(id)}`)
  const create = (body: KematianPayload) => $fetch<KematianRecord>('/api/kematian', { method: 'POST', body })
  const update = (id: string, body: KematianPayload) => $fetch<KematianRecord>(`/api/kematian/${encodeURIComponent(id)}`, { method: 'PUT', body })
  const remove = (id: string) => $fetch(`/api/kematian/${encodeURIComponent(id)}`, { method: 'DELETE' })
  const load = () => feedback.run(async () => { data.value = await $fetch<KematianList>('/api/kematian') })
  const rows = computed(() => data.value.items.map(k => ({
    ...k, nama: k.namaAlmarhum, nik: k.nikAlmarhum, pelapor: k.namaPelapor,
    tglTampil: formatTanggal(k.tanggalMeninggal), rtrwTampil: formatRtRw(k.rt, k.rw),
  })))
  return { get, create, update, remove, load, rows, stats: computed(() => data.value.stats), ...feedback }
}
