# 06 — Arsitektur Nuxt

Struktur memakai konvensi **Nuxt 4** (`app/` sebagai srcDir). Jika proyek Nuxt 3, hapus prefix `app/` (folder `pages/`, `components/`, dst. di root). Cek versi terpasang dan baca dokumentasi resminya bila ragu.

## 1. Dependencies (satu-satunya yang diizinkan)

| Paket | Fungsi |
|---|---|
| `nuxt`, `vue`, `vue-router` | Framework |
| `tailwindcss`, `@tailwindcss/vite` | Tailwind v4 (plugin Vite, daftar di `nuxt.config.ts` → `vite.plugins`) |
| `@nuxt/icon` | Iconify (`<Icon name="lucide:..." />`) |
| `@iconify-json/lucide` | Set ikon Lucide lokal (offline, tanpa fetch CDN) |
| `@nuxt/fonts` | Inter & Montserrat (self-host otomatis) |
| `gsap` | Animasi radial reveal saat pergantian tema |
| `typescript`, `vue-tsc` | Type check |

Tidak ada UI kit (Nuxt UI, Vuetify, PrimeVue, shadcn), tidak ada library chart, tidak ada Pinia (cukup `useState`). `gsap` ditambahkan khusus untuk animasi tema atas permintaan pemilik. Fase 7 (backend, PDF/Excel) boleh menambah dependency **setelah disetujui**.

Setup:
```bash
npx nuxi@latest init sunggumanai-warga
cd sunggumanai-warga
npm i tailwindcss @tailwindcss/vite
npx nuxi module add icon
npx nuxi module add fonts
npm i -D @iconify-json/lucide
```

## 2. `nuxt.config.ts`

```ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Montserrat', provider: 'google', weights: [600] },
    ],
  },
  icon: { serverBundle: 'local' },
  app: {
    pageTransition: { name: 'dissolve', mode: 'out-in' },
    layoutTransition: { name: 'dissolve', mode: 'out-in' },
    head: { title: 'SI Pendataan Warga — Desa Sunggumanai', htmlAttrs: { lang: 'id' } },
  },
  typescript: { strict: true },
})
```

## 3. Struktur folder

```
app/
├─ app.vue                     ← <NuxtLayout><NuxtPage/></NuxtLayout>
├─ assets/css/main.css         ← token @theme (docs/02) + transisi dissolve
├─ layouts/
│  ├─ auth.vue                 ← 2 panel (layar 01)
│  └─ default.vue              ← Sidebar + <main> (layar 02–08)
├─ pages/
│  ├─ index.vue                ← redirect → /login
│  ├─ login.vue                ← definePageMeta({ layout: 'auth' })
│  ├─ dashboard.vue
│  ├─ data-warga/
│  │  ├─ index.vue             ← layar 03
│  │  ├─ tambah.vue            ← layar 04
│  │  └─ [id]/
│  │     ├─ index.vue          ← layar 05
│  │     └─ ubah.vue           ← form yang sama dengan 04 (terisi)
│  ├─ catatan-kematian/
│  │  ├─ index.vue             ← layar 06
│  │  └─ lapor.vue             ← layar 07
│  ├─ laporan.vue              ← layar 08
│  ├─ panduan-admin.vue        ← panduan penggunaan admin
│  └─ dev/komponen.vue         ← style guide (hanya dev)
├─ components/
│  ├─ app/                     ← komponen dasar (docs/03)
│  │  ├─ AppButton.vue  AppField.vue  AppInput.vue  AppSelect.vue  AppSearch.vue
│  │  ├─ AppBadge.vue   AppCard.vue   AppCheckbox.vue  AvatarInitials.vue
│  │  ├─ PageHeader.vue  StatCard.vue  IconChip.vue  KeyValue.vue
│  │  ├─ DataTable.vue   Pagination.vue  ActivityItem.vue  BarChart.vue
│  │  └─ UploadDropzone.vue  SelectedResidentCard.vue
│  ├─ WitaClock.vue              ← jam berjalan zona WITA di sidebar
│  ├─ ThemeToggle.vue            ← switch tema terang/gelap
│  ├─ layout/
│  │  ├─ AppSidebar.vue  SidebarNavItem.vue  SidebarUser.vue
│  └─ warga/
│     ├─ WargaForm.vue         ← dipakai tambah & ubah
│     ├─ WargaTable.vue  WargaFilterBar.vue  WargaProfileCard.vue  WargaDataCard.vue
│  └─ kematian/
│     ├─ KematianTable.vue  KematianForm.vue
├─ composables/
│  ├─ useAuth.ts   useWarga.ts   useKematian.ts   useDashboard.ts   useLaporan.ts
│  └─ useTheme.ts                 ← state tema dan persistensi localStorage
├─ data/                       ← mock (docs/10), SATU-SATUNYA tempat data statis
│  ├─ warga.ts  kematian.ts  aktivitas.ts  statistik.ts  laporan.ts  options.ts
├─ types/index.ts              ← Warga, LaporanKematian, Aktivitas, dst.
├─ utils/
│  ├─ format.ts                ← formatTanggal, formatAngka, formatRtRw, inisial
│  └─ icons.ts                 ← mapping nama ikon (docs/03 §0)
└─ middleware/auth.global.ts   ← (Fase 7) guard; Fase 1: no-op
public/images/logo-kab-gowa.png
docs/design-reference/*.png
```

