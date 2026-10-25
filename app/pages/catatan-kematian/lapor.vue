<script setup lang="ts">
import type { KematianRecord, WargaRecord } from '~/types/api'
const route = useRoute()
const api = useKematian()
const wargaApi = useWarga()
const { error, run } = useApiFeedback()
let initial: KematianRecord | undefined
let resident: WargaRecord | undefined
if (typeof route.query.laporan === 'string') initial = await run(() => api.get(String(route.query.laporan)))
else if (typeof route.query.warga === 'string') resident = await run(() => wargaApi.get(String(route.query.warga)))
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader title="Lapor Warga Meninggal" subtitle="Catat laporan kematian warga Desa Sunggumanai" back-to="/catatan-kematian" />
    <AppFeedback :error="error" />
    <KematianForm v-if="!error" :initial="initial" :resident="resident" />
  </div>
</template>
