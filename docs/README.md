# Dokumentasi Pengembangan — SI Pendataan Warga Desa Sunggumanai

Paket dokumen ini dibuat dari ekstraksi langsung file Figma (Mockup, Prototype, Komponen)
agar AI agent membangun aplikasi yang identik dengan desain.

| # | File | Isi |
|---|---|---|
| — | `../AGENTS.md` | Aturan utama untuk AI agent (baca pertama) |
| 01 | `01-overview-and-scope.md` | Ruang lingkup, layar, entitas data |
| 02 | `02-design-tokens.md` | Warna, font, radius, spacing + `@theme` Tailwind |
| 03 | `03-components.md` | Spesifikasi komponen UI & API Vue |
| 04 | `04-screens.md` | Spesifikasi 8 layar + node ID Figma |
| 05 | `05-prototype-flows.md` | Matriks klik/navigasi prototype |
| 06 | `06-architecture-nuxt.md` | Struktur Nuxt, route, layout, composable |
| 07 | `07-implementation-plan.md` | Fase kerja + prompt siap pakai |
| 08 | `08-design-qa-checklist.md` | Checklist desain ↔ kode |
| 09 | `09-open-questions.md` | Celah desain & keputusan default |
| 10 | `10-mock-data.md` | Data mock persis dari desain |
| 11 | `11-sqlite-crud.md` | Backend SQLite aktif, CRUD, setup, statistik, pengujian |

Folder yang perlu Anda tambahkan sendiri (tidak bisa diunduh otomatis):

```
docs/design-reference/    ← PNG 1x tiap layar (export Figma, 1440×900)
public/images/logo-kab-gowa.png   ← export dari Figma node 2:168
```
