<script setup lang="ts">
import type { WargaRecord, WargaList } from '~/types/api'
export interface ResidentChoice {
  id: string | null
  namaLengkap: string
  nik: string
  rt: string
  rw: string
}
defineProps<{ modelValue: ResidentChoice | null; error?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: ResidentChoice] }>()
const query = ref('')
const page = ref(1)
const result = ref<WargaList>({ items: [], page: 1, total: 0, perPage: 6 })
const pending = ref(false)
const searchError = ref('')
const { list } = useWarga()
let timer: ReturnType<typeof setTimeout> | undefined
let version = 0

async function search() {
  const request = ++version
  searchError.value = ''
  if (!query.value.trim()) {
    result.value.items = []
    pending.value = false
    return
  }
  pending.value = true
  try {
    const data = await list({ q: query.value, page: page.value })
    if (request === version) result.value = data
  } catch {
    if (request === version) searchError.value = 'Pencarian gagal. Silakan coba lagi.'
  } finally {
    if (request === version) pending.value = false
  }
}
watch(query, () => {
  version++
  result.value.items = []
  page.value = 1
  clearTimeout(timer)
  timer = setTimeout(search, 250)
})
function choose(warga: WargaRecord) {
  emit('update:modelValue', warga)
  query.value = ''
}
async function changePage(value: number) { page.value = value; await search() }
onScopeDispose(() => { clearTimeout(timer); version++ })
</script>

<template>
  <div class="flex flex-col gap-4">
    <AppField v-model="query" type="search" label="Cari Warga" placeholder="Ketik NIK atau nama warga..." :error="error" />
    <div v-if="query.trim()" class="flex flex-col gap-3">
      <AppFeedback :error="searchError" :pending="pending" :empty="!result.items.length" />
      <AppButton v-for="w in result.items" :key="w.id" variant="secondary" @click="choose(w)">
        {{ w.namaLengkap }} • {{ w.nik }}
      </AppButton>
      <Pagination v-if="result.total > 6" :current-page="page" :total="result.total" :disabled="pending" @update:current-page="changePage" />
    </div>
    <SelectedResidentCard v-if="modelValue" :nama="modelValue.namaLengkap" :nik="modelValue.nik" :rt="modelValue.rt" :rw="modelValue.rw" />
  </div>
</template>
