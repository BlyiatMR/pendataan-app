/**
 * icons.ts — Satu-satunya tempat mapping nama ikon Lucide (docs/03 §0)
 * Gunakan konstanta ini di komponen; JANGAN hardcode nama ikon di template.
 *
 * Verifikasi: semua ikon sudah dikonfirmasi cocok dengan bentuk di Figma
 * (stroke 2px, tanpa fill) → Lucide memakai gaya yang sama.
 */

export const ICONS = {
  /** Navigasi sidebar */
  home:           'lucide:house',          // 2:203
  users:          'lucide:users',          // 2:207 / 2:245
  clipboardList:  'lucide:clipboard-list', // 2:213
  fileText:       'lucide:file-text',      // 2:218 / 2:255
  logOut:         'lucide:log-out',        // 2:230
  bookOpen:       'lucide:book-open',
  clock:          'lucide:clock-3',
  sun:            'lucide:sun',
  moon:           'lucide:moon',

  /** Stat chips */
  heart:          'lucide:heart',          // 2:264
  triangleAlert:  'lucide:triangle-alert', // 2:272
  calendar:       'lucide:calendar',       // 2:866
  pencil:         'lucide:pencil',         // 2:413 / 2:1185

  /** Aksi tabel */
  eye:            'lucide:eye',            // 2:410

  /** Navigasi dalam halaman */
  arrowLeft:      'lucide:arrow-left',     // 2:603

  /** Form */
  upload:         'lucide:upload',         // 2:1098
  chevronDown:    'lucide:chevron-down',   // 2:147
  search:         'lucide:search',         // 2:153
} as const

export type IconKey = keyof typeof ICONS
