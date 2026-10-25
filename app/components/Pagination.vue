<script setup lang="ts">
/**
 * Pagination — 2:548 (docs/03 §9)
 * Flex, gap 6, h-36, items-center
 * Teks kiri: "Menampilkan 1–6 dari 1.248 warga" (en dash)
 * Tombol halaman 36×36 radius 8
 */
interface Props {
  total: number
  perPage?: number
  currentPage?: number
  entityLabel?: string // "warga"
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  perPage: 6,
  currentPage: 1,
  entityLabel: 'warga',
})

const emit = defineEmits<{ 'update:currentPage': [p: number] }>()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))
const from = computed(() => props.total === 0 ? 0 : (props.currentPage - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.currentPage * props.perPage, props.total))

// Format angka id-ID (titik ribuan)
const fmt = (n: number) => n.toLocaleString('id-ID')

/** Daftar tombol halaman: 1 2 3 … N (maks 4 di tengah) */
const pages = computed<(number | '…')[]>(() => {
  const n = totalPages.value
  if (n <= 5) return Array.from({ length: n }, (_, i) => i + 1)
  const cur = props.currentPage
  const visible = [...new Set([1, n, ...(cur <= 3 ? [1, 2, 3] : [cur - 1, cur, cur + 1])])]
    .filter(p => p >= 1 && p <= n).sort((a, b) => a - b)
  const result: (number | '…')[] = []
  for (const p of visible) {
    const previous = result[result.length - 1]
    if (typeof previous === 'number' && p - previous > 1) result.push('…')
    result.push(p)
  }
  return result
})
</script>

<template>
  <div class="flex h-[36px] items-center gap-[6px]">
    <!-- Teks kiri -->
    <span class="flex-1 text-13 text-ink-muted">
      Menampilkan {{ fmt(from) }}–{{ fmt(to) }} dari {{ fmt(total) }} {{ entityLabel }}
    </span>

    <!-- Tombol halaman -->
    <template v-for="(p, i) in pages" :key="i">
      <span
        v-if="p === '…'"
        class="flex size-[36px] items-center justify-center text-13 text-ink-muted"
      >…</span>
      <button
        v-else
        :aria-label="`Halaman ${p}`"
        :disabled="disabled"
        :aria-current="p === currentPage ? 'page' : undefined"
        class="flex size-[36px] items-center justify-center rounded-control border text-13 font-medium
               /* derived: tidak ada di Figma */
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
               transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :class="p === currentPage
          ? 'bg-brand-500 border-brand-500 text-white'
           : 'bg-surface border-line text-ink hover:bg-muted-bg'"
        @click="emit('update:currentPage', p as number)"
      >
        {{ p }}
      </button>
    </template>
  </div>
</template>
