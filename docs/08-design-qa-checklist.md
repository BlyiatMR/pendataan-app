# 08 — Checklist QA: Desain ↔ Kode

Tujuan: memastikan **tidak ada selisih** antara Figma dan hasil develop. Centang `[x]` hanya setelah diverifikasi di browser pada viewport **1440×900**, zoom 100%.

## 1. Cara membandingkan

**Dengan Figma MCP:** `get_screenshot(fileKey="AwEI2L2ja0JkodTPFclSzm", nodeId=<node>, maxDimension=1440)` menghasilkan PNG 1440×900 (1:1). Bandingkan dengan screenshot halaman lokal.

**Tanpa Figma MCP:** export tiap layar dari Figma (Export → PNG 1x) ke `docs/design-reference/`:

| Berkas | Node Mockup |
|---|---|
| `01-login.png` | `2:166` |
| `02-dashboard.png` | `2:193` |
| `03-data-warga.png` | `2:331` |
| `04-tambah-warga.png` | `2:560` |
| `05-detail-warga.png` | `2:691` |
| `06-catatan-kematian.png` | `2:806` |
| `07-lapor-kematian.png` | `2:1001` |
| `08-laporan-bulanan.png` | `2:1107` |
| `komponen.png` | `2:138` |

Toleransi: dimensi ≤ **1px**, warna **identik** (bandingkan dengan eyedropper/devtools), teks identik.

## 2. Pengukuran emas (cek di devtools — Computed)

| Elemen | Nilai wajib |
|---|---|
| Sidebar | lebar 248, bg `#2F4A27`, padding 24/16 |
| Nav item | tinggi 42, radius 8, gap ikon-teks 12; aktif bg `#557A45` |
| Main padding | 28 (atas/bawah) × 32 (kiri/kanan) |
| Header halaman | tinggi 52; H1 26px/700 |
| Tombol | tinggi **41**, radius 8, padding-x 18, font 14/600 |
| Input / Select / Search | tinggi **44**, radius 8, padding-x 14, border 1px `#D8E0CF` |
| Field (label+input) | tinggi **66** (label 16 + gap 6 + input 44) |
| Badge | tinggi **23**, pill, font 12/500 |
| Kartu | radius 12, border 1px `#D8E0CF`, **tanpa shadow** |
| Stat card (1440) | 267×153; padding 20; nilai 30/700 |
| Chip ikon | 36×36, radius 10, bg `#E3EBDA` |
| Header tabel | tinggi 40, bg `#EEF2E8` |
| Baris tabel | tinggi 50 (03, 06) / 43 (08), border-bottom 1px |
| Pagination | tombol 36×36, radius 8, gap 6 |
| Login card | 420×489, tanpa fill/border |
| Login Row | tinggi 100 |
| Panel kiri login | 720 lebar, bg `#557A45`, padding 72 |
| Form 04 | grid 3×346, gap kolom 20, baris 16; kartu 1128×531 |
| Kartu profil (05) | lebar 340; kolom kanan 768; gap 20 |
| Batang grafik | lebar 48; tinggi = nilai×36; Okt `#E2B23A` |

## 3. Audit otomatis (jalankan di root proyek)

```bash
# 1. Tidak ada hex di luar main.css
grep -rnE "#[0-9A-Fa-f]{3,8}\b" app --include=*.vue --include=*.ts | grep -v "assets/css/main.css" && echo "❌ hex ditemukan" || echo "✅"

# 2. Tidak ada shadow / gradient / ring
grep -rnE "shadow-|bg-gradient|from-|to-|ring-" app --include=*.vue && echo "❌" || echo "✅"

# 3. Tidak ada warna/rounded bawaan Tailwind di luar token
grep -rnE "(bg|text|border)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-" app --include=*.vue && echo "❌" || echo "✅"
grep -rnE "rounded-(sm|md|lg|xl|2xl|3xl)\b" app --include=*.vue && echo "❌" || echo "✅"

# 4. Type check
npx nuxi typecheck
```
(`ring-`/`outline-` untuk focus-visible hanya di komponen dasar sesuai `03 §17`; kecualikan bila perlu.)

