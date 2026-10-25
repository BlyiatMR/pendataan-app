# 03 — Komponen UI

Sumber: frame **Komponen** (`2:138`, mockup) + struktur layar. Setiap komponen di bawah harus menjadi **satu** komponen Vue yang dipakai ulang di semua layar.

## 0. Mapping ikon (Iconify, set `lucide`)

Ikon Figma digambar custom: stroke 2px, tanpa fill, ukuran 18 (konten) / 20 (sidebar) / 22 (upload). Set **Lucide** memakai gaya yang sama (stroke 2) sehingga dipetakan 1:1. Ukuran diatur lewat kelas (`size-[18px]`).

| Nama di Figma | Node contoh | `<Icon name>` | Ukuran | Warna stroke |
|---|---|---|---|---|
| icon/home | `2:203` | `lucide:house` | 20 | white (aktif) / `sidebar-text` |
| icon/users | `2:207`, `2:245` | `lucide:users` | 20 / 18 | `sidebar-text` / `brand-500` (chip) |
| icon/clip | `2:213` | `lucide:clipboard-list` | 20 | `sidebar-text` |
| icon/file | `2:218`, `2:255` | `lucide:file-text` | 20 / 18 | `sidebar-text` / `brand-500` |
| icon/logout | `2:230` | `lucide:log-out` | 20 | `sidebar-text` |
| icon/heart | `2:264` | `lucide:heart` | 18 | `brand-500` |
| icon/alert | `2:272` | `lucide:triangle-alert` | 18 | `brand-500` |
| icon/cal | `2:866` | `lucide:calendar` | 18 | `brand-500` |
| icon/edit | `2:413`, `2:1185` | `lucide:pencil` | 18 | `ink-muted` (aksi) / `brand-500` (chip) |
| icon/eye | `2:410` | `lucide:eye` | 18 | `ink-muted` |
| icon/back | `2:603` | `lucide:arrow-left` | 18 | `brand-900` |
| icon/upl | `2:1098` | `lucide:upload` | 22 | `brand-500` |
| icon/down (dalam `2:147`) | — | `lucide:chevron-down` | 18 | `ink-muted` |
| icon/search (dalam `2:153`) | — | `lucide:search` | 18 | `ink-muted` |

> **Verifikasi wajib (Fase 1):** bandingkan tiap ikon dengan screenshot node-nya. Bila bentuk berbeda dari Lucide, ekspor SVG dari Figma (`download_assets`, format svg) ke `app/assets/icons/*.svg` dan daftarkan sebagai `customCollections` `@nuxt/icon` (`<Icon name="sgm:clip">`). Simpan keputusan di `app/utils/icons.ts` (satu-satunya tempat mapping).

---

## 1. AppButton — `Button/Primary` `2:139`, `Button/Secondary` `2:141`

| | Primary | Secondary |
|---|---|---|
| Latar | `brand-500` | `white` |
| Border | 1px `brand-500` | 1px `line` |
| Teks | white, 14/600 | `ink`, 14/600 |
| Radius / padding | 8 / `py-[11px] px-[18px]` (tinggi 41) | sama |

Props: `variant: 'primary' | 'secondary'` (default primary), `block?: boolean` (lebar 100%, dipakai "Masuk" 348px), `to?: string` (render `NuxtLink`), `type?: 'button' | 'submit'`.
Label berupa slot teks; **tanda `+` adalah bagian teks** ("+ Tambah Warga"), bukan ikon.

Instans di desain: Masuk (primary, block) · + Tambah Warga · Cari · Ubah Data · Simpan Data · Simpan Laporan · Ekspor Excel · + Lapor Kematian (primary) | Batal · Lapor Kematian (di detail) · Unduh PDF (secondary).

Kelas dasar:
```
inline-flex items-center justify-center h-[41px] px-[18px] rounded-control border text-14 font-semibold cursor-pointer select-none
```

## 2. AppField — `Field/Input` `2:143`, `Field/Select` `2:147`, `Field/Search` `2:153`

Struktur vertikal, gap 6: **Label** (13/500 `ink`) + **kotak** (tinggi 44, bg white, border 1 `line`, radius 8, padding-x 14, gap 10, items-center).

| Varian | Isi kotak |
|---|---|
| Input | teks 14/400 (placeholder `ink-muted`) |
| Select | teks (flex-1) + `chevron-down` 18 di kanan |
| Search | `search` 18 di kiri + teks |

