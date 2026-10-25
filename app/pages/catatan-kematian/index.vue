<script setup lang="ts">
/**
 * Layar 06 — Catatan Kematian · /catatan-kematian · Figma 2:806
 * docs/04 §06 — Stats 3 kolom + tabel 5 baris tanpa pagination
 * nav aktif: Catatan Kematian
 */
const { stats, rows, load, error, busy } = useKematian()
await load()

// Kolom tabel catatan kematian (docs/04 §06)
const kolom = [
  { key: 'nama',      label: 'Nama'           },
  { key: 'nik',       label: 'NIK'            },
  { key: 'tglTampil', label: 'Tgl Meninggal'  },
  { key: 'rtrwTampil',label: 'RT / RW'        },
  { key: 'pelapor',   label: 'Pelapor'        },
  { key: 'status',    label: 'Status'         },
  { key: 'aksi',      label: 'Aksi'           },
]
// grid-template: 1fr 170px 110px 80px 120px 130px 60px
const gridTemplate = '1fr 170px 110px 80px 120px 130px 60px'

function rowNama(row: Record<string, unknown>) {
  return row.nama as string
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <!--
      1. PageHeader — H1 "Catatan Kematian"
         subjudul "Laporan warga meninggal dunia"
         aksi: + Lapor Kematian → /catatan-kematian/lapor
    -->
    <PageHeader
      title="Catatan Kematian"
      subtitle="Laporan warga meninggal dunia"
    >
      <template #actions>
        <AppButton variant="primary" to="/catatan-kematian/lapor">+ Lapor Kematian</AppButton>
      </template>
    </PageHeader>

    <!--
      2. Stats — 3 kolom (docs/04 §06)
         Bulan Ini · Bulan Lalu · Menunggu Verifikasi
    -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-5">
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
      3. Tabel — 5 baris, tanpa pagination (docs/04 §06)
         Status: Terverifikasi=success / Menunggu=warning
         Aksi: ikon mata (lihat detail — [ASUMSI])
    -->
    <AppFeedback :error="error" :pending="busy" :empty="!rows.length" />
    <DataTable
      :columns="kolom"
      :rows="(rows as Record<string, unknown>[])"
      :grid-template="gridTemplate"
    >
      <!-- Kolom Status — AppBadge -->
      <template #cell-status="{ value }">
        <AppBadge :variant="(value as string) === 'Terverifikasi' ? 'success' : 'warning'">
          {{ value as string }}
        </AppBadge>
      </template>

      <!-- Kolom Aksi — ikon mata -->
      <template #cell-aksi="{ row }">
        <NuxtLink
          :to="`/catatan-kematian/lapor?laporan=${row.id}`"
          class="text-ink-muted transition-colors hover:text-ink
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          :aria-label="`Lihat detail ${rowNama(row)}`"
        >
          <Icon name="lucide:eye" class="size-[18px]" />
        </NuxtLink>
      </template>
    </DataTable>
  </div>
</template>
