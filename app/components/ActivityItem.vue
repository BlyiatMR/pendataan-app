<script setup lang="ts">
/**
 * ActivityItem — 2:307 (docs/03 §11)
 * Flex, gap 12, items-center:
 * titik 10×10 brand-500 · teks (flex-1): judul 13/500 ink + subjudul 12/400 ink-muted · waktu 12/400 ink-muted
 */
interface Props {
  judul: string
  subjudul: string
  waktu: string
}
defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3">
    <!-- Titik -->
    <div class="size-[10px] shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
    <!-- Teks -->
    <div class="flex flex-1 flex-col gap-[2px]">
      <span class="text-13 font-medium text-ink">{{ judul }}</span>
      <span class="text-12 text-ink-muted">{{ subjudul }}</span>
    </div>
    <!-- Waktu -->
    <span class="shrink-0 text-12 text-ink-muted">{{ waktu }}</span>
  </div>
</template>