## 4. Checklist per layar

### 01 Login (`2:166`)
- [ ] Panel kiri/kanan masing-masing 720px; panel kanan tanpa bg sendiri
- [ ] Logo 104×104 di (72,72); judul Montserrat 46/600 putih 3 baris; footer 2 baris putih@88%
- [ ] "Masuk" Montserrat 30/600; subjudul 14 `ink-muted`
- [ ] Field Username & Password 348 lebar; label & placeholder persis
- [ ] Row 100px: checkbox 18×18 r4 + "Ingat saya" | "Lupa password?" `#46663A` 13/600
- [ ] Tombol Masuk 348×41; copyright 12px tengah, jarak 24 dari kartu
- [ ] Klik Masuk → `/dashboard`

### 02 Dashboard (`2:193`)
- [ ] Sidebar lengkap (brand, 4 menu, user AD emas, Keluar); Dashboard aktif
- [ ] Header + tombol `+ Tambah Warga` (152×41)
- [ ] 4 stat card (nilai/caption/ikon sesuai tabel `04`)
- [ ] Grafik 6 batang (tinggi 72/108/36/144/72/108), Okt emas, lebar area 484
- [ ] Kartu aktivitas 4 item; 440 lebar; titik 10px `#557A45`

### 03 Data Warga (`2:331`)
- [ ] Filter bar 78 tinggi: search (flex) + 3 select 170 + Cari 66×41; tanpa label
- [ ] Kolom tabel & lebar sesuai `03 §8`; 6 baris; badge Tetap/Pendatang benar
- [ ] Ikon mata + pensil `#5F6B58`, gap 14
- [ ] Pagination: teks persis + `1 2 3 … 208` (1 aktif hijau)
- [ ] Mata baris 1 → detail; `+ Tambah Warga` → 04

### 04 Tambah Warga (`2:560`)
- [ ] BackButton 40×40 `#2F4A27` ikon; H1/subjudul persis
- [ ] 3 baris × 3 kolom field + Alamat penuh + 4 kolom (RT, RW, Dusun, Status Warga)
- [ ] Label berakhiran ` *` untuk NIK, No. KK, Nama Lengkap
- [ ] Divider 1px; judul `Data Pribadi` & `Alamat`
- [ ] Actions rata kanan: Batal (secondary) + Simpan Data (primary)

### 05 Detail Warga (`2:691`)
- [ ] Header: back + 2 tombol (Lapor Kematian secondary, Ubah Data primary)
- [ ] Kartu profil 340: foto 104 `AB`, nama 20/700, badge Warga Tetap, 3 KV inline
- [ ] Data Pribadi: 4 baris × 2 kolom, label 12 / nilai 14/500
- [ ] Riwayat: 2 item dengan titik, aktor, tanggal kanan

### 06 Catatan Kematian (`2:806`)
- [ ] 3 stat card (bukan 4); ikon heart/calendar/alert
- [ ] Tabel 7 kolom, 5 baris, badge Terverifikasi/Menunggu; **tanpa pagination**
- [ ] `+ Lapor Kematian` primary → 07

### 07 Lapor Kematian (`2:1001`)
- [ ] Search penuh lebar berlabel `Cari Warga`
- [ ] Kartu warga terpilih: avatar HM, teks `NIK … • RT 01 / RW 02`, badge Dipilih, bg `#EEF3E8`
- [ ] Grid 3×2 field `Detail Kejadian`; dropzone dashed `#557A45` tinggi 107
- [ ] Actions: Batal + Simpan Laporan

### 08 Laporan Bulanan (`2:1107`)
- [ ] Header: select 180×44 + Unduh PDF (secondary) + Ekspor Excel (primary), gap 14
- [ ] 4 stat card (ikon users/heart/pencil/users)
- [ ] Tabel 6 kolom; 4 baris RW + baris Total `#EEF2E8` semibold; angka `1.248`

