<script setup lang="ts">
/**
 * Layar 08 — Laporan Bulanan · /laporan · Figma 2:1107
 * docs/04 §08 — Stats 4 kolom + tabel rekap RW + baris Total
 * nav aktif: Laporan
 */
const { stats, rows, kolom, gridTemplate, optPeriode, selectedPeriode, load, download, busy, error } = useLaporan()
await load()

function unduhPdf() {
  return download('pdf')
}

function eksporExcel() {
  return download('excel')
}

</script>

<template>
  <div class="flex flex-col gap-5">
    <!--
      1. PageHeader — H1 "Laporan Bulanan"
         subjudul "Rekap data warga dan kematian per bulan"
         aksi (gap 14, items-center):
           AppSelect lebar 180 tanpa label (nilai "Oktober 2026")
           secondary "Unduh PDF"
           primary "Ekspor Excel"
         (semua tombol aksi = UI statis, docs/04 §08)
    -->
    <PageHeader
      title="Laporan Bulanan"
      subtitle="Rekap data warga dan kematian per bulan"
    >
      <template #actions>
        <div class="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-[14px]">
          <!-- Select Periode — lebar 180, tanpa label -->
          <div class="w-full sm:w-[180px]">
            <AppField
              v-model="selectedPeriode"
              :disabled="busy"
              type="select"
              :hide-label="true"
              :options="optPeriode"
              placeholder="Pilih periode"
            />
          </div>
          <!-- Unduh PDF -->
          <AppButton variant="secondary" :disabled="busy" class="w-full sm:w-auto" @click="unduhPdf">Unduh PDF</AppButton>
          <!-- Ekspor Excel -->
          <AppButton variant="primary" :disabled="busy" class="w-full sm:w-auto" @click="eksporExcel">Ekspor Excel</AppButton>
        </div>
      </template>
    </PageHeader>

    <!--
      2. Stats — 4 kolom (docs/04 §08)
         Total Warga · Warga Meninggal · Data Diperbarui · Warga Baru
    -->
    <AppFeedback :error="error" :pending="busy" />
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
      <StatCard
        v-for="s in stats"
        :key="s.label"
        :label="s.label"
        :value="s.value"
        :caption="s.caption"
        :icon="s.icon"
      />
    </div>

    <!--
      3. Tabel rekap per RW (docs/04 §08)
         Kolom: RW · Jumlah KK · Jumlah Warga · Laki-laki · Perempuan · Meninggal
         Baris terakhir (Total) berlatar muted-bg (docs/07 Fase 4)
    -->
    <div class="overflow-x-auto rounded-card border border-line bg-surface">
      <div class="min-w-[820px]">
        <!-- Header tabel -->
        <div
          class="grid h-[40px] items-center gap-4 bg-muted-bg px-5"
          :style="{ gridTemplateColumns: gridTemplate }"
        >
          <span
            v-for="col in kolom"
            :key="col.key"
            class="truncate text-13 font-semibold text-ink-muted"
          >{{ col.label }}</span>
        </div>

        <!-- Baris RW 01–04 -->
        <div
          v-for="(row, i) in rows"
          :key="row.rw"
          class="grid items-center gap-4 px-5 py-[13px]"
          :class="[
            i < rows.length - 1 ? 'border-b border-line' : '',
            row.isTotal ? 'bg-muted-bg' : '',
          ]"
          :style="{ gridTemplateColumns: gridTemplate }"
        >
          <!-- RW / Total — semibold jika Total -->
          <span
            class="truncate text-13 text-ink"
            :class="row.isTotal ? 'font-semibold' : ''"
          >{{ row.rw }}</span>
          <span class="truncate text-13 text-ink" :class="row.isTotal ? 'font-semibold' : ''">{{ row.kk }}</span>
          <span class="truncate text-13 text-ink" :class="row.isTotal ? 'font-semibold' : ''">{{ row.warga }}</span>
          <span class="truncate text-13 text-ink" :class="row.isTotal ? 'font-semibold' : ''">{{ row.l }}</span>
          <span class="truncate text-13 text-ink" :class="row.isTotal ? 'font-semibold' : ''">{{ row.p }}</span>
          <span class="truncate text-13 text-ink" :class="row.isTotal ? 'font-semibold' : ''">{{ row.meninggal }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
