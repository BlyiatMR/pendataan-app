<script setup lang="ts">
import type { WargaPayload, WargaRecord } from '~/types/api'
import { optJenisKelamin, optAgama, optStatusPerkawinan, optDusun, optStatusWarga } from '~/data/options'

const props = defineProps<{ initial?: WargaRecord }>()
const api = useWarga()
const { busy, error, errors, run } = useApiFeedback()
const form = reactive<WargaPayload>({
  nik: '', noKk: '', namaLengkap: '', jenisKelamin: '', tempatLahir: '', tanggalLahir: '',
  agama: '', statusPerkawinan: '', pekerjaan: '', kewarganegaraan: 'WNI',
  alamat: '', rt: '', rw: '', dusun: '', statusWarga: '',
})
if (props.initial) {
  for (const key of Object.keys(form) as (keyof WargaPayload)[]) form[key] = props.initial[key]
  if (form.tanggalLahir) form.tanggalLahir = form.tanggalLahir.split('-').reverse().join(' / ')
}
watch(form, () => { error.value = ''; errors.value = {} })

async function save() {
  const saved = await run(() => props.initial ? api.update(props.initial.id, form) : api.create(form))
  if (saved) await navigateTo('/data-warga')
}
</script>

<template>
  <!-- Form bersama layar 04 / ubah, node 2:560. -->
  <form class="flex flex-col gap-5" novalidate @submit.prevent="save">
    <AppCard :padding="6">
      <div class="flex flex-col gap-4">
        <p class="text-16 font-semibold text-ink">Data Pribadi</p>
        <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <AppField v-model="form.nik" label="NIK" placeholder="16 digit NIK" required :error="errors.nik" />
          <AppField v-model="form.noKk" label="No. Kartu Keluarga" placeholder="16 digit No. KK" required :error="errors.noKk" />
          <AppField v-model="form.namaLengkap" label="Nama Lengkap" placeholder="Sesuai KTP" required :error="errors.namaLengkap" />
          <AppField v-model="form.jenisKelamin" label="Jenis Kelamin" placeholder="Pilih jenis kelamin" type="select" :options="optJenisKelamin" :error="errors.jenisKelamin" />
          <AppField v-model="form.tempatLahir" label="Tempat Lahir" placeholder="Contoh: Gowa" :error="errors.tempatLahir" />
          <AppField v-model="form.tanggalLahir" label="Tanggal Lahir" placeholder="DD / MM / YYYY" :error="errors.tanggalLahir" />
          <AppField v-model="form.agama" label="Agama" placeholder="Pilih agama" type="select" :options="optAgama" :error="errors.agama" />
          <AppField v-model="form.statusPerkawinan" label="Status Perkawinan" placeholder="Pilih status" type="select" :options="optStatusPerkawinan" :error="errors.statusPerkawinan" />
          <AppField v-model="form.pekerjaan" label="Pekerjaan" placeholder="Contoh: Petani" :error="errors.pekerjaan" />
        </div>
        <div class="border-t border-line" />
        <p class="text-16 font-semibold text-ink">Alamat</p>
        <AppField v-model="form.alamat" label="Alamat Lengkap" placeholder="Nama jalan / lorong, nomor rumah" :error="errors.alamat" />
        <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <AppField v-model="form.rt" label="RT" placeholder="00" :error="errors.rt" />
          <AppField v-model="form.rw" label="RW" placeholder="00" :error="errors.rw" />
          <AppField v-model="form.dusun" label="Dusun" placeholder="Pilih dusun" type="select" :options="optDusun" :error="errors.dusun" />
          <AppField v-model="form.statusWarga" label="Status Warga" placeholder="Tetap / Pendatang" type="select" :options="optStatusWarga" :error="errors.statusWarga" />
        </div>
      </div>
    </AppCard>
    <AppFeedback :error="error" />
    <div class="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <AppButton variant="secondary" :disabled="busy" class="w-full sm:w-auto" @click="navigateTo('/data-warga')">Batal</AppButton>
      <AppButton type="submit" :disabled="busy" class="w-full sm:w-auto">Simpan Data</AppButton>
    </div>
  </form>
</template>