Props: `label?: string`, `required?: boolean` (menambah ` *` pada label, **satu node teks warna `ink`**), `placeholder`, `modelValue`, `type`, `options` (select), `hideLabel?: boolean`.
`hideLabel` dipakai di **filter bar** layar 03 (Search 470×44 dan 3 select 170×44 tanpa label) dan **select bulan** layar 08 (180×44).

Komponen turunan: `AppInput`, `AppSelect`, `AppSearch` (membungkus `AppField`). Lebar ditentukan parent (grid/flex), komponen `w-full`.

Select harus memakai `<select>` native dengan `appearance-none` + ikon chevron overlay (agar aksesibel dan kotaknya identik dengan desain).

## 3. AppBadge — `Badge/Success` `2:160`, `Warning` `2:162`, `Neutral` `2:164`

Pil: `rounded-full px-[10px] py-[4px] text-12 font-medium` (tinggi 23).
| Varian | bg | teks | Dipakai |
|---|---|---|---|
| success | `success-bg` | `success-fg` | Tetap · Terverifikasi · Warga Tetap · Dipilih |
| warning | `warning-bg` | `warning-fg` | Menunggu |
| neutral | `neutral-bg` | `neutral-fg` | Pendatang |

Props: `variant`. Label = slot.

## 4. AppCard

`rounded-card border border-line bg-white` + padding via prop `padding: 4 | 5 | 6` (16 / 20 / 24 px). Dipakai: stat card (5), grafik (5), aktivitas (5), filter bar (4), form/profil/data/riwayat (6). Tabel memakai `overflow-hidden` tanpa padding.

## 5. StatCard — `Stat/*` (mis. `2:241`)

Kartu 267×153 di canvas 1440, padding 20, gap 12, vertikal:
1. **Top** (flex, gap 12, items-center): label (13/500 `ink-muted`, flex-1) + **IconChip** (36×36, `brand-100`, radius 10, ikon 18 `brand-500`)
2. **Nilai** 30/700 `ink`
3. **Caption** 12/400 `ink-muted`

Props: `label`, `value`, `caption`, `icon`. Grid induk: Dashboard 4 kolom, Catatan Kematian 3 kolom, Laporan 4 kolom — semua `gap-5` (20px), kolom sama lebar.

## 6. Sidebar — node `2:194`

Lebar 248, tinggi layar penuh, bg `brand-900`, padding `24 16`, gap 4, kolom flex.
Urutan:
1. **Brand** (216×48, padding 4 8, gap 12): logo 40×40 (gambar, `object-fit: contain`) + teks (gap 1): "Pendataan Warga" (Montserrat 14/600 white) / "Desa Sunggumanai" (Inter 12 `sidebar-subtext`)
2. Spacer tinggi 20
3. **NavItem** ×4 (Dashboard, Data Warga, Catatan Kematian, Laporan)
4. Spacer `flex-1`
5. **User** (216×56, padding 10 8, gap 10): avatar 36 lingkaran `gold-500` inisial "AD" 12/700 `ink` + teks "Admin Desa" (13/600 white) / "Petugas Kantor" (11/400 `sidebar-subtext`)
6. **NavItem Keluar** (ikon `log-out`, tanpa status aktif)

NavItem: tinggi 42, padding `11 12`, gap 12, radius 8, ikon 20.
- Aktif: bg `brand-500`, teks white 14/600, ikon white. `aria-current="page"`.
- Tidak aktif: tanpa bg, teks `sidebar-text` 14/500, ikon `sidebar-text`.

Sidebar **fixed** di kiri; Main digeser `ml-[248px]`.

## 7. PageHeader — `Header` (mis. `2:234`)

Tinggi 52, flex, gap 14, items-center. Kiri: (opsional **BackButton** 40×40 putih, border `line`, radius 8, ikon `arrow-left` `brand-900`) + **Titles** (flex-1, gap 4): H1 (26/700 `ink`) + subjudul (14/400 `ink-muted`). Kanan: slot aksi (tombol, gap 14).
Props: `title`, `subtitle`, `backTo?: string`; slot `#actions`.

## 8. DataTable

