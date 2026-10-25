# 04 — Spesifikasi Layar

Semua ukuran adalah di canvas **1440×900**. Layar 02–08 memakai layout `default`: **Sidebar 248px** + **Main** (padding `28 32`, gap vertikal 20, lebar konten 1128). Layar 01 memakai layout `auth`.
Komponen yang disebut mengacu ke `03-components.md`. Data contoh ada di `10-mock-data.md`.

---

## 01 — Login · route `/login` · layout `auth`
Figma: mockup `2:166` · prototype `3:1415`

Bg halaman `page`. Dua panel sama lebar (`grid grid-cols-2`, tinggi layar penuh).

**Panel kiri (Brand panel, 720×900)** — bg `brand-500`, padding 72, kolom, `justify-between`, gap 20:
1. Logo Kab. Gowa 104×104 (gambar, fit/contain) di kiri atas — file `/images/logo-kab-gowa.png` (export node `2:168`)
2. Judul: **"Sistem Pendataan Warga Desa Sunggumanai"** — Montserrat 46/600 putih, LH 118%, LS −1%, lebar maks 560 (terpecah 3 baris: "Sistem Pendataan / Warga Desa / Sunggumanai")
3. Footer 15/400 putih@88%, LH 150%, dua baris: `Kantor Desa Sunggumanai` ⏎ `Kabupaten Gowa, Sulawesi Selatan`

**Panel kanan (Form panel, 720×900)** — **tanpa background sendiri** (tampil `page`), kolom, rata tengah horizontal & vertikal, gap 24:
- **Login card** 420×489, radius 12, padding 36, gap 18, **TANPA fill, border, atau shadow** (persis desain, lihat `09 #2`). Isi berurutan:
  1. "Masuk" — Montserrat 30/600 `ink`
  2. "Gunakan akun petugas desa untuk melanjutkan." — 14/400 `ink-muted`
  3. Field **Username** — placeholder `Masukkan username`
  4. Field **Password** — `type=password` (desain menampilkan `••••••••`)
  5. **Row** tinggi **100px**, `flex items-center gap-2`: Checkbox + "Ingat saya" (kiri) · "Lupa password?" 13/600 `brand-700` (kanan, `ml-auto`). *(Tinggi 100 adalah quirk desain, pertahankan.)*
  6. Tombol **Masuk** (primary, block)
- Teks bawah kartu: `© 2026 Pemerintah Desa Sunggumanai` 12/400 `ink-muted`, tengah.

Verifikasi total tinggi kartu: 36+37+18+17+18+66+18+66+18+100+18+41+36 = **489** ✓.

Interaksi: **Masuk → `/dashboard`** (tanpa validasi di prototype).

---

## 02 — Dashboard · route `/dashboard`
Figma: mockup `2:193` · prototype `3:1435` · nav aktif: Dashboard

1. **PageHeader**: H1 `Dashboard` · subjudul `Ringkasan data warga Desa Sunggumanai` · aksi: Button primary **`+ Tambah Warga`** (→ `/data-warga/tambah`)
2. **Stats** (4 kolom, gap 20, tiap kartu 267×153) — StatCard:
   | Label | Nilai | Caption | Ikon |
   |---|---|---|---|
   | Total Warga | 1.248 | Data per Oktober 2026 | users |
   | Kartu Keluarga | 362 | Tersebar di 4 RW | file-text |
   | Kematian Bulan Ini | 3 | 1 menunggu verifikasi | heart |
   | Data Belum Lengkap | 27 | Perlu dilengkapi petugas | triangle-alert |
3. **Row** (flex gap 20, `items-start`): 
   - **Kartu grafik** lebar 668 (≈ `flex: 668`): judul `Laporan Kematian 6 Bulan Terakhir` (16/600), gap 16, lalu BarChart (484px, tinggi 190). Tinggi kartu 267.
   - **Kartu aktivitas** lebar 440 (≈ `flex: 440`), tinggi mengikuti isi (~257): judul `Aktivitas Terbaru`, 4 ActivityItem:
     | Judul | Subjudul | Waktu |
     |---|---|---|
     | Data warga ditambahkan | Nurhayati • RT 02 / RW 02 | 10:24 |
     | Laporan kematian dicatat | Hj. Marhani • RT 01 / RW 02 | Kemarin |
     | Data warga diperbarui | Muh. Rizal • alamat | Kemarin |
     | Data warga ditambahkan | Daeng Sila • RT 03 / RW 01 | 2 hari |

Interaksi: `+ Tambah Warga` → 04; sidebar (lihat `05`). Kartu statistik/grafik/aktivitas **tidak** klik.

---

## 03 — Data Warga · route `/data-warga`
Figma: mockup `2:331` · prototype `3:1572` · nav aktif: Data Warga

