# 02 — Design Tokens

Diekstrak langsung dari node Figma (page Mockup). Figma **tidak** memakai Variables/Styles (jumlahnya 0), jadi semua nilai di bawah adalah nilai literal yang konsisten di seluruh layar.
Seluruh desain: **flat** — tanpa shadow, tanpa gradient. Border = **1px, stroke INSIDE** (di CSS: `border` + `box-sizing: border-box`, bawaan Tailwind).

## 1. Warna

| Token Tailwind | Hex | Dipakai untuk |
|---|---|---|
| `brand-900` | `#2F4A27` | Background sidebar; ikon panah kembali |
| `brand-700` | `#46663A` | Tautan "Lupa password?"; inisial avatar/foto profil; (turunan: hover primary) |
| `brand-500` | `#557A45` | **Primary**: tombol primer, nav aktif, panel brand login, batang grafik, titik aktivitas, ikon chip, halaman aktif pagination, border dropzone |
| `brand-100` | `#E3EBDA` | Chip ikon statistik, avatar/foto inisial |
| `gold-500` | `#E2B23A` | Avatar sidebar (`AD`) & batang grafik bulan berjalan (Okt) |
| `page` | `#F5F6EF` | Background halaman (frame layar) |
| `muted-bg` | `#EEF2E8` | Header tabel, baris Total, badge neutral |
| `selected-bg` | `#EEF3E8` | Kartu "Warga terpilih" (layar 07) |
| `upload-bg` | `#F5F8F1` | Dropzone unggah |
| `line` | `#D8E0CF` | Semua border (kartu, input, tombol sekunder, baris tabel, divider) |
| `ink` | `#1E2F1A` | Teks utama/judul, label field, teks tombol sekunder |
| `ink-muted` | `#5F6B58` | Teks sekunder, placeholder, subjudul, header kolom, ikon aksi (mata/pensil) |
| `sidebar-text` | `#CBD5C0` | Teks & ikon nav tidak aktif |
| `sidebar-subtext` | `#C3CEB7` | "Petugas Kantor", "Desa Sunggumanai" (brand text) |
| `white` | `#FFFFFF` | Kartu, input, teks di atas primary |
| `success-bg / success-fg` | `#E3F4EC` / `#1F7A52` | Badge Success (Tetap, Terverifikasi, Warga Tetap, Dipilih) |
| `warning-bg / warning-fg` | `#FBF1DB` / `#8A6414` | Badge Warning (Menunggu) |
| `neutral-bg / neutral-fg` | `#EEF2E8` / `#4A5844` | Badge Neutral (Pendatang) |

Opasitas: teks footer panel brand login = `#FFFFFF` @ **88%** (`text-white/88`).
Catatan: nilai teks di input contoh Figma memakai `ink-muted` karena berisi placeholder. Nilai yang diketik pengguna memakai `ink` (terlihat pada titik password `••••••••` = `#1E2F1A`).

## 2. Tipografi

Keluarga: **Inter** (400/500/600/700) dan **Montserrat** (600). Line-height Figma "auto" ⇒ CSS `line-height: normal` (jangan pakai `leading-tight/snug` dsb).

| Peran | Font | Ukuran | Weight | Warna | Letter/LH |
|---|---|---|---|---|---|
| Judul sistem (panel login) | Montserrat | 46 | 600 | white | LH 118%, LS −1% |
| "Masuk" (judul kartu login) | Montserrat | 30 | 600 | ink | normal |
| Brand sidebar "Pendataan Warga" | Montserrat | 14 | 600 | white | normal |
| Brand sidebar "Desa Sunggumanai" | Inter | 12 | 400 | sidebar-subtext | normal |
| Footer panel login | Inter | 15 | 400 | white/88 | LH 150% |
| Judul halaman (H1) | Inter | 26 | 700 | ink | normal |
| Subjudul halaman | Inter | 14 | 400 | ink-muted | normal |
| Judul kartu/section | Inter | 16 | 600 | ink | normal |
| Angka statistik | Inter | 30 | 700 | ink | normal |
| Label statistik | Inter | 13 | 500 | ink-muted | normal |
| Caption statistik / waktu / aktor | Inter | 12 | 400 | ink-muted | normal |
| Label field | Inter | 13 | 500 | ink | normal |
| Teks input/select/search | Inter | 14 | 400 | ink-muted (placeholder) / ink (nilai) | normal |
| Teks tombol | Inter | 14 | 600 | white / ink | normal |
| Nav aktif | Inter | 14 | 600 | white | normal |
| Nav tidak aktif | Inter | 14 | 500 | sidebar-text | normal |
| Nama user sidebar | Inter | 13 | 600 | white | normal |
| Peran user sidebar | Inter | 11 | 400 | sidebar-subtext | normal |
| Inisial avatar sidebar | Inter | 12 | 700 | ink | normal |
| Header kolom tabel | Inter | 13 | 600 | ink-muted | normal |
| Sel tabel (NIK, JK, RT/RW, dusun…) | Inter | 13 | 400 | ink | normal |
| Sel nama (tabel) & baris Total | Inter | 13 | 600 | ink | normal |
| Pagination teks / angka | Inter | 13 | 400 / 500 | ink-muted / ink | normal |
| Badge | Inter | 12 | 500 | sesuai varian | normal |
| Nilai batang grafik / bulan | Inter | 12 | 600 / 400 | ink-muted | normal |
| Judul aktivitas | Inter | 13 | 500 | ink | normal |
| Nama profil (detail) | Inter | 20 | 700 | ink | normal |
| Inisial foto profil (detail) | Inter | 34 | 700 | brand-700 | normal |
| KV (kartu data): label / nilai | Inter | 12 / 14 | 400 / 500 | ink-muted / ink | normal |
| KV (kartu profil): label / nilai | Inter | 13 / 13 | 400 / 500 | ink-muted / ink | normal |
| Nama warga terpilih / detail teks | Inter | 14 / 12 | 600 / 400 | ink / ink-muted | normal |
| Inisial warga terpilih | Inter | 14 | 700 | brand-700 | normal |
| Dropzone judul / hint | Inter | 13 / 12 | 600 / 400 | ink / ink-muted | normal |
| Copyright login | Inter | 12 | 400 | ink-muted | normal |