Wadah: `rounded-card border border-line bg-white overflow-hidden`.
- **Header**: bg `muted-bg`, tinggi 40, padding `12 20`, gap 16; teks 13/600 `ink-muted`.
- **Baris**: padding `13 20`, gap 16, `border-b border-line` (baris terakhir tanpa border), tinggi efektif 50 karena badge 23.
- Kolom = CSS grid dengan lebar tetap + satu kolom fleksibel (`1fr`), supaya total pas 1126 di canvas 1440.

| Tabel | `grid-template-columns` (gap 16) |
|---|---|
| Data Warga | `170px 1fr 50px 90px 150px 110px 70px` → NIK, Nama Lengkap, JK, RT / RW, Dusun, Status, Aksi |
| Catatan Kematian | `1fr 170px 130px 90px 130px 130px 70px` → Nama, NIK, Tgl Meninggal, RT / RW, Pelapor, Status, Aksi |
| Laporan Bulanan | `110px 1fr 150px 130px 130px 130px` → RW, Jumlah KK, Jumlah Warga, Laki-laki, Perempuan, Meninggal |

(Nama Catatan Kematian = 270px & KK Laporan = 356px pada canvas 1440.)
Sel nama: 13/600. Sel lain: 13/400 `ink`. Sel Aksi: dua ikon 18 (`eye`, `pencil`), gap 14, warna `ink-muted`, tombol `aria-label="Lihat detail"` / `"Ubah"`.
Laporan Bulanan: baris data tinggi 43 (tanpa badge); **baris Total**: bg `muted-bg`, teks 13/600, tinggi 42, tanpa border bawah.

Implementasi: komponen generik `DataTable` (`columns`, `rows`, slot per kolom) atau komponen per tabel (`WargaTable`, `KematianTable`, `LaporanTable`) yang memakai `DataTableHeader`/`DataTableRow` bersama. Pilih satu, jangan campur.

## 9. Pagination — `2:548`

Flex, gap 6, tinggi 36, items-center. Teks kiri `flex-1` (13/400 `ink-muted`): `Menampilkan 1–6 dari 1.248 warga` (tanda `–` en dash). Tombol halaman 36×36 radius 8:
- aktif: bg `brand-500`, border `brand-500`, angka putih 13/500
- lain: bg white, border `line`, angka `ink` 13/500
Urutan: `1 2 3 … 208`. (1.248 ÷ 6 per halaman = 208.)

## 10. BarChart — node `2:280`

6 kolom bar, lebar bar 48, gap kolom 36, padding-x 8, tinggi area 190, kolom rata bawah (`items-end`), lebar area **484px** rata kiri di dalam kartu.
Tiap kolom (gap 8, rata tengah): **nilai** (12/600 `ink-muted`) → **batang** (lebar 48, **tinggi = nilai × 36px**, radius 6, `brand-500`) → **bulan** (12/400 `ink-muted`).
Batang bulan terakhir (berjalan) berwarna `gold-500`. Data: Mei 2, Jun 3, Jul 1, Agu 4, Sep 2, Okt 3 (tinggi 72/108/36/144/72/108).
Props: `data: { label: string; value: number }[]`, `highlightLast = true`. Render dengan HTML/CSS biasa (bukan library chart).

## 11. ActivityItem — `2:307`

Flex, gap 12, items-center: titik 10×10 `brand-500` · teks (flex-1, gap 2): judul 13/500 `ink` + subjudul 12/400 `ink-muted` · kanan waktu/tanggal 12/400 `ink-muted`. Daftar vertikal gap 16 di bawah judul kartu (16/600).

## 12. KeyValue

- **stacked** (kartu data detail, `2:763`): label 12/400 `ink-muted` di atas nilai 14/500 `ink`, gap 4. Grid 2 kolom (gap kolom 20, gap baris 16).
- **inline** (kartu profil, `2:751`): label 13/400 `ink-muted` kiri, nilai 13/500 `ink` kanan, tinggi 16, `justify-between`; antar baris gap 14.

## 13. AvatarInitials

Lingkaran, inisial = huruf pertama dari **dua kata pertama** nama ("Andi Baso"→AB, "Hj. Marhani"→HM, "Admin Desa"→AD).
| Konteks | Ukuran | bg | Teks |
|---|---|---|---|
| Sidebar | 36 | `gold-500` | 12/700 `ink` |
| Warga terpilih (07) | 44 | `brand-100` | 14/700 `brand-700` |
| Profil detail (05) | 104 | `brand-100` | 34/700 `brand-700` |

