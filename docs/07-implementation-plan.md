# 07 — Rencana Implementasi (Vibe Coding)

Kerjakan **berurutan**. Satu fase = satu sesi/PR kecil. Jangan lanjut fase berikutnya sebelum checklist fase ini hijau dan `08` untuk layar terkait tercentang.
Setiap prompt di bawah bisa disalin langsung ke AI agent. Semua prompt diawali dengan konteks yang sama:

> **Konteks (tempel di awal sesi):** Baca `AGENTS.md` lalu seluruh `docs/`. Figma fileKey `AwEI2L2ja0JkodTPFclSzm`. Ikuti aturan emas. Jangan mengarang UI. Bila ada ketidakjelasan, catat di `docs/09-open-questions.md` dan lanjutkan dengan keputusan default.

---

## Fase 0 — Setup proyek
**Tujuan:** proyek Nuxt jalan dengan Tailwind, Iconify, font, token.
**Tugas:** init Nuxt, pasang dependency (`06 §1`), tulis `nuxt.config.ts` (`06 §2`), `main.css` (`02 §4`), taruh `public/images/logo-kab-gowa.png`, buat `layouts/default.vue` & `auth.vue` kosong, `app.vue`.
**Selesai bila:** `npm run dev` jalan; halaman kosong berlatar `#F5F6EF`; `<Icon name="lucide:house"/>` tampil; font Inter termuat.

> **Prompt 0:** "Setup proyek sesuai `docs/06-architecture-nuxt.md` §1–§3 dan token `docs/02-design-tokens.md` §4. Jangan buat halaman apa pun dulu. Tunjukkan hasil `npm run dev`."

## Fase 1 — Komponen dasar + style guide
**Figma:** `2:138` (Komponen) + spesifikasi `03`.
**Tugas:** buat semua komponen `components/app/*` & `layout/*` (`03`), `utils/format.ts`, `utils/icons.ts`, halaman `/dev/komponen` yang menyusun ulang frame Komponen: Primary, Secondary, Input, Select, Search, Badge×3 (+ NavItem aktif/tidak aktif, StatCard, Pagination, BarChart, KeyValue, SelectedResidentCard, UploadDropzone).
**Selesai bila:** `/dev/komponen` identik dengan screenshot `2:138` untuk 8 komponen asli; tinggi tombol 41, input 44, field 66; verifikasi ikon (`03 §0`) selesai.

> **Prompt 1:** "Implementasikan komponen dasar `docs/03-components.md`. Buat `/dev/komponen`. Ambil `get_screenshot` node `2:138` dan bandingkan. Ukur tinggi tombol (41px), input (44px), field (66px), badge (23px) dengan devtools dan laporkan angkanya."

## Fase 2 — Layout + Login + Dashboard
**Figma:** `2:166` (Login), `2:193` (Dashboard).
**Tugas:** `layouts/auth.vue`, `layouts/default.vue`, `AppSidebar`, `login.vue`, `dashboard.vue`, `useDashboard`, `useAuth`, data mock `statistik/aktivitas`. Hubungkan: Masuk → `/dashboard`, sidebar & `+ Tambah Warga` (halaman tujuan boleh masih placeholder).
**Selesai bila:** screenshot 1440×900 cocok untuk 01 & 02; kartu login tanpa fill/border; Row login setinggi 100px; batang grafik tinggi 72/108/36/144/72/108 dengan Okt berwarna emas.

> **Prompt 2:** "Bangun layar 01 Login dan 02 Dashboard sesuai `docs/04-screens.md`. Bandingkan dengan `get_screenshot` node `2:166` dan `2:193` pada viewport 1440×900. Jangan menambah elemen. Centang `docs/08` bagian 01 & 02."

## Fase 3 — Data Warga (daftar, tambah, detail, ubah)
**Figma:** `2:331`, `2:560`, `2:691`.
**Tugas:** `useWarga`, `data/warga.ts` (`10`), `WargaTable`, `WargaFilterBar`, `Pagination`, `WargaForm`, `WargaProfileCard`, `WargaDataCard`, halaman `data-warga/*`. Filter & pagination berfungsi di data mock (6/halaman). `ubah.vue` memakai `WargaForm` terisi.
**Selesai bila:** layar 03/04/05 cocok dengan screenshot; alur A–D (`05 §3`) benar; `Simpan Data` menambah baris & kembali ke 03; teks `Menampilkan 1–6 dari 1.248 warga` persis pada kondisi awal.