## 4. Layout

**`layouts/default.vue`**
```vue
<template>
  <div class="min-h-screen">
    <AppSidebar />
    <main class="ml-[248px] flex min-h-screen flex-col gap-5 px-8 py-7">
      <slot />
    </main>
  </div>
</template>
```
`AppSidebar`: `fixed inset-y-0 left-0 w-[248px] bg-brand-900 flex flex-col gap-1 px-4 pt-6 pb-6`. Nav aktif ditentukan oleh **prefix route** (`/data-warga*` → Data Warga, `/catatan-kematian*` → Catatan Kematian, `/laporan` → Laporan, `/dashboard` → Dashboard).

Pada viewport di bawah `lg`, sidebar berubah menjadi drawer dengan overlay, header mobile menyediakan tombol buka menu dan switch tema, serta main memakai padding responsif tanpa margin sidebar.

**`layouts/auth.vue`**: `grid min-h-screen grid-cols-2`; panel kiri `bg-brand-500` (konten di `login.vue` via slot bernama atau langsung dalam layout); panel kanan transparan.

Lebar konten di Main = sisa lebar (di 1440 → 1128). **Jangan** memakai `max-w` yang membuat tampilan berbeda di 1440.

## 5. Util format (`app/utils/format.ts`)

```ts
const BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
export const formatTanggal = (d: Date | string) => {
  const x = new Date(d)
  return `${String(x.getDate()).padStart(2, '0')} ${BULAN[x.getMonth()]} ${x.getFullYear()}` // "02 Agu 2026"
}
export const formatAngka = (n: number) => n.toLocaleString('id-ID')            // 1.248
export const formatRtRw = (rt: number | string, rw: number | string) =>
  `${String(rt).padStart(2, '0')} / ${String(rw).padStart(2, '0')}`            // "01 / 02"
export const inisial = (nama: string) =>
  nama.trim().split(/\s+/).slice(0, 2).map(k => k[0]!.toUpperCase()).join('')    // "Hj. Marhani" → "HM"
```
Tanggal "Mei 1988" di detail ditulis panjang (`12 Mei 1988`) — gunakan formatter terpisah `formatTanggalPanjang` (nama bulan penuh: Januari … Desember) untuk "Tempat, Tanggal Lahir".

## 6. Composable & kontrak data

Halaman **tidak** mengimpor `~/data/*` langsung. Semua lewat composable (agar mudah diganti `$fetch` ke API).