## 14. SelectedResidentCard — `2:1058`

Flex, gap 14, padding 14, tinggi 74, bg `selected-bg`, border `line`, radius 10, items-center. Avatar 44 · teks (flex-1): nama 14/600 `ink` + `NIK 7306014308450011 • RT 01 / RW 02` 12/400 `ink-muted` · Badge success "Dipilih".

## 15. UploadDropzone — `2:1097`

Tinggi 107, bg `upload-bg`, **border 1px dashed `brand-500`** (dash pola 6-4 → `border-dashed`), radius 10, padding 20, kolom rata tengah, gap 6: ikon `upload` 22 `brand-500` · "Unggah surat keterangan kematian" 13/600 `ink` · "PDF atau JPG, maksimal 2 MB" 12/400 `ink-muted`. Seluruh area klik membuka file picker (`accept=".pdf,.jpg,.jpeg"`, maks 2 MB).

## 16. Checkbox — login

18×18, bg white, border 1 `line`, radius 4; label "Ingat saya" 13/400 `ink-muted` (gap 8).

---

## 17. Derived states (TIDAK ada di Figma — didefinisikan sekali di sini)

Hanya diterapkan di komponen dasar. Semuanya memakai token yang sudah ada; jangan menambah warna baru.

| State | Aturan |
|---|---|
| Hover primary | bg & border → `brand-700` |
| Hover secondary | bg → `muted-bg` |
| Hover NavItem tidak aktif | bg `white/8` (`bg-white/[0.08]`) |
| Hover ikon aksi tabel | warna → `ink` |
| Hover baris tabel | bg `page` (opsional, bisa ditunda) |
| Focus-visible (semua interaktif) | `outline-2 outline-offset-2 outline-brand-500` |
| Focus input | border → `brand-500` |
| Disabled | `opacity-50 cursor-not-allowed` |
| Error field | border `warning-fg` + pesan 12/400 `warning-fg` di bawah (Figma tidak punya merah) — **[ASUMSI]** |

Tandai komentar `/* derived: tidak ada di Figma */` pada tiap aturan ini agar mudah diganti jika desainer menambahkan state.

## 17a. ThemeToggle — switch tema aplikasi

Komponen tambahan berdasarkan permintaan pemilik:

- Varian `surface` dipakai di halaman login pada panel kanan.
- Varian `sidebar` dipakai di sidebar halaman internal.
- Label aksesibel berubah antara `Aktifkan tema gelap` dan `Aktifkan tema terang`.
- Tema disimpan pada `localStorage` dengan key `sunggumanai-theme`.
- Pergantian tema memakai radial reveal berbasis GSAP selama 580ms dari posisi tombol switch; thumb switch tetap bergerak dengan transisi singkat.
- Mode dark menimpa token warna global melalui `html.dark`; komponen tetap memakai kelas token yang sama.

## 18. Pengikatan data Fase 7 (25 Oktober 2026)

- **WargaForm** (`initial?: WargaRecord`): markup layar 04 yang sama untuk tambah/ubah; menunggu POST/PUT sebelum redirect. Menampilkan error field dan mencegah submit ganda.
- **KematianForm** (`initial?: KematianRecord`, `resident?`): markup layar 07 untuk tambah/ubah; form edit mempertahankan status dan lampiran lama kecuali diganti.
- **WargaPicker** (`v-model` pilihan warga, `error?`): AppField search, hasil AppButton secondary, pagination 6 hasil, SelectedResidentCard. Pencarian debounced dan hasil permintaan lama diabaikan.
- **AppFeedback** (`error?`, `pending?`, `empty?`): pesan inline bertoken warning-fg/ink-muted. Tidak ada toast/ilustrasi baru.
- **UploadDropzone**: prop `fileName?` menampilkan nama lampiran; emit `file-selected` / `error`. Validasi client dan server berjalan.
- **Pagination**: prop `disabled?`; hasil kosong menampilkan `0–0`; halaman aktif/tetangga tetap dapat diakses.
- **AppField**: error terhubung dengan `aria-describedby`/`aria-invalid`; select dapat dikosongkan, filter `Semua …` tetap dapat dipilih ulang.
- Tombol hapus memakai AppButton secondary dan konfirmasi browser native (keputusan `09 §D`).