> **Prompt 3:** "Bangun layar 03, 04, 05 dan route `ubah` (reuse `WargaForm`). Semua copy dari `docs/04-screens.md`. Tabel pakai grid kolom `docs/03 §8`. Setelah selesai, jalankan alur klik B, C, D dari `docs/05` dan laporkan hasilnya."

## Fase 4 — Catatan Kematian, Lapor Kematian, Laporan Bulanan
**Figma:** `2:806`, `2:1001`, `2:1107`.
**Tugas:** `useKematian`, `useLaporan`, `KematianTable`, `KematianForm` (pencarian warga → SelectedResidentCard; `?warga=` dari detail), `UploadDropzone` (validasi tipe/ukuran klien), halaman `catatan-kematian/*`, `laporan.vue`. Unduh PDF / Ekspor Excel = UI statis (tombol tampil, belum ada aksi).
**Selesai bila:** layar 06/07/08 cocok; Stats layar 06 **3 kolom**; tabel laporan baris Total berlatar `muted-bg`; alur E & F benar.

> **Prompt 4:** "Bangun layar 06, 07, 08 sesuai `docs/04-screens.md`. Data persis `docs/10-mock-data.md` (jangan 'memperbaiki' angka). Unduh PDF/Ekspor Excel hanya tampilan."

## Fase 5 — Pengikatan alur & transisi
**Tugas:** pastikan seluruh 45 interaksi `05 §2` berjalan; transisi `dissolve` 200ms; sidebar tidak berkedip; `aria-current`; route `/` → `/login`; `Keluar` → `/login` dari semua layar.
**Selesai bila:** skrip klik-through (`08 §5`) lulus.

> **Prompt 5:** "Audit navigasi terhadap tabel `docs/05-prototype-flows.md` §2. Buat tes Playwright yang mengklik tiap sel matriks sidebar dan setiap elemen halaman, lalu memeriksa URL tujuan."

## Fase 6 — QA fidelity & rapikan
**Tugas:** jalankan `docs/08` penuh; perbaiki selisih piksel; audit hex/shadow (`08 §3`); `nuxi typecheck`; hapus kode mati; pastikan `/dev/komponen` tidak ikut build produksi.

> **Prompt 6:** "Lakukan audit lengkap `docs/08-design-qa-checklist.md`. Untuk tiap layar, tangkap screenshot 1440×900, bandingkan dengan `docs/design-reference/`, dan daftar selisih >1px. Perbaiki yang ada. Jangan ubah token."

## Fase 7 — Backend & fitur lanjutan (opsional, perlu keputusan pemilik)
Pilih DB/auth/hosting (lihat `06 §8`), ganti isi composable dengan API, validasi sisi server, auth nyata + middleware, ekspor PDF/Excel, definisi statistik ("Data Belum Lengkap", dst. — `09`). **Jangan mulai sebelum `09` ditinjau pemilik proyek.**

**Pembaruan 25 Oktober 2026:** pemilik meminta SQLite, dinamis, CRUD. Implementasi dan verifikasi dicatat di `11-sqlite-crud.md` dan `08 §7`; keputusan baru di `09 §D`. Checklist visual fase sebelumnya belum dinyatakan selesai karena baseline PNG Figma belum tersedia.

---

## Tips vibe coding agar tidak melenceng

1. **Satu layar per percakapan/PR.** Layar kecil = konteks fokus = lebih sedikit improvisasi.
2. **Selalu minta perbandingan visual** (screenshot kode vs `get_screenshot`) sebelum "selesai".
3. **Minta agent menyebut node ID** yang dipakai tiap kali menulis komponen (jejak audit).
4. Jika agent membuat warna/ukuran baru → tolak, minta pakai token (`02`).
5. Jika agent menambah fitur "biar bagus" (toast, empty-state ilustrasi, dsb.) → tolak; catat usulan di `09`.
6. Simpan referensi gambar di `docs/design-reference/` supaya agent tanpa Figma MCP tetap punya acuan 1:1.
7. Commit kecil dan sering; pesan commit memuat nomor layar & node ID.
