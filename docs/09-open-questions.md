# 09 — Celah Desain, Ketidakkonsistenan & Keputusan Default

Dibuat dari hasil ekstraksi Figma (22 Okt 2026). Bagian A = **temuan di desain** yang harus disalin apa adanya. Bagian B = **hal yang tidak ada di desain** beserta keputusan default. Tinjau bersama desainer/pemilik proyek; perbarui kolom *Status* setelah dijawab. AI agent dilarang mengubah keputusan tanpa instruksi.

> **Pembaruan 25 Oktober 2026:** pemilik meminta SQLite, data dinamis, dan CRUD. Keputusan Fase 7 di bagian D menggantikan default mock/statistik statis serta larangan hapus untuk implementasi dinamis. Referensi mock asli tetap tidak diubah.

## A. Temuan/quirk di desain (pertahankan sampai ada konfirmasi)

| # | Temuan | Keputusan default | Status |
|---|---|---|---|
| 1 | **Data mock tidak konsisten antar layar.** Layar 06: stat Bulan Ini = 3 & Bulan Lalu = 2, tetapi tabel hanya menampilkan 2 baris Okt (12 & 03 Okt) dan 3 baris Sep (27, 15, 02 Sep). Yang "Menunggu" (Abd. Kadir, 15 Sep) berada di September, padahal dashboard menyebut "1 menunggu verifikasi" di bulan ini | Salin persis. Statistik Fase 1–5 di-hardcode dari `10-mock-data.md`, **bukan** dihitung dari tabel | Terbuka |
| 2 | **Kartu login tanpa fill, border, shadow** (radius 12 ada tapi tak terlihat) — form tampil langsung di atas `#F5F6EF` | Tanpa background/border | Terbuka (konfirmasi apakah disengaja) |
| 3 | **Row "Ingat saya / Lupa password?" setinggi 100px** (jarak 41px di atas & bawah) — sepertinya sisa auto-layout | Pertahankan `h-[100px]` demi kecocokan piksel | Terbuka |
| 4 | **Grafik hanya 484px dari lebar dalam kartu 628px** (sisa kanan kosong) | Pertahankan lebar 484 rata kiri | Terbuka |
| 5 | **Kartu aktivitas lebih pendek (257) dari kartu grafik (267)** dalam baris yang sama | `items-start`, kartu aktivitas mengikuti isi | Terbuka |
| 6 | **"Kewarganegaraan" ada di Detail (WNI) tetapi tidak ada di form Tambah** | Field tidak ditampilkan di form; nilai default `WNI` di data | Terbuka |
| 7 | **Detail memakai badge "Warga Tetap", tabel memakai "Tetap"** | Simpan nilai `Tetap`/`Pendatang`; label panjang "Warga …" hanya di profil detail | Terbuka |
| 8 | **Ikon mata di tabel 03 hanya baris 1 yang terhubung** di prototype | Semua baris → detail (lihat `05 §4`) | Terbuka |
| 9 | **Layar 07 tampil terisi "Hj. Marhani" padahal masuk dari detail "Andi Baso"** (prototype tidak meneruskan konteks) | Preselect via `?warga=<id>` bila dari detail; tanpa itu kartu terpilih disembunyikan | Terbuka |
| 10 | **Tombol "Ubah Data" menuju layar 04 "Tambah Data Warga"** (tanpa judul/mode edit) | Route `/data-warga/[id]/ubah` memakai form yang sama, judul tetap seperti 04 | Terbuka |
| 11 | Dua node di page Mockup di luar canvas: `13:274` "TEST logo", `25:411` "image 1" | Abaikan; logo diekspor dari `2:168` | Terbuka |
| 12 | Page Prototype adalah salinan frame Mockup (struktur identik menurut metadata); gaya piksel prototype tidak diperiksa terpisah | Gunakan Mockup untuk visual, Prototype hanya untuk alur | Info |
| 13 | Wireframe (page `0:1`) tidak dibandingkan mendetail dengan Mockup | Dipakai hanya sebagai referensi struktur | Info |

## B. Tidak ada di desain (butuh keputusan)

| # | Topik | Keputusan default | Status |
|---|---|---|---|
| 1 | **State interaksi** (hover, focus, disabled, error, loading, empty) | Diturunkan dari token di `03 §17`; error memakai `warning-fg` (tidak ada warna merah di desain) | Terbuka |
| 2 | **Responsif / mobile / tablet** — hanya ada 1440×900 | Layout desktop; di bawah ~1280px biarkan scroll horizontal. **Jangan** merancang layout mobile sendiri | Terbuka |
| 3 | **Validasi & pesan error** | Wajib: NIK (16 digit), No. KK (16 digit), Nama Lengkap; Tanggal Meninggal, Nama Pelapor. Teks pesan sederhana Bahasa Indonesia | Terbuka |
| 4 | **Opsi dropdown** (JK, agama, status kawin, dusun, status warga, hubungan pelapor, RW/RT/Status filter, bulan laporan) | Lihat `10-mock-data.md §Opsi` (usulan) | Terbuka |
| 5 | **Definisi statistik:** "Data Belum Lengkap" (27), "Data Diperbarui" (41), "Warga Baru" (5), "Kartu Keluarga" (362) | Hardcode di mock; definisi bisnis menunggu pemilik | Terbuka |
| 6 | **Alur verifikasi kematian** (Menunggu → Terverifikasi, siapa & di mana) | Tidak dibuat; ikon aksi di 06 tanpa navigasi | Terbuka |
| 7 | **Aksi ikon di layar 06** (mata/pensil) | Dirender saja, tanpa halaman tujuan | Terbuka |
| 8 | **Ekspor PDF/Excel & pemilih periode** | UI statis; format & library ditentukan di Fase 7 | Terbuka |
| 9 | **Autentikasi nyata** (kredensial, sesi, "Lupa password?", "Ingat saya") | Fase 1 tanpa validasi seperti prototype; Fase 7 menentukan | Terbuka |
| 10 | **Peran/izin** (hanya satu: Admin Desa / Petugas Kantor) | Satu peran | Terbuka |
| 11 | **Feedback setelah simpan** (toast/snackbar) | Tidak ada; redirect saja | Terbuka |
| 12 | **Hapus data warga** (tidak ada tombol hapus) | Tidak dibuat | Terbuka |
| 13 | **Backend, database, hosting** | Tidak ditentukan; Fase 7 | Terbuka |
| 14 | **Privasi data** (NIK/KK adalah data pribadi) | Data mock fiktif; jangan log/simpan di localStorage; produksi perlu kebijakan akses & audit | Terbuka |
| 15 | **Judul `<title>`/favicon/meta** | `SI Pendataan Warga — Desa Sunggumanai`; favicon = logo Kab. Gowa | Terbuka |
| 16 | **Pagination di layar 06** (tidak ada) | Tanpa pagination (5 baris) | Terbuka |
| 17 | **Ikon:** Figma memakai ikon custom stroke-2 | Lucide via Iconify; bila bentuk beda, ekspor SVG Figma sebagai custom collection | Terbuka |