1. **PageHeader**: `Data Warga` · `Kelola data penduduk Desa Sunggumanai` · aksi: primary `+ Tambah Warga` (→ 04)
2. **Filter bar** (AppCard padding 16, flex gap 12, items-center, tinggi 78): `AppSearch` (flex-1, ≈470, placeholder `Cari NIK atau nama warga...`) · `AppSelect` ×3 lebar 170 (`Semua RW`, `Semua RT`, `Semua Status`) · tombol primary `Cari`. **Semua field tanpa label** (`hideLabel`).
3. **Tabel** (jarak 20 dari filter bar) — kolom: `NIK`, `Nama Lengkap`, `JK`, `RT / RW`, `Dusun`, `Status`, `Aksi`. 6 baris/halaman. Status = AppBadge (`Tetap` success / `Pendatang` neutral). Aksi = ikon mata + pensil.
4. **Pagination** (jarak 20 dari tabel): `Menampilkan 1–6 dari 1.248 warga` · `1 2 3 … 208`.

Interaksi di prototype: hanya **ikon mata baris 1 → 05 Detail** dan `+ Tambah Warga` → 04. Di aplikasi: ikon mata **semua baris** → `/data-warga/[id]`; pensil → `/data-warga/[id]/ubah` **[ASUMSI]**; Cari/filter/pagination berfungsi pada data mock (tanpa mengubah tampilan).

---

## 04 — Tambah Data Warga · route `/data-warga/tambah`
Figma: mockup `2:560` · prototype `3:1772` · nav aktif: Data Warga

1. **PageHeader** dengan BackButton (→ 03): `Tambah Data Warga` · `Isi data sesuai KTP dan Kartu Keluarga`
2. **Form card** (AppCard padding 24, gap 16; lebar 1128, tinggi 531):
   - Judul `Data Pribadi` (16/600)
   - Grid 3 kolom (gap kolom 20, baris 16):
     | Baris | Kolom 1 | Kolom 2 | Kolom 3 |
     |---|---|---|---|
     | 1 | `NIK *` — ph `16 digit NIK` | `No. Kartu Keluarga *` — ph `16 digit No. KK` | `Nama Lengkap *` — ph `Sesuai KTP` |
     | 2 | `Jenis Kelamin` (select) — ph `Pilih jenis kelamin` | `Tempat Lahir` — ph `Contoh: Gowa` | `Tanggal Lahir` — ph `DD / MM / YYYY` |
     | 3 | `Agama` (select) — ph `Pilih agama` | `Status Perkawinan` (select) — ph `Pilih status` | `Pekerjaan` — ph `Contoh: Petani` |
   - Divider 1px `line`
   - Judul `Alamat` (16/600)
   - Field penuh lebar `Alamat Lengkap` — ph `Nama jalan / lorong, nomor rumah`
   - Grid 4 kolom (gap 20): `RT` ph `00` · `RW` ph `00` · `Dusun` (select) ph `Pilih dusun` · `Status Warga` (select) ph `Tetap / Pendatang`
3. **Actions** (jarak 20 di bawah card, rata kanan, gap 12): secondary `Batal` (→ 03) · primary `Simpan Data` (→ 03 setelah menyimpan)

Tidak ada field Kewarganegaraan (ada di detail; lihat `09 #6`).

---

## 05 — Detail Warga · route `/data-warga/[id]`
Figma: mockup `2:691` · prototype `3:1849` · nav aktif: Data Warga

1. **PageHeader** dengan BackButton (→ 03): `Detail Warga` · `NIK 7306011205880001` · aksi (gap 14): secondary `Lapor Kematian` (→ 07) · primary `Ubah Data`
2. **Content** (flex gap 20, `items-start`):
   - **Kartu profil** lebar 340, padding 24, gap 14, rata tengah: avatar 104 (`AB`) · nama `Andi Baso` (20/700) · Badge success `Warga Tetap` · divider · KeyValue inline ×3: `RT / RW` = `01 / 01`, `Dusun` = `Bontoa`, `Data diperbarui` = `10 Okt 2026`
   - **Kolom kanan** (flex-1, lebar 768, gap 20):
     - **Kartu Data Pribadi** (padding 24, gap 18): judul `Data Pribadi`; grid 2 kolom KeyValue stacked:
       | Baris | Kiri | Kanan |
       |---|---|---|
       | 1 | No. Kartu Keluarga — 7306010101120001 | Jenis Kelamin — Laki-laki |
       | 2 | Tempat, Tanggal Lahir — Gowa, 12 Mei 1988 | Agama — Islam |
       | 3 | Status Perkawinan — Kawin | Pekerjaan — Petani |
       | 4 | Alamat — Jl. Bontoa No. 12, Dusun Bontoa | Kewarganegaraan — WNI |
     - **Kartu Riwayat** (padding 24, gap 16): judul `Riwayat Perubahan Data`; ActivityItem:
       `Alamat diperbarui` / `Admin Desa` / `10 Okt 2026` · `Data warga ditambahkan` / `Admin Desa` / `02 Agu 2026`

