# 01 — Ringkasan & Ruang Lingkup

Legenda: **[DESAIN]** = terlihat langsung di Figma · **[ASUMSI]** = tidak ada di Figma, keputusan default (lihat `09-open-questions.md`).

## 1. Pengguna

Satu peran **[DESAIN]**: petugas kantor desa. Di sidebar tampil sebagai avatar `AD`, nama **Admin Desa**, jabatan **Petugas Kantor**.
Login memakai Username + Password ("Gunakan akun petugas desa untuk melanjutkan.").

## 2. Daftar layar (8) dan route

| # | Layar | Route | Layout | Node Mockup | Node Prototype |
|---|---|---|---|---|---|
| 01 | Login | `/login` | `auth` | `2:166` | `3:1415` |
| 02 | Dashboard | `/dashboard` | `default` | `2:193` | `3:1435` |
| 03 | Data Warga (daftar) | `/data-warga` | `default` | `2:331` | `3:1572` |
| 04 | Tambah Warga (form) | `/data-warga/tambah` | `default` | `2:560` | `3:1772` |
| 05 | Detail Warga | `/data-warga/[id]` | `default` | `2:691` | `3:1849` |
| 06 | Catatan Kematian (daftar) | `/catatan-kematian` | `default` | `2:806` | `3:1961` |
| 07 | Lapor Kematian (form) | `/catatan-kematian/lapor` | `default` | `2:1001` | `3:2150` |
| 08 | Laporan Bulanan | `/laporan` | `default` | `2:1107` | `3:2227` |
| — | Komponen (style guide) | `/dev/komponen` (dev-only) | — | `2:138` | — |

Node wireframe (referensi struktur): Komponen `1:4`, 01 `1:32`, 02 `1:58`, 03 `1:196`, 04 `1:425`, 05 `1:556`, 06 `1:671`, 07 `1:866`, 08 `1:972`.

Route tambahan **[ASUMSI]**: `/data-warga/[id]/ubah` (tombol "Ubah Data" di layar 05 menuju form layar 04 — lihat `05` & `09`). `/` → redirect ke `/login`.

> Node `13:274` ("TEST logo") dan `25:411` ("image 1") di page Mockup berada di luar canvas layar — **abaikan** (aset sisa).

## 3. Navigasi global (sidebar, 4 menu + keluar)

| Menu | Ikon (lucide) | Route | Aktif pada layar |
|---|---|---|---|
| Dashboard | `lucide:house` | `/dashboard` | 02 |
| Data Warga | `lucide:users` | `/data-warga` | 03, 04, 05 |
| Catatan Kematian | `lucide:clipboard-list` | `/catatan-kematian` | 06, 07 |
| Laporan | `lucide:file-text` | `/laporan` | 08 |
| Keluar | `lucide:log-out` | `/login` | — |

## 4. Entitas data (disimpulkan dari isi layar)

### Warga **[DESAIN]**
| Field | Contoh | Sumber layar | Catatan |
|---|---|---|---|
| `nik` | `7306011205880001` | 03,04,05 | 16 digit (placeholder "16 digit NIK"), wajib |
| `noKk` | `7306010101120001` | 04,05 | 16 digit, wajib |
| `namaLengkap` | `Andi Baso` | 03,04,05 | wajib, "Sesuai KTP" |
| `jenisKelamin` | `L` / `P` (tabel), `Laki-laki` (detail) | 03,04,05 | simpan `L`/`P`, tampilkan label sesuai konteks |
| `tempatLahir` | `Gowa` | 04,05 | opsional |
| `tanggalLahir` | `12 Mei 1988` | 04,05 | input `DD / MM / YYYY` |
| `agama` | `Islam` | 04,05 | select |
| `statusPerkawinan` | `Kawin` | 04,05 | select |
| `pekerjaan` | `Petani` | 04,05 | teks |
| `alamat` | `Jl. Bontoa No. 12, Dusun Bontoa` | 04,05 | teks panjang |
| `rt`, `rw` | `01`, `01` | 03,04,05 | tampil `01 / 01` (RT / RW) |
| `dusun` | `Bontoa`, `Lompo`, `Pattiro` | 03,04,05 | select |
| `statusWarga` | `Tetap` / `Pendatang` | 03,04,05 | badge; detail menulis "Warga Tetap" |
| `kewarganegaraan` | `WNI` | 05 saja | **tidak ada di form 04** → [ASUMSI] default `WNI` |
| `updatedAt` | `10 Okt 2026` | 05 | "Data diperbarui" |

### LaporanKematian **[DESAIN]**
| Field | Contoh | Layar |
|---|---|---|
| `wargaId` (nama, NIK, RT/RW diturunkan) | Hj. Marhani | 06,07 |
| `tanggalMeninggal` * | `12 Okt 2026` | 06,07 |
| `tempatMeninggal` | `Rumah / Rumah sakit` (placeholder) | 07 |
| `namaPelapor` * | `Andi Baso` | 06,07 |
| `hubunganPelapor` | select "Pilih hubungan" | 07 |
| `noHpPelapor` | `08xx xxxx xxxx` | 07 |
| `catatan` | "Opsional" | 07 |
| `suratKematian` (file) | PDF/JPG ≤ 2 MB | 07 |
| `status` | `Menunggu` (warning) / `Terverifikasi` (success) | 06 |

### Aktivitas (log) **[DESAIN]**
`{ jenis: 'Data warga ditambahkan' | 'Laporan kematian dicatat' | 'Data warga diperbarui', namaWarga, rt, rw | keterangan, waktu }` — tampil di Dashboard ("Aktivitas Terbaru") dan Detail Warga ("Riwayat Perubahan Data": judul + aktor `Admin Desa` + tanggal).

### Statistik **[DESAIN]**
Dashboard: Total Warga 1.248 · Kartu Keluarga 362 (tersebar di 4 RW) · Kematian Bulan Ini 3 (1 menunggu verifikasi) · Data Belum Lengkap 27 · grafik kematian 6 bulan (Mei 2, Jun 3, Jul 1, Agu 4, Sep 2, Okt 3).
Catatan Kematian: Bulan Ini 3 · Bulan Lalu 2 · Menunggu Verifikasi 1.
Laporan Bulanan: Total Warga 1.248 · Warga Meninggal 3 · Data Diperbarui 41 · Warga Baru 5 + tabel per RW (RW 01–04 + Total).

## 5. Di luar lingkup (jangan dibuat)

Registrasi akun, lupa-password flow (hanya tautan teks), manajemen user/peran, pengaturan, notifikasi, dark mode, tampilan mobile, import data, halaman detail kematian, halaman Kartu Keluarga, peta.

## 6. Daftar teks UI yang harus persis

Lihat tiap layar di `04-screens.md` (bagian **Copy**). Ringkas istilah kunci: *Pendataan Warga*, *Desa Sunggumanai*, *Catatan Kematian*, *Laporan*, *Keluar*, *+ Tambah Warga*, *+ Lapor Kematian*, *Lapor Kematian*, *Ubah Data*, *Simpan Data*, *Simpan Laporan*, *Batal*, *Cari*, *Unduh PDF*, *Ekspor Excel*.
