<script setup lang="ts">
const { get } = useWarga()
const { error, run } = useApiFeedback()
const warga = await run(() => get(String(useRoute().params.id)))
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader title="Tambah Data Warga" subtitle="Isi data sesuai KTP dan Kartu Keluarga" back-to="/data-warga" />
    <AppFeedback :error="error" />
    <WargaForm v-if="warga" :initial="warga" />
  </div>
</template>
