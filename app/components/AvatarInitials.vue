<script setup lang="ts">
/**
 * AvatarInitials — Avatar inisial (docs/03 §13)
 * Lingkaran dengan inisial dua kata pertama nama.
 *
 * | Konteks       | Ukuran | bg         | Teks          |
 * | Sidebar       | 36     | gold-500   | 12/700 ink    |
 * | Warga terpilih| 44     | brand-100  | 14/700 brand-700 |
 * | Profil detail | 104    | brand-100  | 34/700 brand-700 |
 */
import { inisial } from '~/utils/format'

interface Props {
  nama: string
  size: 36 | 44 | 104
}
defineProps<Props>()

const sizeClass: Record<number, string> = {
  36:  'size-[36px]  text-12 font-bold text-ink bg-gold-500',
  44:  'size-[44px]  text-14 font-bold text-brand-700 bg-brand-100',
  104: 'size-[104px] text-34 font-bold text-brand-700 bg-brand-100',
}
</script>

<template>
  <div
    :class="[
      'flex shrink-0 items-center justify-center rounded-full',
      sizeClass[size],
    ]"
    aria-hidden="true"
  >
    {{ inisial(nama) }}
  </div>
</template>
