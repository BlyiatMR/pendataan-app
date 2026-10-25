<script setup lang="ts">
/**
 * BarChart — 2:280 (docs/03 §10)
 * 6 kolom bar, bar 48px lebar, gap kolom 36, area tinggi 190
 * tinggi batang = nilai × 36px
 * Batang terakhir (bulan berjalan) = gold-500
 */
interface DataItem {
  label: string
  value: number
}

interface Props {
  data: DataItem[]
  highlightLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  highlightLast: true,
})
// Tetap 36px/unit untuk contoh desain; skala turun bila data nyata melebihi area.
const unitHeight = computed(() => Math.min(36, 144 / Math.max(4, ...props.data.map(item => item.value))))
</script>

<template>
  <!-- Area chart 484px, menyusut secara proporsional di viewport kecil -->
  <div class="flex h-[190px] w-full max-w-[484px] items-end justify-between gap-2 px-2">
    <div
      v-for="(item, i) in data"
      :key="item.label"
      class="flex min-w-0 flex-1 flex-col items-center gap-2"
    >
      <!-- Nilai -->
      <span class="text-12 font-semibold text-ink-muted">{{ item.value }}</span>
      <!-- Batang -->
      <div
        class="w-full max-w-[48px] rounded-bar"
        :class="(props.highlightLast && i === data.length - 1) ? 'bg-gold-500' : 'bg-brand-500'"
        :style="{ height: `${item.value * unitHeight}px` }"
      />
      <!-- Bulan -->
      <span class="text-12 text-ink-muted">{{ item.label }}</span>
    </div>
  </div>
</template>
