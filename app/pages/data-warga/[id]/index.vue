<script setup lang="ts">
/**
 * Layar 05 — Detail Warga · /data-warga/[id] · Figma 2:691
 * docs/04 §05
 */
import { formatRtRw } from '~/utils/format'
const route   = useRoute()
const id      = route.params.id as string

const { getDetail, remove, labelJk, formatTempatTanggalLahir, formatTanggal } = useWarga()
const { error, busy, run } = useApiFeedback()
const warga = await run(() => getDetail(id))

async function hapus() {
  if (!window.confirm('Hapus data warga ini? Tindakan ini tidak dapat dibatalkan.')) return
  const result = await run(() => remove(id))
  if (result) await navigateTo('/data-warga')
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <AppFeedback :error="error" />
    <template v-if="warga">
    <!--
      1. PageHeader dengan BackButton → /data-warga
         H1 "Detail Warga" · subjudul "NIK {nik}"
         Aksi: secondary "Lapor Kematian" → /catatan-kematian/lapor
               primary "Ubah Data" → /data-warga/[id]/ubah
    -->
    <PageHeader
      title="Detail Warga"
      :subtitle="`NIK ${warga.nik}`"
      back-to="/data-warga"
    >
      <template #actions>
        <AppButton variant="secondary" :disabled="busy" @click="hapus">Hapus Data</AppButton>
        <AppButton variant="secondary" :to="`/catatan-kematian/lapor?warga=${id}`">Lapor Kematian</AppButton>
        <AppButton variant="primary"   :to="`/data-warga/${id}/ubah`">Ubah Data</AppButton>
      </template>
    </PageHeader>

    <!--
      2. Content — flex gap 20 items-start (docs/04 §05)
    -->
    <div class="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:gap-5">

      <!--
        Kartu profil — lebar 340, padding 24, gap 14, rata tengah
        Figma 2:691 kiri
      -->
      <AppCard :padding="6" class="flex w-full shrink-0 flex-col items-center gap-[14px] lg:w-[340px]">
        <!-- Avatar 104 -->
        <AvatarInitials :nama="warga.nama" :size="104" />
        <!-- Nama 20/700 -->
        <p class="text-20 font-bold text-ink">{{ warga.nama }}</p>
        <!-- Badge success "Warga Tetap" -->
        <AppBadge :variant="warga.status === 'Tetap' ? 'success' : 'neutral'">Warga {{ warga.status }}</AppBadge>
        <!-- Divider -->
        <div class="w-full border-t border-line" />
        <!-- KeyValue inline ×3 -->
        <div class="flex w-full flex-col gap-[14px]">
          <KeyValue layout="inline" label="RT / RW"        :value="formatRtRw(warga.rt, warga.rw)" />
          <KeyValue layout="inline" label="Dusun"          :value="warga.dusun" />
          <KeyValue layout="inline" label="Data diperbarui" :value="formatTanggal(warga.diperbarui)" />
        </div>
      </AppCard>

      <!-- Kolom kanan — flex-1, gap 20 -->
      <div class="flex flex-1 flex-col gap-5">

        <!--
          Kartu Data Pribadi — padding 24, gap 18 (docs/04 §05)
          Grid 2 kolom KeyValue stacked
        -->
        <AppCard :padding="6">
          <div class="flex flex-col gap-[18px]">
            <p class="text-16 font-semibold text-ink">Data Pribadi</p>
            <div class="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
              <KeyValue layout="stacked" label="No. Kartu Keluarga"     :value="warga.noKk" />
              <KeyValue layout="stacked" label="Jenis Kelamin"          :value="labelJk(warga.jk)" />
              <KeyValue layout="stacked" label="Tempat, Tanggal Lahir"  :value="formatTempatTanggalLahir(warga.tempatLahir, warga.tanggalLahir)" />
              <KeyValue layout="stacked" label="Agama"                  :value="warga.agama" />
              <KeyValue layout="stacked" label="Status Perkawinan"      :value="warga.statusPerkawinan" />
              <KeyValue layout="stacked" label="Pekerjaan"              :value="warga.pekerjaan" />
              <KeyValue layout="stacked" label="Alamat"                 :value="warga.alamat" />
              <KeyValue layout="stacked" label="Kewarganegaraan"        :value="warga.kewarganegaraan" />
            </div>
          </div>
        </AppCard>

        <!--
          Kartu Riwayat — padding 24, gap 16 (docs/04 §05)
          ActivityItem list
        -->
        <AppCard :padding="6">
          <div class="flex flex-col gap-4">
            <p class="text-16 font-semibold text-ink">Riwayat Perubahan Data</p>
            <ActivityItem
              v-for="(r, i) in warga.riwayat"
              :key="i"
              :judul="r.judul"
              :subjudul="r.aktor"
              :waktu="formatTanggal(r.tanggal)"
            />
          </div>
        </AppCard>

      </div>
    </div>
    </template>
  </div>
</template>
