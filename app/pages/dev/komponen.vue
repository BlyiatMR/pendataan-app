<script setup lang="ts">
import { ICONS } from '~/utils/icons'
const ICONS_LIST = ICONS
/**
 * /dev/komponen — Style guide Fase 1 (docs/04 §Komponen, 2:138)
 * HANYA development — redirect ke /dashboard di production (docs/07 Fase 6)
 */
if (!import.meta.dev) {
  await navigateTo('/dashboard', { replace: true })
}

definePageMeta({ layout: false }) // tanpa sidebar

// Data demo
const inputVal = ref('')
const selectVal = ref('')
const searchVal = ref('')
const checkVal = ref(false)
const currentPage = ref(1)

const selectOptions = [
  { value: 'rw1', label: 'RW 01' },
  { value: 'rw2', label: 'RW 02' },
  { value: 'rw3', label: 'RW 03' },
]

const grafikData = [
  { label: 'Mei', value: 2 },
  { label: 'Jun', value: 3 },
  { label: 'Jul', value: 1 },
  { label: 'Agu', value: 4 },
  { label: 'Sep', value: 2 },
  { label: 'Okt', value: 3 },
]

// Demo DataTable
const tableColumns = [
  { key: 'nik', label: 'NIK' },
  { key: 'nama', label: 'Nama Lengkap' },
  { key: 'jk', label: 'JK' },
  { key: 'rtrw', label: 'RT / RW' },
  { key: 'dusun', label: 'Dusun' },
  { key: 'status', label: 'Status' },
  { key: 'aksi', label: 'Aksi' },
]
const tableRows = [
  { nik: '7306011205880001', nama: 'Andi Baso', jk: 'L', rtrw: '01 / 01', dusun: 'Bontoa', status: 'Tetap' },
  { nik: '7306014308450011', nama: 'Hj. Marhani', jk: 'P', rtrw: '01 / 02', dusun: 'Lompo', status: 'Tetap' },
  { nik: '7306017612900003', nama: 'Muh. Rizal', jk: 'L', rtrw: '02 / 01', dusun: 'Pattiro', status: 'Pendatang' },
]
</script>

