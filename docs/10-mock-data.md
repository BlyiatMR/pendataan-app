# 10 — Data Mock (persis dari desain)

Aturan: **salin apa adanya**, termasuk angka yang tidak konsisten (lihat `09 A1`). Semua nama/NIK di bawah adalah data contoh dari Figma (fiktif).
Letakkan di `app/data/*.ts`. Tipe ada di `app/types/index.ts`. Tanda **[ASUMSI]** = tidak ada di Figma.

## 1. Warga — halaman 1 (6 baris di layar 03)

```ts
export const wargaHalaman1: Warga[] = [
  { id: '1', nik: '7306011205880001', nama: 'Andi Baso',   jk: 'L', rt: '01', rw: '01', dusun: 'Bontoa',  status: 'Tetap' },
  { id: '2', nik: '7306014509920002', nama: 'Siti Aminah', jk: 'P', rt: '01', rw: '02', dusun: 'Bontoa',  status: 'Tetap' },
  { id: '3', nik: '7306010803850003', nama: 'Muh. Rizal',  jk: 'L', rt: '02', rw: '01', dusun: 'Lompo',   status: 'Tetap' },
  { id: '4', nik: '7306015507950004', nama: 'Nurhayati',   jk: 'P', rt: '02', rw: '02', dusun: 'Lompo',   status: 'Pendatang' },
  { id: '5', nik: '7306012011700005', nama: 'Daeng Sila',  jk: 'L', rt: '03', rw: '01', dusun: 'Pattiro', status: 'Tetap' },
  { id: '6', nik: '7306014102650006', nama: 'Hj. Rosmini', jk: 'P', rt: '03', rw: '02', dusun: 'Pattiro', status: 'Tetap' },
]
```
Tampilan RT/RW: `formatRtRw(rt, rw)` → `01 / 01`. Dusun tampil `Dusun Bontoa` (prefix "Dusun " di sel tabel).

**Total & pagination:** `total = 1248`, `perPage = 6`, `halaman = 208`. Halaman 2–208 **[ASUMSI]**: buat generator deterministik data fiktif (NIK berpola `73060…`, nama acak dari daftar nama Bugis-Makassar fiktif) agar pagination bisa dicoba. Halaman 1 **harus** persis tabel di atas.

## 2. Detail Warga — Andi Baso (id `1`, layar 05)

```ts
export const detailAndiBaso = {
  ...wargaHalaman1[0],
  noKk: '7306010101120001',
  jenisKelaminLabel: 'Laki-laki',
  tempatLahir: 'Gowa',
  tanggalLahir: '1988-05-12',          // tampil "Gowa, 12 Mei 1988"
  agama: 'Islam',
  statusPerkawinan: 'Kawin',
  pekerjaan: 'Petani',
  alamat: 'Jl. Bontoa No. 12, Dusun Bontoa',
  kewarganegaraan: 'WNI',
  diperbarui: '2026-10-10',            // tampil "10 Okt 2026"
  badgeProfil: 'Warga Tetap',
  riwayat: [
    { judul: 'Alamat diperbarui',      aktor: 'Admin Desa', tanggal: '2026-10-10' }, // "10 Okt 2026"
    { judul: 'Data warga ditambahkan', aktor: 'Admin Desa', tanggal: '2026-08-02' }, // "02 Agu 2026"
  ],
}
```
Warga id 2–6: field detail selain yang ada di tabel **[ASUMSI]** diisi data fiktif (No. KK 16 digit, tempat/tanggal lahir, agama, dst.) agar halaman detail bisa dibuka. `kewarganegaraan` default `WNI`.

## 3. Dashboard

```ts
export const statDashboard = [
  { label: 'Total Warga',        value: '1.248', caption: 'Data per Oktober 2026',    icon: 'users' },
  { label: 'Kartu Keluarga',     value: '362',   caption: 'Tersebar di 4 RW',          icon: 'file' },
  { label: 'Kematian Bulan Ini', value: '3',     caption: '1 menunggu verifikasi',     icon: 'heart' },
  { label: 'Data Belum Lengkap', value: '27',    caption: 'Perlu dilengkapi petugas',  icon: 'alert' },
]

export const grafikKematian = [
  { label: 'Mei', value: 2 }, { label: 'Jun', value: 3 }, { label: 'Jul', value: 1 },
  { label: 'Agu', value: 4 }, { label: 'Sep', value: 2 }, { label: 'Okt', value: 3 }, // Okt = emas
]

export const aktivitasTerbaru = [
  { judul: 'Data warga ditambahkan',   sub: 'Nurhayati • RT 02 / RW 02',   waktu: '10:24' },
  { judul: 'Laporan kematian dicatat', sub: 'Hj. Marhani • RT 01 / RW 02', waktu: 'Kemarin' },
  { judul: 'Data warga diperbarui',    sub: 'Muh. Rizal • alamat',         waktu: 'Kemarin' },
  { judul: 'Data warga ditambahkan',   sub: 'Daeng Sila • RT 03 / RW 01',  waktu: '2 hari' },
]
```

