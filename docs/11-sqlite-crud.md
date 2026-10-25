# 11 — SQLite dan CRUD dinamis

Implementasi: **25 Oktober 2026**, sesuai permintaan pemilik. Dokumen 01–10 tetap menjadi referensi desain; keputusan Fase 7 ada di `09 §D`.

## Menjalankan aplikasi

1. Gunakan Node **22.16 atau lebih baru** yang mendukung `node:sqlite`.
2. Dependency yang sudah ada: `npm install` bila belum terpasang. Tidak ada dependency baru ditambahkan untuk CRUD ini.
3. Jika `.env` belum ada, salin `.env.example`; isi `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan `JWT_SECRET` acak minimal 32 karakter. Jangan menimpa `.env` yang sudah dikonfigurasi.
4. `DATABASE_URL=./data/sunggumanai.db` merupakan path file relatif terhadap direktori proses. Path absolut juga didukung, bukan URL `file:`.
5. Jalankan `npm run dev`, lalu buka alamat yang dicetak Nuxt (biasanya `http://localhost:3000`). Masuk dengan akun dari `.env`.

Database/tabel dibuat dan dimigrasikan otomatis. Data tetap ada setelah refresh, logout, maupun restart.

Produksi lokal:

```sh
npm run build
node --env-file=.env .output/server/index.mjs
```

Server produksi tidak membaca `.env` otomatis tanpa `--env-file` atau environment yang disediakan host. Gunakan persistent disk, bukan filesystem sementara/serverless. Aktifkan `SESSION_COOKIE_SECURE=true` pada HTTPS. Sesi delapan jam; satu peran petugas. Tidak ada registrasi atau reset password.

## Seed dan perlindungan data lama

- Database baru: seed **6 warga + 5 laporan kematian** dari `app/data`, tanpa memalsukan jumlah 1.248.
- `DATABASE_SEED=false` sebelum startup pertama membuat database tanpa contoh.
- Marker migrasi memastikan seed tidak berjalan ulang, bahkan sesudah semua baris dihapus.
- Database yang sudah berisi warga/kematian tidak disemai ulang dan tidak ditimpa. Perbedaan seed lama terhadap Figma dibiarkan untuk ditinjau pemilik.
- Migrasi menambah kolom lampiran/waktu update, indeks, tabel migrasi, serta aktivitas. Tidak mereset tabel lama.
- SQLite memakai WAL, foreign keys pada schema baru, busy timeout, dan transaksi pada setiap mutasi + audit.
- DB, sidecar `-wal`/`-shm`, `.env`, dan cookie lokal dikecualikan dari git. NIK/KK tidak disimpan di localStorage.
- Sebelum backup/pindah data, hentikan server; salin database beserta sidecar yang masih ada. Jangan hanya menyalin DB aktif tanpa mekanisme backup SQLite.

## CRUD yang tersedia di UI

### Warga

- Tambah: isi form → `Simpan Data` → daftar menampilkan baris tersimpan.
- Baca: daftar dengan pencarian nama/NIK, filter RW/RT/status, pagination 6 baris; semua detail membaca API.
- Ubah: form yang sama, seluruh field dipertahankan dan disimpan. Field opsional dapat dikosongkan.
- Hapus: `Hapus Data` di detail, wajib konfirmasi. Ditolak dengan 409 jika masih ada laporan kematian yang terkait lewat ID atau NIK.

### Kematian

- Pilih warga dari pencarian, atau preselect lewat tombol di detail warga.
- Simpan tanggal kejadian, pelapor, dan detail opsional ke SQLite.
- Ikon mata pada daftar membuka form laporan terisi untuk baca/ubah/hapus. Tidak dibuat halaman baru.
- Satu laporan per warga/NIK. Nama/NIK/RT/RW saat simpan diambil dari warga server, bukan dipercayai dari body klien.
- Laporan lama tanpa wargaId tetap dapat dibaca/diubah; identitas snapshot tetap dipertahankan sampai warga baru dipilih.
- Surat PDF/JPG ≤2 MB disimpan sebagai BLOB; server memeriksa ekstensi dan magic bytes. Unduhan perlu sesi dan dikirim sebagai attachment.
- API update dapat mengganti status; form tidak membuat alur verifikasi baru dan mempertahankan status yang ada.

Hapus membuang entri aktif (serta BLOB bila laporan dihapus). **Riwayat/snapshot warga tetap disimpan** untuk audit dan rekap historis; ini bukan fitur penghapusan permanen seluruh jejak pribadi.

## Kontrak API

Seluruh API data memerlukan cookie HttpOnly. Tidak ada cache respons data. Write lintas Origin ditolak. Kontrak DTO aktif: `app/types/api.ts`.

| Method | Endpoint | Hasil |
|---|---|---|
| GET / POST | `/api/warga` | List `{items,total,page,perPage}` / buat warga (201) |
| GET / PUT / DELETE | `/api/warga/:id` | Detail + riwayat / ubah / hapus |
| GET / POST | `/api/kematian` | List + statistik / buat laporan (201) |
| GET / PUT / DELETE | `/api/kematian/:id` | Detail / ubah / hapus |
| GET | `/api/kematian/:id/surat` | Lampiran privat |
| GET | `/api/dashboard` | Statistik, grafik, aktivitas |
| GET | `/api/laporan?periode=YYYY-MM` | Rekap periode + daftar periode |
| GET | `/api/laporan/export-pdf?periode=YYYY-MM` | PDF dari rekap yang sama |
| GET | `/api/laporan/export-excel?periode=YYYY-MM` | XLSX dari rekap yang sama |

POST/PUT memakai JSON. Warga wajib `nik` dan `noKk` string 16 digit serta `namaLengkap` nonkosong. Kematian baru wajib `wargaId`, `tanggalMeninggal`, `namaPelapor`. Tanggal menerima ISO `YYYY-MM-DD` atau `DD / MM / YYYY`, disimpan ISO. Tanggal kalender tidak valid/masa depan ditolak. Jenis kelamin, agama, status perkawinan, dusun, hubungan dan status memerlukan opsi yang dikenal.

Lampiran opsional: `surat: { nama, base64 }`; tidak dikirim berarti pertahankan, `null` berarti hapus lampiran melalui API. Respons list/detail hanya mengandung nama lampiran, bukan BLOB.

HTTP: 401 tidak login, 403 Origin berbeda, 404 ID tak ada, 409 duplikat/relasi menghalangi hapus, 413 ukuran request terlalu besar (Content-Length), 415 format bukan JSON, 422 validasi. Tidak ada pesan sukses palsu/redirect ketika simpan gagal.