---

## 06 — Catatan Kematian · route `/catatan-kematian`
Figma: mockup `2:806` · prototype `3:1961` · nav aktif: Catatan Kematian

1. **PageHeader**: `Catatan Kematian` · `Laporan warga meninggal dunia` · aksi: primary `+ Lapor Kematian` (→ 07)
2. **Stats** (**3 kolom**, kartu lebar sama ≈ 362.67, gap 20):
   | Label | Nilai | Caption | Ikon |
   |---|---|---|---|
   | Bulan Ini | 3 | Oktober 2026 | heart |
   | Bulan Lalu | 2 | September 2026 | calendar |
   | Menunggu Verifikasi | 1 | Perlu ditinjau admin | triangle-alert |
3. **Tabel** — kolom `Nama`, `NIK`, `Tgl Meninggal`, `RT / RW`, `Pelapor`, `Status`, `Aksi`; 5 baris, **tanpa pagination**. Status: `Terverifikasi` (success) / `Menunggu` (warning).

---

## 07 — Lapor Warga Meninggal · route `/catatan-kematian/lapor`
Figma: mockup `2:1001` · prototype `3:2150` · nav aktif: Catatan Kematian

1. **PageHeader** dengan BackButton (→ 06): `Lapor Warga Meninggal` · `Catat laporan kematian warga Desa Sunggumanai`
2. **Form card** (padding 24, gap 16; tinggi 580):
   - Judul `Warga yang Meninggal`
   - `AppSearch` penuh lebar, label `Cari Warga`, ph `Ketik NIK atau nama warga...`
   - **SelectedResidentCard** (Hj. Marhani — `NIK 7306014308450011 • RT 01 / RW 02` — badge `Dipilih`) muncul setelah warga dipilih; **di desain tampil terisi**
   - Divider · judul `Detail Kejadian`
   - Grid 3 kolom: 
     | Baris | Kolom 1 | Kolom 2 | Kolom 3 |
     |---|---|---|---|
     | 1 | `Tanggal Meninggal *` ph `DD / MM / YYYY` | `Tempat Meninggal` ph `Rumah / Rumah sakit` | `Nama Pelapor *` ph `Nama lengkap pelapor` |
     | 2 | `Hubungan Pelapor` (select) ph `Pilih hubungan` | `No. HP Pelapor` ph `08xx xxxx xxxx` | `Catatan` ph `Opsional` |
   - **UploadDropzone**
3. **Actions**: secondary `Batal` (→ 06) · primary `Simpan Laporan` (→ 06 setelah menyimpan)

---

## 08 — Laporan Bulanan · route `/laporan`
Figma: mockup `2:1107` · prototype `3:2227` · nav aktif: Laporan

1. **PageHeader**: `Laporan Bulanan` · `Rekap data warga dan kematian per bulan` · aksi (gap 14, items-center): `AppSelect` lebar 180 tanpa label (nilai `Oktober 2026`) · secondary `Unduh PDF` · primary `Ekspor Excel`
2. **Stats** (4 kolom):
   | Label | Nilai | Caption | Ikon |
   |---|---|---|---|
   | Total Warga | 1.248 | Per akhir Oktober | users |
   | Warga Meninggal | 3 | Bulan ini | heart |
   | Data Diperbarui | 41 | Bulan ini | pencil |
   | Warga Baru | 5 | Ditambahkan bulan ini | users |
3. **Tabel rekap per RW** — kolom `RW`, `Jumlah KK`, `Jumlah Warga`, `Laki-laki`, `Perempuan`, `Meninggal`:
   | RW | KK | Warga | L | P | Meninggal |
   |---|---|---|---|---|---|
   | RW 01 | 92 | 318 | 158 | 160 | 1 |
   | RW 02 | 88 | 301 | 150 | 151 | 1 |
   | RW 03 | 97 | 332 | 170 | 162 | 1 |
   | RW 04 | 85 | 297 | 146 | 151 | 0 |
   | **Total** | 362 | 1.248 | 624 | 624 | 3 |
   (Total konsisten dengan penjumlahan baris ✓.)

Prototype: tombol Unduh/Ekspor/select **tidak** punya aksi; tampilkan sebagai UI statis dulu (lihat `07 Fase 4`).

---

## Komponen (style guide) · `/dev/komponen` (hanya development)
Figma: `2:138` — baris horizontal (padding 32, gap 24, border `#DDDDDD`, radius 12, bg white) berisi: Primary, Secondary, Input, Select, Search, Badge Success/Warning/Neutral. Buat halaman ini di Fase 1 untuk membandingkan komponen dengan Figma sebelum dipakai di layar. **Jangan sertakan di production.**
