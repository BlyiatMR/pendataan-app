<script setup lang="ts">
/**
 * StatCard — Stat/* 2:241 (docs/03 §5)
 * Kartu 267×153, padding 20, gap 12, vertikal
 */
interface Props {
  label: string
  value: string
  caption: string
  icon: string
}
defineProps<Props>()
</script>

<template>
  <AppCard :padding="5" class="flex flex-col gap-3">
    <!-- Top row: label + chip -->
    <div class="flex items-center gap-3">
      <span class="flex-1 text-13 font-medium text-ink-muted">{{ label }}</span>
      <IconChip :icon="icon" />
    </div>
    <!-- Nilai -->
    <p class="text-30 font-bold text-ink leading-normal">{{ value }}</p>
    <!-- Caption -->
    <p class="text-12 text-ink-muted">{{ caption }}</p>
  </AppCard>
</template>