## 4. Catatan Kematian (layar 06)

```ts
export const catatanKematian = [
  { nama: 'Hj. Marhani',  nik: '7306014308450011', tgl: '2026-10-12', rt: '01', rw: '02', pelapor: 'Andi Baso',   status: 'Terverifikasi' },
  { nama: 'Daeng Tompo',  nik: '7306010505400012', tgl: '2026-10-03', rt: '02', rw: '01', pelapor: 'Muh. Rizal',  status: 'Terverifikasi' },
  { nama: 'Nurmiati',     nik: '7306014412580013', tgl: '2026-09-27', rt: '03', rw: '02', pelapor: 'Siti Aminah', status: 'Terverifikasi' },
  { nama: 'Abd. Kadir',   nik: '7306012207470014', tgl: '2026-09-15', rt: '01', rw: '01', pelapor: 'Daeng Sila',  status: 'Menunggu' },
  { nama: 'Rahmatia',     nik: '7306015003520015', tgl: '2026-09-02', rt: '02', rw: '02', pelapor: 'Nurhayati',   status: 'Terverifikasi' },
]
// Tampil: tgl → "12 Okt 2026"; RT/RW → "01 / 02"

export const statKematian = [
  { label: 'Bulan Ini',           value: '3', caption: 'Oktober 2026',         icon: 'heart' },
  { label: 'Bulan Lalu',          value: '2', caption: 'September 2026',       icon: 'calendar' },
  { label: 'Menunggu Verifikasi', value: '1', caption: 'Perlu ditinjau admin', icon: 'alert' },
]
```
Catatan: nilai stat di atas **tidak** sama dengan hitungan tabel (lihat `09 A1`). Hardcode stat, jangan hitung.

**Warga terpilih (layar 07):** `{ nama: 'Hj. Marhani', nik: '7306014308450011', rt: '01', rw: '02', badge: 'Dipilih' }`

## 5. Laporan Bulanan (layar 08)

```ts
export const statLaporan = [
  { label: 'Total Warga',     value: '1.248', caption: 'Per akhir Oktober',     icon: 'users' },
  { label: 'Warga Meninggal', value: '3',     caption: 'Bulan ini',             icon: 'heart' },
  { label: 'Data Diperbarui', value: '41',    caption: 'Bulan ini',             icon: 'edit' },
  { label: 'Warga Baru',      value: '5',     caption: 'Ditambahkan bulan ini', icon: 'users' },
]

export const rekapRw = [
  { rw: 'RW 01', kk: 92, warga: 318, l: 158, p: 160, meninggal: 1 },
  { rw: 'RW 02', kk: 88, warga: 301, l: 150, p: 151, meninggal: 1 },
  { rw: 'RW 03', kk: 97, warga: 332, l: 170, p: 162, meninggal: 1 },
  { rw: 'RW 04', kk: 85, warga: 297, l: 146, p: 151, meninggal: 0 },
]
export const totalRekap = { rw: 'Total', kk: 362, warga: 1248, l: 624, p: 624, meninggal: 3 } // ✓ = jumlah baris
export const periode = 'Oktober 2026'
```

## 6. Sidebar user

`{ inisial: 'AD', nama: 'Admin Desa', peran: 'Petugas Kantor' }`

## 7. Opsi dropdown **[ASUMSI — tidak ada di Figma]**

| Field | Opsi usulan | Dasar |
|---|---|---|
| Jenis Kelamin | Laki-laki, Perempuan | tabel `L`/`P`, detail "Laki-laki" |
| Agama | Islam, Kristen, Katolik, Hindu, Buddha, Konghucu | standar KTP; "Islam" ada di desain |
| Status Perkawinan | Belum Kawin, Kawin, Cerai Hidup, Cerai Mati | standar KTP; "Kawin" ada di desain |
| Dusun | Bontoa, Lompo, Pattiro | muncul di tabel 03 |
| Status Warga | Tetap, Pendatang | badge di tabel 03 |
| Hubungan Pelapor | Suami/Istri, Anak, Orang Tua, Saudara, Tetangga, Perangkat Desa, Lainnya | usulan |
| Filter RW | Semua RW, RW 01, RW 02, RW 03, RW 04 | tabel 08 (4 RW) |
| Filter RT | Semua RT, RT 01, RT 02, RT 03 | RT yang muncul di tabel 03 |
| Filter Status | Semua Status, Tetap, Pendatang | badge tabel 03 |
| Periode laporan | Oktober 2026 (+ bulan sebelumnya) | select 08 |

Teks placeholder/label tombol tetap dari `04-screens.md`; opsi di atas hanya mengisi isi dropdown dan harus ditinjau pemilik proyek.
