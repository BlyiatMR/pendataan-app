import type { DashboardResponse } from '~/types/api'

export function useDashboard() {
  const data = ref<DashboardResponse>({ stats: [], grafik: [], aktivitas: [] })
  const feedback = useApiFeedback()
  const load = () => feedback.run(async () => { data.value = await $fetch<DashboardResponse>('/api/dashboard') })
  return {
    statList: computed(() => data.value.stats), grafikData: computed(() => data.value.grafik),
    aktivitasList: computed(() => data.value.aktivitas), load, ...feedback,
  }
}