<template>
  <div class="min-h-screen bg-page p-8">
    <div class="mb-8">
      <h1 class="text-26 font-bold text-ink">Style Guide — Komponen</h1>
      <p class="text-14 text-ink-muted">Figma: frame <code>2:138</code>. Hanya untuk development.</p>
    </div>

    <!-- ===== SECTION: Tombol ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">1. Tombol (AppButton)</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Primary</span>
          <AppButton variant="primary">+ Tambah Warga</AppButton>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Secondary</span>
          <AppButton variant="secondary">Batal</AppButton>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Primary block (348px)</span>
          <div class="w-[348px]">
            <AppButton variant="primary" :block="true">Masuk</AppButton>
          </div>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Disabled</span>
          <AppButton variant="primary" :disabled="true">Disabled</AppButton>
        </div>
      </div>
    </section>

    <!-- ===== SECTION: Field ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">2. Field (AppField)</h2>
      <div class="flex flex-wrap items-start gap-6 rounded-card border border-line bg-surface p-8">
        <div class="w-[280px] flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Input</span>
          <AppField
            v-model="inputVal"
            label="Nama Lengkap"
            placeholder="Sesuai KTP"
            required
          />
        </div>
        <div class="w-[280px] flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Select</span>
          <AppField
            v-model="selectVal"
            type="select"
            label="Pilih RW"
            placeholder="Semua RW"
            :options="selectOptions"
          />
        </div>
        <div class="w-[280px] flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Search</span>
          <AppField
            v-model="searchVal"
            type="search"
            label="Cari"
            placeholder="Cari NIK atau nama warga..."
          />
        </div>
        <div class="w-[280px] flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Password</span>
          <AppField
            v-model="inputVal"
            type="password"
            label="Password"
            placeholder="••••••••"
          />
        </div>
      </div>
    </section>

    <!-- ===== SECTION: Badge ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">3. Badge (AppBadge)</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Success</span>
          <AppBadge variant="success">Tetap</AppBadge>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Success</span>
          <AppBadge variant="success">Terverifikasi</AppBadge>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Warning</span>
          <AppBadge variant="warning">Menunggu</AppBadge>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Neutral</span>
          <AppBadge variant="neutral">Pendatang</AppBadge>
        </div>
        <div class="flex flex-col items-start gap-2">
          <span class="text-12 text-ink-muted">Success (Dipilih)</span>
          <AppBadge variant="success">Dipilih</AppBadge>
        </div>
      </div>
    </section>

    <!-- ===== SECTION: Checkbox ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">4. Checkbox</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <AppCheckbox v-model="checkVal" label="Ingat saya" id="ingat-saya" />
      </div>
    </section>

    <!-- ===== SECTION: AvatarInitials ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">5. AvatarInitials</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <div class="flex flex-col items-center gap-2">
          <AvatarInitials nama="Admin Desa" :size="36" />
          <span class="text-12 text-ink-muted">Sidebar (36)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <AvatarInitials nama="Hj. Marhani" :size="44" />
          <span class="text-12 text-ink-muted">Terpilih (44)</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <AvatarInitials nama="Andi Baso" :size="104" />
          <span class="text-12 text-ink-muted">Profil (104)</span>
        </div>
      </div>
    </section>

    <!-- ===== SECTION: IconChip ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">6. IconChip</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <IconChip icon="lucide:users" />
        <IconChip icon="lucide:file-text" />
        <IconChip icon="lucide:heart" />
        <IconChip icon="lucide:triangle-alert" />
        <IconChip icon="lucide:calendar" />
        <IconChip icon="lucide:pencil" />
      </div>
    </section>

    <!-- ===== SECTION: StatCard ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">7. StatCard</h2>
      <div class="grid grid-cols-4 gap-5">
        <StatCard label="Total Warga" value="1.248" caption="Data per Oktober 2026" icon="lucide:users" />
        <StatCard label="Kartu Keluarga" value="362" caption="Tersebar di 4 RW" icon="lucide:file-text" />
        <StatCard label="Kematian Bulan Ini" value="3" caption="1 menunggu verifikasi" icon="lucide:heart" />
        <StatCard label="Data Belum Lengkap" value="27" caption="Perlu dilengkapi petugas" icon="lucide:triangle-alert" />
      </div>
    </section>

    <!-- ===== SECTION: NavItem ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">8. NavItem (SidebarNavItem)</h2>
      <div class="w-[248px] flex flex-col gap-1 rounded-card bg-brand-900 p-4">
        <SidebarNavItem icon="lucide:house" label="Dashboard" to="/dashboard" :active="true" />
        <SidebarNavItem icon="lucide:users" label="Data Warga" to="/data-warga" />
        <SidebarNavItem icon="lucide:clipboard-list" label="Catatan Kematian" to="/catatan-kematian" />
        <SidebarNavItem icon="lucide:file-text" label="Laporan" to="/laporan" />
        <SidebarNavItem icon="lucide:log-out" label="Keluar" />
      </div>
    </section>

    <!-- ===== SECTION: Pagination ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">9. Pagination</h2>
      <div class="rounded-card border border-line bg-surface p-8">
        <Pagination
          v-model:currentPage="currentPage"
          :total="1248"
          :per-page="6"
          entity-label="warga"
        />
      </div>
    </section>

    <!-- ===== SECTION: BarChart ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">10. BarChart</h2>
      <AppCard :padding="5">
        <p class="mb-4 text-16 font-semibold text-ink">Laporan Kematian 6 Bulan Terakhir</p>
        <BarChart :data="grafikData" :highlight-last="true" />
      </AppCard>
    </section>

    <!-- ===== SECTION: ActivityItem ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">11. ActivityItem</h2>
      <AppCard :padding="5" class="flex flex-col gap-4">
        <p class="text-16 font-semibold text-ink">Aktivitas Terbaru</p>
        <ActivityItem judul="Data warga ditambahkan" subjudul="Nurhayati • RT 02 / RW 02" waktu="10:24" />
        <ActivityItem judul="Laporan kematian dicatat" subjudul="Hj. Marhani • RT 01 / RW 02" waktu="Kemarin" />
        <ActivityItem judul="Data warga diperbarui" subjudul="Muh. Rizal • alamat" waktu="Kemarin" />
        <ActivityItem judul="Data warga ditambahkan" subjudul="Daeng Sila • RT 03 / RW 01" waktu="2 hari" />
      </AppCard>
    </section>

    <!-- ===== SECTION: KeyValue ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">12. KeyValue</h2>
      <div class="grid grid-cols-2 gap-5">
        <AppCard :padding="6">
          <p class="mb-4 text-14 text-ink-muted">Stacked (kartu data)</p>
          <div class="grid grid-cols-2 gap-x-5 gap-y-4">
            <KeyValue layout="stacked" label="No. Kartu Keluarga" value="7306010101120001" />
            <KeyValue layout="stacked" label="Jenis Kelamin" value="Laki-laki" />
            <KeyValue layout="stacked" label="Tempat, Tanggal Lahir" value="Gowa, 12 Mei 1988" />
            <KeyValue layout="stacked" label="Agama" value="Islam" />
          </div>
        </AppCard>
        <AppCard :padding="6">
          <p class="mb-4 text-14 text-ink-muted">Inline (kartu profil)</p>
          <div class="flex flex-col gap-[14px]">
            <KeyValue layout="inline" label="RT / RW" value="01 / 01" />
            <KeyValue layout="inline" label="Dusun" value="Bontoa" />
            <KeyValue layout="inline" label="Data diperbarui" value="10 Okt 2026" />
          </div>
        </AppCard>
      </div>
    </section>

    <!-- ===== SECTION: PageHeader ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">13. PageHeader</h2>
      <AppCard :padding="5" class="flex flex-col gap-5">
        <PageHeader
          title="Data Warga"
          subtitle="Kelola data penduduk Desa Sunggumanai"
        >
          <template #actions>
            <AppButton variant="primary">+ Tambah Warga</AppButton>
          </template>
        </PageHeader>
        <div class="border-t border-line pt-5">
          <PageHeader
            title="Tambah Data Warga"
            subtitle="Isi data sesuai KTP dan Kartu Keluarga"
            back-to="/data-warga"
          />
        </div>
      </AppCard>
    </section>

    <!-- ===== SECTION: SelectedResidentCard ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">14. SelectedResidentCard</h2>
      <SelectedResidentCard
        nama="Hj. Marhani"
        nik="7306014308450011"
        :rt="1"
        :rw="2"
      />
    </section>

    <!-- ===== SECTION: UploadDropzone ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">15. UploadDropzone</h2>
      <UploadDropzone />
    </section>

    <!-- ===== SECTION: DataTable ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">16. DataTable</h2>
      <DataTable
        :columns="tableColumns"
        :rows="tableRows"
        grid-template="170px 1fr 50px 90px 150px 110px 70px"
      >
        <template #cell-status="{ value }">
          <AppBadge :variant="value === 'Tetap' ? 'success' : 'neutral'">{{ value as string }}</AppBadge>
        </template>
        <template #cell-aksi>
          <div class="flex items-center gap-[14px]">
            <button aria-label="Lihat detail" class="text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              <Icon name="lucide:eye" class="size-[18px]" />
            </button>
            <button aria-label="Ubah" class="text-ink-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
              <Icon name="lucide:pencil" class="size-[18px]" />
            </button>
          </div>
        </template>
      </DataTable>
    </section>

    <!-- ===== SECTION: Ikon ===== -->
    <section class="mb-8">
      <h2 class="mb-4 text-16 font-semibold text-ink">0. Mapping Ikon Lucide</h2>
      <div class="flex flex-wrap items-center gap-6 rounded-card border border-line bg-surface p-8">
        <div v-for="(name, key) in ICONS_LIST" :key="key" class="flex flex-col items-center gap-2">
          <Icon :name="name" class="size-[18px] text-ink-muted" />
          <span class="text-11 text-ink-muted">{{ key }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
