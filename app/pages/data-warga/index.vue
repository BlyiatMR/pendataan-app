<script setup lang="ts">
/**
 * Layar 03 — Data Warga · /data-warga · Figma 2:331
 * docs/04 §03 — Filter bar + tabel + pagination
 */
import { optFilterRw, optFilterRt, optFilterStatus } from '~/data/options'
import { formatRtRw } from '~/utils/format'

const { query, filterRw, filterRt, filterStatus, halaman,
        displayRows, displayTotal, PER_HALAMAN, applyFilter, goToPage, load, error, busy } = useWarga()
await load()

// Helper untuk akses id di template slot
function rowId(row: Record<string, unknown>) {
  return row.id as string
}

// Kolom tabel Data Warga (docs/03 §8)
const kolom = [
  { key: 'nik',    label: 'NIK' },
  { key: 'nama',   label: 'Nama Lengkap' },
  { key: 'jk',     label: 'JK' },
  { key: 'rtrw',   label: 'RT / RW' },
  { key: 'dusun',  label: 'Dusun' },
  { key: 'status', label: 'Status' },
  { key: 'aksi',   label: 'Aksi' },
]
// grid-template-columns: 170px 1fr 50px 90px 150px 110px 70px (docs/03 §8)
const gridTemplate = '170px 1fr 50px 90px 150px 110px 70px'

// Flatten rows untuk DataTable (tambahkan rtrw & dusun dengan prefix)
const tableRows = computed(() =>
  displayRows.value.map(w => ({
    ...w,
    rtrw:  formatRtRw(w.rt, w.rw),
    dusun: `Dusun ${w.dusun}`,
  }))
)
</script>

<template>
  <div class="flex flex-col gap-5">
    <!--
      1. PageHeader — Figma 2:234
         H1 "Data Warga", subjudul, + Tambah Warga
    -->
    <PageHeader
      title="Data Warga"
      subtitle="Kelola data penduduk Desa Sunggumanai"
    >
      <template #actions>
        <AppButton variant="primary" to="/data-warga/tambah">+ Tambah Warga</AppButton>
      </template>
    </PageHeader>

    <!--
      2. Filter bar — AppCard padding 16, flex gap 12, h-78, items-center
         Semua field tanpa label (hideLabel) — docs/04 §03
    -->
    <AppCard :padding="4">
      <form class="flex flex-col items-stretch gap-3 sm:grid sm:grid-cols-2 lg:flex lg:h-[46px] lg:flex-row lg:items-center" @submit.prevent="applyFilter">
        <!-- AppSearch flex-1 ≈470 -->
        <AppField
          v-model="query"
          type="search"
          placeholder="Cari NIK atau nama warga..."
          :hide-label="true"
           class="w-full lg:flex-1"
        />
        <!-- AppSelect lebar 170 — Semua RW -->
        <div class="w-full sm:w-auto lg:w-[170px]">
          <AppField
            v-model="filterRw"
            type="select"
            placeholder="Semua RW"
            :options="optFilterRw"
            :hide-label="true"
          />
        </div>
        <!-- AppSelect lebar 170 — Semua RT -->
        <div class="w-full sm:w-auto lg:w-[170px]">
          <AppField
            v-model="filterRt"
            type="select"
            placeholder="Semua RT"
            :options="optFilterRt"
            :hide-label="true"
          />
        </div>
        <!-- AppSelect lebar 170 — Semua Status -->
        <div class="w-full sm:w-auto lg:w-[170px]">
          <AppField
            v-model="filterStatus"
            type="select"
            placeholder="Semua Status"
            :options="optFilterStatus"
            :hide-label="true"
          />
        </div>
        <!-- Tombol Cari -->
        <AppButton variant="primary" type="submit" :disabled="busy" class="w-full sm:w-auto">Cari</AppButton>
      </form>
    </AppCard>

    <!--
      3. Tabel — DataTable dengan 7 kolom (docs/03 §8)
         Figma 2:331 tabel, 6 baris/halaman
    -->
    <AppFeedback :error="error" :pending="busy" :empty="!displayRows.length" />
    <DataTable
      :columns="kolom"
      :rows="tableRows"
      :grid-template="gridTemplate"
    >
      <!-- Kolom JK — teks saja -->
      <template #cell-jk="{ value }">
        <span class="text-13 text-ink">{{ value as string }}</span>
      </template>

      <!-- Kolom Dusun — teks 13/400 -->
      <template #cell-dusun="{ value }">
        <span class="text-13 text-ink truncate">{{ value as string }}</span>
      </template>

      <!-- Kolom Status — AppBadge -->
      <template #cell-status="{ value }">
        <AppBadge :variant="(value as string) === 'Tetap' ? 'success' : 'neutral'">
          {{ value as string }}
        </AppBadge>
      </template>

      <!-- Kolom Aksi — ikon mata + pensil -->
      <template #cell-aksi="{ row }">
        <div class="flex items-center gap-[14px]">
          <NuxtLink
            :to="`/data-warga/${rowId(row)}`"
            class="text-ink-muted transition-colors hover:text-ink
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            aria-label="Lihat detail"
          >
            <Icon name="lucide:eye" class="size-[18px]" />
          </NuxtLink>
          <NuxtLink
            :to="`/data-warga/${rowId(row)}/ubah`"
            class="text-ink-muted transition-colors hover:text-ink
                   focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            aria-label="Ubah"
          >
            <Icon name="lucide:pencil" class="size-[18px]" />
          </NuxtLink>
        </div>
      </template>
    </DataTable>

    <!--
      4. Pagination — docs/03 §9
         "Menampilkan 1–6 dari 1.248 warga" · 1 2 3 … 208
    -->
    <Pagination
      :current-page="halaman"
      :disabled="busy"
      @update:current-page="goToPage"
      :total="displayTotal"
      :per-page="PER_HALAMAN"
      entity-label="warga"
    />
  </div>
</template>