## 3. Radius, border, spacing

| Elemen | Nilai |
|---|---|
| Kartu, tabel, filter bar, stat card | radius **12**, border 1 `line`, bg white, **tanpa shadow** |
| Tombol, input, select, tombol kembali (40×40), tombol halaman (36×36), nav item | radius **8** |
| Chip ikon statistik (36×36) | radius **10** |
| Kartu warga terpilih, dropzone | radius **10** |
| Batang grafik | radius **6** |
| Checkbox | radius **4**, 18×18 |
| Badge, avatar, titik aktivitas | **999** (pil/lingkaran) |

| Ukuran penting | px |
|---|---|
| Sidebar lebar | 248 (padding 24 16 24 16, gap 4) |
| Main padding | 28 32 28 32 (konten maks lebar 1128 di canvas 1440) |
| Jarak vertikal antar section Main | 20 |
| Tinggi header halaman | 52 (judul + subjudul gap 4) |
| Tombol | tinggi 41 = border 1 + padding-y 11 + teks 17 ; padding-x 18 |
| Input/select/search | tinggi 44 ; padding-x 14 ; gap 10 |
| Field (label + input) | label 16 + gap 6 + input 44 = **66** |
| Nav item | tinggi 42 ; padding 11 12 ; gap 12 ; ikon 20 |
| Padding kartu | 20 (stat, grafik, aktivitas, filter bar 16) · 24 (form, profil, data, riwayat) |
| Header tabel | tinggi 40, padding 12 20, gap kolom 16 |
| Baris tabel | padding 13 20, gap 16, border-bottom 1 (baris terakhir tanpa border); tinggi efektif 50 (badge 23 + 26 + 1) |
| Grid form | kolom 3 × 346, gap kolom 20, gap baris 16 (1078 total) ; alamat penuh 1078 ; RT/RW/Dusun/Status 4 × 254.5 |

## 4. Kode siap pakai — `app/assets/css/main.css` (Tailwind v4)

```css
@import "tailwindcss";

@theme {
  /* Font */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Montserrat", "Inter", ui-sans-serif, system-ui, sans-serif;

  /* Warna */
  --color-brand-900: #2F4A27;
  --color-brand-700: #46663A;
  --color-brand-500: #557A45;
  --color-brand-100: #E3EBDA;
  --color-gold-500: #E2B23A;
  --color-page: #F5F6EF;
  --color-muted-bg: #EEF2E8;
  --color-selected-bg: #EEF3E8;
  --color-upload-bg: #F5F8F1;
  --color-line: #D8E0CF;
  --color-ink: #1E2F1A;
  --color-ink-muted: #5F6B58;
  --color-sidebar-text: #CBD5C0;
  --color-sidebar-subtext: #C3CEB7;
  --color-success-bg: #E3F4EC;
  --color-success-fg: #1F7A52;
  --color-warning-bg: #FBF1DB;
  --color-warning-fg: #8A6414;
  --color-neutral-bg: #EEF2E8;
  --color-neutral-fg: #4A5844;

  /* Radius */
  --radius-bar: 6px;
  --radius-control: 8px;
  --radius-chip: 10px;
  --radius-card: 12px;

  /* Skala font (line-height "auto" Figma = normal) */
  --text-11: 11px;  --text-11--line-height: normal;
  --text-12: 12px;  --text-12--line-height: normal;
  --text-13: 13px;  --text-13--line-height: normal;
  --text-14: 14px;  --text-14--line-height: normal;
  --text-15: 15px;  --text-15--line-height: 1.5;
  --text-16: 16px;  --text-16--line-height: normal;
  --text-20: 20px;  --text-20--line-height: normal;
  --text-26: 26px;  --text-26--line-height: normal;
  --text-30: 30px;  --text-30--line-height: normal;
  --text-34: 34px;  --text-34--line-height: normal;
  --text-46: 46px;  --text-46--line-height: 1.18;
}

@layer base {
  html, body { height: 100%; }
  body {
    background-color: var(--color-page);
    color: var(--color-ink);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

Contoh pemakaian kelas:
- H1: `text-26 font-bold text-ink`
- Tombol primer: `h-[41px] px-[18px] rounded-control border border-brand-500 bg-brand-500 text-14 font-semibold text-white`
- Kartu: `rounded-card border border-line bg-white p-5`
- Judul login: `font-display text-46 font-semibold tracking-[-0.01em] text-white`

> Jika proyek memakai Tailwind v3 (`@nuxtjs/tailwindcss`), pindahkan nilai yang sama ke `theme.extend` di `tailwind.config.ts`. **Nilainya tidak boleh berubah.**

## 5. Larangan token

- Jangan membuat warna "mirip" (mis. `#557A46`, `green-600` bawaan Tailwind).
- Jangan memakai kelas `shadow-*`, `bg-gradient-*`, `ring-*` (kecuali state fokus turunan di `03`).
- Jangan memakai `rounded-lg/xl` bawaan; pakai `rounded-control/chip/card/bar` atau `rounded-full`.