### Komponen (`2:138`)
- [ ] Primary/Secondary 75×41 (label "Label"), Input/Select/Search 300×66, Badge ×3

## 5. Uji klik-through (Playwright)

```ts
// tests/flow.spec.ts
import { test, expect } from '@playwright/test'
test.use({ viewport: { width: 1440, height: 900 } })

const sidebar = [
  ['Dashboard', '/dashboard'], ['Data Warga', '/data-warga'],
  ['Catatan Kematian', '/catatan-kematian'], ['Laporan', '/laporan'],
] as const

test('login → dashboard', async ({ page }) => {
  await page.goto('/login')
  await page.getByRole('button', { name: 'Masuk' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
})

for (const start of ['/dashboard', '/data-warga', '/data-warga/tambah', '/catatan-kematian', '/catatan-kematian/lapor', '/laporan']) {
  for (const [name, url] of sidebar) {
    test(`${start} → sidebar ${name}`, async ({ page }) => {
      await page.goto(start)
      await page.getByRole('link', { name }).first().click()
      await expect(page).toHaveURL(new RegExp(url + '$'))
    })
  }
  test(`${start} → Keluar`, async ({ page }) => {
    await page.goto(start)
    await page.getByRole('link', { name: 'Keluar' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })
}

test('visual: login', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveScreenshot('01-login.png', { maxDiffPixelRatio: 0.002 })
})
```
Gunakan `docs/design-reference/*.png` sebagai baseline `toHaveScreenshot` (salin ke folder snapshot Playwright dengan nama yang sama).

## 6. Matriks interaksi prototype (centang setelah diuji)

- [ ] 01: Masuk → 02
- [ ] 02: + Tambah Warga → 04 · sidebar → 03/06/08/01
- [ ] 03: + Tambah Warga → 04 · mata baris 1 → 05 · sidebar → 02/06/08/01
- [ ] 04: ← / Batal / Simpan Data → 03 · sidebar → 02/03/06/08/01
- [ ] 05: ← → 03 · Lapor Kematian → 07 · Ubah Data → 04 · sidebar → 02/03/06/08/01
- [ ] 06: + Lapor Kematian → 07 · sidebar → 02/03/08/01
- [ ] 07: ← / Batal / Simpan Laporan → 06 · sidebar → 02/03/06/08/01
- [ ] 08: sidebar → 02/03/06/01
- [ ] Transisi dissolve 200ms ease-out; sidebar tidak berkedip

## 7. QA fungsional SQLite/CRUD — 25 Oktober 2026

Checklist visual di atas sengaja tetap `[ ]` karena baseline PNG Figma belum tersedia di workspace. Pengujian perilaku dinamis yang sudah dijalankan:

- [x] Login/session: API data privat menolak 401 tanpa cookie; logout menghapus sesi.
- [x] SQLite: schema dibuat, migrasi aditif, seed satu kali, database tetap terbaca setelah restart.
- [x] Warga: create/read/update/delete; validasi 16 digit NIK/KK, field opsional, duplikat NIK, filter, pencarian dan pagination.
- [x] Kematian: create/read/update/delete; identitas warga diverifikasi server; preselect/pencarian; status; PDF/JPG ≤2 MB sebagai BLOB.
- [x] Laporan: dashboard, statistik periode, grafik, rekap RW historis, ekspor PDF/Excel berasal dari database.
- [x] Security boundary: HttpOnly session, Origin check untuk write, parameterized SQL, validasi body/enum/tanggal, no-store response, tidak ada localStorage NIK/KK.
- [x] Browser smoke 1440×900: alur login → tambah/ubah/hapus warga → lapor/ubah/hapus kematian → laporan → logout, tanpa console error.

Perintah reproduksi:

```sh
npm run typecheck
npm test
# Windows PowerShell:
$env:BROWSER_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
npm run test:browser
```

Test server terisolasi memakai database temporary; tidak membaca atau mengubah `data/sunggumanai.db` pengguna.
