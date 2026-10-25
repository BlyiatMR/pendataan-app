<script setup lang="ts">
/**
 * Layar 02 — Dashboard · route /dashboard · layout default
 * Figma: mockup 2:193 · prototype 3:1435 · nav aktif: Dashboard
 * docs/04 §02
 */
const { statList, grafikData, aktivitasList, load, error } = useDashboard()
await load()
</script>

<template>
   <div class="flex flex-col gap-5">
   <AppFeedback :error="error" />
  <!--
    1. PageHeader: H1 "Dashboard"
       subjudul "Ringkasan data warga Desa Sunggumanai"
       aksi: "+ Tambah Warga" → /data-warga/tambah
  -->
  <PageHeader
    title="Dashboard"
    subtitle="Ringkasan data warga Desa Sunggumanai"
  >
    <template #actions>
      <AppButton variant="secondary" to="/panduan-admin">
        Panduan Admin
      </AppButton>
      <AppButton variant="primary" to="/data-warga/tambah">
        + Tambah Warga
      </AppButton>
    </template>
  </PageHeader>

  <!--
    2. Stats — 4 kolom, gap 20
       tiap StatCard 267×153 di canvas 1440
  -->
   <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
    <StatCard
      v-for="s in statList"
      :key="s.label"
      :label="s.label"
      :value="s.value"
      :caption="s.caption"
      :icon="s.icon"
    />
  </div>

  <!--
    3. Row — flex gap-5 items-start
       Kartu grafik (flex-[668]) + Kartu aktivitas (flex-[440])
  -->
   <div class="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start lg:gap-5">
    <!-- Kartu grafik — lebar ≈668, tinggi 267 -->
     <AppCard :padding="5" class="flex min-w-0 flex-col gap-4 lg:flex-[668]" style="flex: 668;">
      <p class="text-16 font-semibold text-ink">Laporan Kematian 6 Bulan Terakhir</p>
      <BarChart :data="grafikData" :highlight-last="true" />
    </AppCard>

    <!-- Kartu aktivitas — lebar ≈440 -->
     <AppCard :padding="5" class="flex min-w-0 flex-col gap-4 lg:flex-[440]" style="flex: 440;">
      <p class="text-16 font-semibold text-ink">Aktivitas Terbaru</p>
      <div class="flex flex-col gap-4">
        <ActivityItem
          v-for="(a, i) in aktivitasList"
          :key="i"
          :judul="a.judul"
          :subjudul="a.sub"
          :waktu="a.waktu"
        />
      </div>
    </AppCard>
  </div>
  </div>
</template>
