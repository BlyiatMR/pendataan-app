<script setup lang="ts">
/**
 * KeyValue — 2:763 (stacked), 2:751 (inline) (docs/03 §12)
 *
 * stacked: label 12/400 ink-muted di atas nilai 14/500 ink, gap 4
 * inline:  label 13/400 ink-muted kiri, nilai 13/500 ink kanan, justify-between
 */
interface Props {
  label: string
  value: string
  layout?: 'stacked' | 'inline'
}
const props = withDefaults(defineProps<Props>(), { layout: 'stacked' })
</script>

<template>
  <!-- Stacked -->
  <div v-if="layout === 'stacked'" class="flex flex-col gap-1">
    <span class="text-12 text-ink-muted">{{ label }}</span>
    <span class="text-14 font-medium text-ink">{{ value }}</span>
  </div>

  <!-- Inline -->
  <div v-else class="flex min-h-4 items-center justify-between gap-4">
    <span class="text-13 text-ink-muted">{{ label }}</span>
    <span class="text-13 font-medium text-ink">{{ value }}</span>
  </div>
</template>