## C. Format log untuk temuan baru

Tambahkan baris baru di bagian A/B dengan: nomor, deskripsi, node ID Figma, keputusan sementara. Contoh:
`| A14 | Tinggi baris tabel 06 = 49 vs 50 (node 2:989) | Ikuti 50 kecuali baris terakhir 49 | Terbuka |`

## D. Keputusan implementasi SQLite/CRUD — 25 Oktober 2026

| Topik | Keputusan |
|---|---|
| Database (B13) | SQLite lokal melalui `node:sqlite`, Nitro API. Memakai runtime yang telah tersedia, tanpa dependency baru. |
| Statistik (A1/B5) | Semua angka berasal dari database. Nilai nol tetap nol; tidak menggunakan fallback 1.248/362/41. Definisi terperinci di `11-sqlite-crud.md`. |
| Hapus (B12) | Permintaan CRUD mencakup delete. Tambah `Hapus Data` di detail warga dan `Hapus Laporan` pada form laporan terisi, memakai AppButton secondary dan konfirmasi native browser. Tidak membuat modal/desain baru. |
| Aksi kematian (B7) | Ikon mata membuka form 07 yang sama, terisi melalui `?laporan=<id>`, untuk membaca/mengubah/menghapus. Tidak ada halaman detail baru. |
| Verifikasi (B6) | API update menerima status Menunggu/Terverifikasi untuk satu akun petugas. Tidak menambahkan layar/alur verifikasi baru; form mempertahankan status saat mengubah isinya. |
| Pencarian warga | Hasil dinamis berupa AppButton secondary dan Pagination yang sudah ada, maksimal 6 hasil per halaman. `?warga=` memilih warga sebenarnya, bukan default Hj. Marhani. |
| Upload | PDF/JPG maksimal 2 MB, pemeriksaan ekstensi/header berkas di server; disimpan sebagai BLOB SQLite dan diunduh melalui API berautentikasi. |
| Seed | Enam warga dan lima kematian dari mock asli hanya untuk DB baru. Tidak mengarang 1.242 warga tambahan. Database lama tidak direset, termasuk bila isinya berbeda dari mock. `DATABASE_SEED=false` menonaktifkan contoh. |
| Perbedaan seed lama | Seed server sebelumnya tidak sama dengan docs/10 pada NIK/nama/dusun. Seed baru membaca app/data asli; baris yang sudah tersimpan tidak ditimpa. |
| Riwayat | Tambah/ubah/hapus dan aktivitas kematian tersimpan. Snapshot warga mempertahankan rekap historis setelah perubahan/hapus. Data sebelum migrasi hanya dapat memakai keadaan terakhir yang tersedia. |
| Grafik dinamis | Tetap 36px per nilai untuk nilai ≤4 sesuai desain. Di atas itu tinggi diskalakan proporsional, maksimum 144px, agar tidak keluar kartu. |
| Auth/ekspor (B8/B9) | Melanjutkan auth dan dependency ekspor yang sudah ada. Kredensial dari environment privat; seluruh API data memerlukan sesi. Ekspor menggunakan hasil query yang sama dengan layar laporan. |
| Fidelity | Token dan struktur utama dipertahankan. Perubahan aksi/status dinamis di atas merupakan perluasan fungsional yang diminta; tidak diklaim pixel-identical dengan baseline Figma yang belum tersedia. |

## E. Perluasan fitur berdasarkan permintaan pemilik — 25 Oktober 2026

| Fitur | Keputusan implementasi |
|---|---|
| Panduan Admin | Menambahkan route `/panduan-admin`, tombol akses di sidebar dan Dashboard, serta enam langkah penggunaan yang menaut ke alur sistem yang sudah tersedia. |
| Logo dan tab website | Menggunakan `public/image.png` untuk logo sidebar/login dan favicon tab browser. |
| Jam WITA | Menampilkan jam berjalan zona `Asia/Makassar` dengan format `HH:MM WITA` di sidebar. |
| Dark theme | Menambahkan switch tema pada login dan sidebar, menyimpan pilihan tema, serta memakai token warna gelap dengan transisi 220ms tanpa gradient atau shadow. |
| Responsive layout | Menambahkan drawer sidebar pada viewport di bawah `lg`, header mobile, grid form/stat yang menyesuaikan, dan scroll horizontal terkontrol untuk tabel lebar. Desktop 1440px tetap mempertahankan struktur utama. |
