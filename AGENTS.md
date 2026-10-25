# AGENTS.md — SI Pendataan Warga Desa Sunggumanai

> File ini dibaca PERTAMA oleh AI agent (Claude Code, Cursor, Copilot, dll).
> Tujuan: membangun aplikasi web yang **identik dengan desain Figma** (tampilan + alur prototype), tanpa improvisasi.

## 1. Ringkasan proyek

Aplikasi web internal **Sistem Pendataan Warga Desa Sunggumanai** (Kab. Gowa, Sulawesi Selatan) untuk petugas kantor desa:
login, dashboard ringkasan, kelola data warga, catatan & laporan kematian, dan laporan bulanan.

| Item | Nilai |
|---|---|
| Bahasa UI | Bahasa Indonesia (copy HARUS persis seperti di desain) |
| Stack wajib | **Nuxt** + **Vue 3** + **Tailwind CSS** + **Iconify** (via `@nuxt/icon`) |
| Font | Inter (UI), Montserrat SemiBold (judul login & nama brand sidebar) |
| Canvas desain | Desktop **1440 × 900** (tidak ada desain mobile/tablet) |
| Tahap awal | Frontend dengan **data mock**; backend menyusul (lihat `docs/07`) |

## 2. Sumber kebenaran (Source of Truth)

Figma: `https://www.figma.com/design/AwEI2L2ja0JkodTPFclSzm/SI-Pendataan-Warga---Desa-Sunggumanai--UI-UX-`
**fileKey = `AwEI2L2ja0JkodTPFclSzm`**

| Page Figma | Node ID | Fungsi |
|---|---|---|
| 1. Wireframe (Hitam-Putih) | `0:1` | Referensi struktur saja |
| **2. Mockup (Warna)** | `1:2` | **Sumber kebenaran VISUAL** (warna, ukuran, teks) |
| **3. Prototype (Klik)** | `1:3` | **Sumber kebenaran ALUR** (klik → halaman tujuan) |

Hierarki prioritas bila ada konflik:
1. **Figma (Mockup/Prototype)** — jika agent punya akses Figma MCP, baca langsung dan menang atas dokumen ini.
2. Dokumen di folder `docs/` (hasil ekstraksi dari Figma, tanggal 22 Okt 2026).
3. Konvensi umum Nuxt/Vue/Tailwind.

Jika menemukan ketidaksesuaian: **BERHENTI, jangan menebak.** Catat di `docs/09-open-questions.md` lalu ikuti nilai Figma.

## 3. Urutan membaca dokumen

1. `docs/01-overview-and-scope.md` — ruang lingkup, daftar layar, entitas data
2. `docs/02-design-tokens.md` — warna, tipografi, radius, spacing (+ kode `@theme` Tailwind)
3. `docs/03-components.md` — spesifikasi tiap komponen UI + API komponen Vue
4. `docs/04-screens.md` — spesifikasi 8 layar (ukuran, isi, copy, node ID Figma)
5. `docs/05-prototype-flows.md` — matriks navigasi prototype
6. `docs/06-architecture-nuxt.md` — struktur folder, route, layout, composable
7. `docs/07-implementation-plan.md` — fase kerja + prompt siap pakai
8. `docs/08-design-qa-checklist.md` — checklist kecocokan desain ↔ kode
9. `docs/09-open-questions.md` — hal yang TIDAK ada di desain + keputusan default
10. `docs/10-mock-data.md` — data mock persis seperti di desain

## 4. Aturan emas (JANGAN dilanggar)

