<script setup lang="ts">
import type { KematianRecord, KematianPayload, SuratUpload } from '~/types/api'
import type { ResidentChoice } from './WargaPicker.vue'
import { optHubunganPelapor } from '~/data/options'

const props = defineProps<{ initial?: KematianRecord; resident?: ResidentChoice }>()
const api = useKematian()
const { busy, error, errors, run } = useApiFeedback()
const selected = ref<ResidentChoice | null>(props.resident ?? (props.initial ? {
  id: props.initial.wargaId, namaLengkap: props.initial.namaAlmarhum,
  nik: props.initial.nikAlmarhum, rt: props.initial.rt, rw: props.initial.rw,
} : null))
const form = reactive({
  tanggalMeninggal: props.initial?.tanggalMeninggal.split('-').reverse().join(' / ') ?? '',
  tempatMeninggal: props.initial?.tempatMeninggal ?? '', namaPelapor: props.initial?.namaPelapor ?? '',
  hubunganPelapor: props.initial?.hubunganPelapor ?? '', noHpPelapor: props.initial?.noHpPelapor ?? '',
  catatan: props.initial?.catatan ?? '',
})
const file = ref<File | null>(null)
const fileError = ref('')
watch(form, () => { error.value = ''; errors.value = {} })
watch(selected, () => { error.value = ''; errors.value = {} })
function selectFile(value: File) { file.value = value; fileError.value = '' }

async function encodeFile(value: File): Promise<SuratUpload> {
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result).split(',')[1]!)
    reader.onerror = () => reject(new Error('Berkas tidak dapat dibaca.'))
    reader.readAsDataURL(value)
  })
  return { nama: value.name, base64 }
}
async function save() {
  if (!selected.value) { error.value = 'Pilih warga terlebih dahulu.'; return }
  if (fileError.value) return
  const saved = await run(async () => {
    const body: KematianPayload = { ...form, wargaId: selected.value!.id }
    if (file.value) body.surat = await encodeFile(file.value)
    return props.initial ? api.update(props.initial.id, body) : api.create(body)
  })
  if (saved) await navigateTo('/catatan-kematian')
}
async function hapus() {
  if (!props.initial || !window.confirm('Hapus laporan kematian ini beserta suratnya? Tindakan ini tidak dapat dibatalkan.')) return
  const result = await run(() => api.remove(props.initial!.id))
  if (result) await navigateTo('/catatan-kematian')
}
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="save">
    <AppCard :padding="6">
      <div class="flex flex-col gap-4">
        <p class="text-16 font-semibold text-ink">Warga yang Meninggal</p>
        <WargaPicker v-model="selected" :error="errors.wargaId" />
        <div class="border-t border-line" />
        <p class="text-16 font-semibold text-ink">Detail Kejadian</p>
        <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <AppField v-model="form.tanggalMeninggal" label="Tanggal Meninggal" placeholder="DD / MM / YYYY" required :error="errors.tanggalMeninggal" />
          <AppField v-model="form.tempatMeninggal" label="Tempat Meninggal" placeholder="Rumah / Rumah sakit" :error="errors.tempatMeninggal" />
          <AppField v-model="form.namaPelapor" label="Nama Pelapor" placeholder="Nama lengkap pelapor" required :error="errors.namaPelapor" />
          <AppField v-model="form.hubunganPelapor" label="Hubungan Pelapor" placeholder="Pilih hubungan" type="select" :options="optHubunganPelapor" :error="errors.hubunganPelapor" />
          <AppField v-model="form.noHpPelapor" label="No. HP Pelapor" placeholder="08xx xxxx xxxx" :error="errors.noHpPelapor" />
          <AppField v-model="form.catatan" label="Catatan" placeholder="Opsional" :error="errors.catatan" />
        </div>
        <UploadDropzone :file-name="file?.name || initial?.suratNama || ''" @file-selected="selectFile" @error="fileError = $event" />
        <AppFeedback :error="fileError || errors.surat" />
        <a v-if="initial?.suratNama" :href="`/api/kematian/${initial.id}/surat`" class="text-13 text-brand-700" download>Unduh surat kematian</a>
      </div>
    </AppCard>
    <AppFeedback :error="error" />
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <AppButton v-if="initial" variant="secondary" :disabled="busy" class="w-full sm:w-auto" @click="hapus">Hapus Laporan</AppButton>
      <AppButton variant="secondary" :disabled="busy" class="w-full sm:w-auto" @click="navigateTo('/catatan-kematian')">Batal</AppButton>
      <AppButton type="submit" :disabled="busy" class="w-full sm:w-auto">Simpan Laporan</AppButton>
    </div>
  </form>
</template>