```ts
// useWarga.ts
export function useWarga() {
  const list: (q: { q?: string; rw?: string; rt?: string; status?: string; page?: number }) => Promise<{ items: Warga[]; total: number; perPage: 6 }>
  const get:  (id: string) => Promise<Warga | undefined>
  const create: (data: WargaInput) => Promise<Warga>
  const update: (id: string, data: WargaInput) => Promise<Warga>
}
// useKematian.ts   → list(), create(input)
// useDashboard.ts  → stats(), grafik(), aktivitas()
// useLaporan.ts    → bulanan(periode)
// useAuth.ts       → login(), logout(), user  (Fase 1: user tetap "Admin Desa / Petugas Kantor")
```
State mock disimpan dengan `useState('warga', () => seedWarga)` agar Simpan Data benar-benar menambah baris selama sesi.

## 7. Aturan implementasi

- Halaman sebagai orkestrator tipis; markup berulang → komponen (docs/03).
- `WargaForm` dipakai oleh `tambah.vue` & `[id]/ubah.vue` (prop `initial?`). Teks header & tombol sama dengan desain 04.
- Form: `v-model` + validasi klien ringan (wajib: NIK, No. KK, Nama; Tanggal Meninggal, Nama Pelapor). Pesan error memakai gaya turunan (`03 §17`).
- Semua `<img>` logo memakai `alt="Logo Kabupaten Gowa"`.
- Hindari `v-html`. Tidak ada inline style kecuali nilai dinamis (tinggi batang grafik: `:style="{ height: v*36 + 'px' }"`).
- Jangan menyimpan data pribadi warga (NIK dsb.) di `localStorage`/log konsol; data mock fiktif hanya di `app/data`.

## 8. Backend (Fase 7, opsional — keputusan belum diambil)

Belum ditentukan di desain: database, auth, hosting. Opsi umum: Nitro server routes (`server/api/*`) + database pilihan tim. Batas kontrak sudah siap: setiap method composable di §6 → satu endpoint (`GET/POST /api/warga`, `GET/PUT /api/warga/:id`, `GET/POST /api/kematian`, `GET /api/dashboard`, `GET /api/laporan?periode=2026-10`). **Diskusikan dengan pemilik proyek sebelum memilih.**

### Implementasi disetujui melalui permintaan SQLite/CRUD (25 Oktober 2026)

Bagian historis di atas menggambarkan fase mock. Implementasi aktif sekarang:

- `server/database/{index,schema,seed}.ts`: koneksi SQLite, schema/migrasi aditif, seed satu kali.
- `server/utils/{records,kematian,reports,validation}.ts`: transaksi CRUD, pemetaan DTO, validasi, agregasi dan riwayat.
- `server/api/warga/` dan `server/api/kematian/`: GET/POST/PUT/**DELETE**, plus unduh surat berautentikasi.
- `server/api/dashboard.get.ts`, `server/api/laporan/`: angka dinamis, periode dan ekspor.
- `app/types/api.ts`: kontrak API aktif. Mock dan tipe mock di `app/data` tetap referensi/seed, bukan sumber tampilan langsung.
- `app/composables/use*.ts`: seluruh akses data layar melalui API.
- `WargaForm`, `KematianForm`: dipakai bersama untuk tambah/ubah. `WargaPicker`: pencarian/preselect yang sebenarnya.
- `AppFeedback`, `useApiFeedback`: loading/error/empty dan penanganan sesi berakhir.
- Node **22.16+** diperlukan untuk runtime yang diuji; `node:sqlite` masih memberikan ExperimentalWarning pada Node 22.16.
- Paket SQLite/Drizzle lain dan paket ekspor sudah ada sebelum perubahan ini; tidak ada paket baru dipasang dan schema runtime tidak bergantung pada Drizzle.

Cara menjalankan, definisi statistik, payload, dan batas migrasi: `11-sqlite-crud.md`.