1. **Jangan mengarang UI.** Tidak ada halaman, tombol, kolom, atau fitur yang tidak ada di Figma. Tidak ada "register", "settings", "dark mode", dsb.
2. **Hanya pakai token.** Semua warna/radius/font berasal dari `docs/02`. Dilarang hex acak (`#xxxxxx`) di komponen/halaman; hex hanya boleh di `app/assets/css/main.css`.
3. **Pakai komponen yang sudah didefinisikan** di `docs/03`. Jangan menduplikasi tombol/field/badge/tabel di halaman.
4. **Angka piksel dari desain adalah final** (tinggi tombol 41, input 44, sidebar 248, radius kartu 12, dst.). Gunakan nilai arbitrer Tailwind (`h-[41px]`) bila skala bawaan tidak cocok.
5. **Copy persis.** Teks (termasuk `+ Tambah Warga`, `Simpan Data`, `Menampilkan 1–6 dari 1.248 warga`, tanda `•`, `–`, `…`) disalin apa adanya.
6. **Tanpa shadow, tanpa gradient, tanpa blur.** Desain 100% flat dengan border 1px.
7. **Satu sumber ikon:** `<Icon name="lucide:...">` sesuai tabel mapping di `docs/03`. Jangan campur set ikon.
8. **State turunan** (hover/focus/disabled/error) tidak ada di Figma → hanya boleh didefinisikan terpusat di komponen dasar sesuai `docs/03 §Derived states`, bukan per halaman.
9. **Pisahkan data dari UI.** Halaman hanya memanggil composable (`useWarga()`, dst.); data mock di `app/data/`. Agar mudah diganti API.
10. **Jangan menambah dependency** di luar yang tercantum di `docs/06 §Dependencies` tanpa izin.
11. **Jangan "memperbaiki" data mock** meski tidak konsisten (lihat `docs/09`). Salin persis, catat saja.
12. Bila desain ambigu → pilih opsi yang **paling dekat dengan screenshot**, lalu catat di `docs/09`.

## 5. Alur kerja per layar (wajib diikuti)

```
1. Baca bagian layar di docs/04 + node ID Figma-nya
2. (Jika ada Figma MCP) get_screenshot node mockup → simpan sebagai referensi visual
3. (Jika ada Figma MCP) get_design_context node mockup → cocokkan dengan docs/03 & docs/02
4. Implementasi memakai komponen dari docs/03 (buat komponen baru HANYA jika belum ada, lalu dokumentasikan)
5. Jalankan dev server, buka route di viewport 1440×900, bandingkan dengan screenshot
6. Centang docs/08-design-qa-checklist.md untuk layar tsb
7. Commit kecil: "feat(screen-03): data warga list — match figma 2:331"
```

Perintah Figma MCP yang berguna: `get_metadata` (struktur), `get_design_context` (kode referensi + screenshot),
`get_screenshot` (gambar 1:1), `download_assets` (logo/SVG ikon). **Output `get_design_context` adalah referensi React+Tailwind — WAJIB diadaptasi ke komponen Vue/Nuxt proyek ini, bukan disalin mentah.**

## 6. Konvensi kode

- `<script setup lang="ts">` + Composition API; TypeScript strict.
- Nama komponen PascalCase, prefix `App` untuk komponen dasar (`AppButton`), prefix domain untuk lainnya (`WargaTable`).
- Komponen Nuxt auto-import; jangan import manual kecuali perlu.
- Tailwind: urutan kelas = layout → ukuran → spacing → tipografi → warna → border. Pakai kelas token (`bg-brand-500`, `text-ink-muted`, `rounded-card`).
- Teks UI di-hardcode Bahasa Indonesia (belum perlu i18n).
- Format: tanggal `10 Okt 2026` / `02 Agu 2026` (hari 2 digit, bulan 3 huruf Indonesia), angka `1.248` (titik ribuan), RT/RW `01 / 02`.
- Aksesibilitas minimum: `<label for>` pada field, `aria-label` pada tombol ikon (mis. "Lihat detail", "Ubah"), `aria-current="page"` pada nav aktif.

## 7. Definition of Done (per layar)

- [ ] Route benar & dapat dicapai lewat alur prototype (`docs/05`)
- [ ] Visual cocok dengan screenshot Figma pada 1440×900 (toleransi ≤ 1px pada dimensi, warna identik)
- [ ] Semua teks identik dengan desain
- [ ] Hanya memakai komponen & token resmi
- [ ] Tidak ada shadow/gradient; tidak ada hex di luar `main.css`
- [ ] Item di `docs/08` untuk layar tsb tercentang
- [ ] Tidak ada error/warning di console & `nuxi typecheck` bersih
