# 05 — Alur Prototype (Klik)

Diekstrak dari **interaksi nyata** di Figma page *3. Prototype (Klik)* (`1:3`) — total **45 interaksi**, semuanya `ON_CLICK → NAVIGATE`.

- **Titik mulai (flow starting point):** "Alur Utama (mulai dari Login)" → layar 01 Login (`3:1415`)
- **Transisi seluruh interaksi:** `DISSOLVE`, durasi **0.2 detik**, easing **EASE_OUT**
- Petunjuk di Figma: *"PROTOTYPE: tekan Present (▶) mulai dari 01 Login. Klik tombol Masuk, menu sidebar, + Tambah Warga, ikon mata, Batal/Simpan."*

## 1. Peta route

| Layar | Route |
|---|---|
| 01 Login | `/login` |
| 02 Dashboard | `/dashboard` |
| 03 Data Warga | `/data-warga` |
| 04 Tambah Warga | `/data-warga/tambah` |
| 05 Detail Warga | `/data-warga/[id]` |
| 06 Catatan Kematian | `/catatan-kematian` |
| 07 Lapor Kematian | `/catatan-kematian/lapor` |
| 08 Laporan Bulanan | `/laporan` |

## 2. Matriks klik (elemen → tujuan) — SUMBER KEBENARAN

`✓` = ada di prototype · `—` = tidak ada interaksi (menu aktif / elemen tidak ada di layar itu)

### Sidebar (ada di layar 02–08)
| Dari ↓ / Menu → | Dashboard | Data Warga | Catatan Kematian | Laporan | Keluar |
|---|---|---|---|---|---|
| 02 Dashboard | — (aktif) | → 03 | → 06 | → 08 | → 01 |
| 03 Data Warga | → 02 | — (aktif) | → 06 | → 08 | → 01 |
| 04 Tambah Warga | → 02 | → 03 | → 06 | → 08 | → 01 |
| 05 Detail Warga | → 02 | → 03 | → 06 | → 08 | → 01 |
| 06 Catatan Kematian | → 02 | → 03 | — (aktif) | → 08 | → 01 |
| 07 Lapor Kematian | → 02 | → 03 | → 06 | → 08 | → 01 |
| 08 Laporan Bulanan | → 02 | → 03 | → 06 | — (aktif) | → 01 |

Di aplikasi: menu aktif tetap berupa tautan ke route-nya sendiri (aman), tapi **tampilan aktif** mengikuti `04-screens.md` (04/05 → Data Warga; 07 → Catatan Kematian).

### Elemen di dalam halaman
| Layar | Elemen (nama layer Figma) | Tujuan |
|---|---|---|
| 01 | `Btn/Masuk` (`3:1433`) | → 02 Dashboard |
| 02 | `Btn/Tambah Warga` (`3:1480`) | → 04 Tambah Warga |
| 03 | `Btn/Tambah Warga` (`3:1617`) | → 04 Tambah Warga |
| 03 | `Act/1` = ikon mata baris pertama (`3:1654`) | → 05 Detail Warga |
| 04 | `Btn/Back` (`3:1814`) | → 03 Data Warga |
| 04 | `Btn/Batal` (`3:1847`) | → 03 Data Warga |
| 04 | `Btn/Simpan` (`3:1848`) | → 03 Data Warga |
| 05 | `Btn/Back` (`3:1891`) | → 03 Data Warga |
| 05 | `Btn/Lapor Kematian` (`3:1897`) | → 07 Lapor Kematian |
| 05 | `Btn/Ubah Data` (`3:1898`) | → 04 Tambah Warga *(form yang sama)* |
| 06 | `Btn/Lapor Kematian` (`3:2006`) | → 07 Lapor Kematian |
| 07 | `Btn/Back` (`3:2192`) | → 06 Catatan Kematian |
| 07 | `Btn/Batal` (`3:2225`) | → 06 Catatan Kematian |
| 07 | `Btn/Simpan` (`3:2226`) | → 06 Catatan Kematian |
| 08 | *(tidak ada)* | — |

### Yang TIDAK punya interaksi di prototype
Lupa password?, checkbox Ingat saya, tombol Cari, semua select/filter, pagination, ikon mata baris 2–6 (layar 03), ikon pensil (03), seluruh ikon aksi di layar 06, kartu statistik/grafik/aktivitas, upload dropzone, pencarian warga (07), Unduh PDF, Ekspor Excel, select bulan.
➡ Elemen ini **tetap dirender persis** seperti desain. Perilakunya mengikuti bagian 4 (default) tanpa mengubah tampilan.

## 3. Alur pengguna (user journeys)

```
A. Masuk          01 Login ──[Masuk]──────────────────────────► 02 Dashboard
B. Tambah warga   02/03 ──[+ Tambah Warga]──► 04 ──[Simpan Data / Batal / ←]──► 03 Data Warga
C. Lihat detail   03 ──[ikon mata]──► 05 ──[←]──► 03
D. Ubah data      05 ──[Ubah Data]──► 04 (form sama) ──[Simpan Data / Batal / ←]──► 03
E. Lapor (detail) 05 ──[Lapor Kematian]──► 07 ──[Simpan Laporan / Batal / ←]──► 06
F. Lapor (daftar) 06 ──[+ Lapor Kematian]──► 07 ──[Simpan Laporan / Batal / ←]──► 06
G. Laporan        sidebar ──[Laporan]──► 08  (tidak ada aksi lanjutan di prototype)
H. Keluar         sidebar ──[Keluar]──► 01 Login   (dari semua layar 02–08)
```

## 4. Perilaku default di luar prototype **[ASUMSI — lihat `09`]**

| Perilaku | Keputusan default |
|---|---|
| Login "Masuk" | Fase 1: langsung ke `/dashboard` tanpa validasi (sama dengan prototype). Auth nyata di Fase 7 |
| Ikon mata semua baris (03) | → `/data-warga/[id]` |
| Ikon pensil (03) / "Ubah Data" (05) | → `/data-warga/[id]/ubah`: form yang sama dengan 04, terisi data warga. Judul halaman tetap **sama persis dengan 04** sampai desainer menyediakan judul edit |
| "Lapor Kematian" dari detail (05→07) | Kirim `?warga=[id]` agar kartu **warga terpilih** terisi (layar 07 di desain memang tampil terisi). Tanpa query: kartu terpilih disembunyikan sampai warga dipilih lewat pencarian |
| Simpan Data / Simpan Laporan | Simpan ke store mock lalu redirect ke daftar (seperti prototype). **Tanpa toast** (tidak ada di desain) |
| Ikon mata/pensil di layar 06 | Dirender, tanpa navigasi (halaman tujuan tidak ada di desain) |
| Cari/filter (03) | Memfilter data mock di klien; pagination 6 baris/halaman |
| Unduh PDF / Ekspor Excel / select bulan | UI statis di Fase 1–5 |
| Tombol back browser | Berfungsi normal (route nyata) |

## 5. Implementasi transisi

Dissolve 200ms ease-out = **cross-fade konten**. Sidebar bagian dari layout `default`, jadi **tidak ikut berkedip** (di prototype sidebar identik antar layar sehingga terlihat diam).

`nuxt.config.ts`:
```ts
app: { pageTransition: { name: 'dissolve', mode: 'out-in' } }
```
`main.css`:
```css
.dissolve-enter-active, .dissolve-leave-active { transition: opacity 200ms ease-out; }
.dissolve-enter-from, .dissolve-leave-to { opacity: 0; }
```
Transisi `login ↔ dashboard` melintasi dua layout berbeda → set `layout: { name: ..., }` transition juga `dissolve` agar tidak ada lompatan.

## 6. Cara memverifikasi alur (QA)

Buka `/login` lalu klik berurutan dan pastikan sama dengan tabel §2:
`Masuk → Data Warga → + Tambah Warga → Batal → ikon mata (baris 1) → Ubah Data → ← → Lapor Kematian (detail) → Batal → Laporan → Keluar`.
Ulangi untuk setiap sel tabel sidebar. Skrip Playwright disarankan di `08-design-qa-checklist.md §5`.

## 7. Perluasan CRUD SQLite (25 Oktober 2026)

Alur prototype dan layout tetap menjadi acuan, dengan pengikatan Fase 7 berikut:

- Simpan warga/kematian menunggu API sukses, lalu kembali ke daftar. Kegagalan tidak membuang isi form.
- Ubah warga memakai form 04 terisi; Simpan/Batal kembali ke `/data-warga`, sesuai keputusan awal.
- Detail warga → Hapus Data → konfirmasi → daftar. Warga dengan laporan terkait tidak boleh dihapus sebelum laporan tersebut dihapus.
- Catatan Kematian → ikon mata → `/catatan-kematian/lapor?laporan=<id>` → baca/ubah/hapus pada form 07 yang sama.
- Pencarian, filter, pagination dan periode benar-benar mengambil data database. Tidak ada fallback mock bila data kosong.
- Unduh PDF/Excel menggunakan periode terpilih dan data yang sama dengan layar.

Detail keputusan dan batas audit: `09 §D` dan `11-sqlite-crud.md`.
