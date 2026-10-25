<script setup lang="ts">
/**
 * PageHeader — Header 2:234 (docs/03 §7)
 * Tinggi 52, flex, gap 14, items-center
 * Kiri: [BackButton] + Titles (H1 + subjudul)
 * Kanan: slot #actions
 */
interface Props {
  title: string
  subtitle?: string
  backTo?: string
}
defineProps<Props>()
</script>

<template>
  <div class="flex min-h-[52px] flex-col gap-3 sm:flex-row sm:items-center">
    <div class="flex min-w-0 flex-1 items-center gap-[14px]">
      <!-- BackButton — 40×40, bg white, border line, radius 8 -->
      <NuxtLink
        v-if="backTo"
        :to="backTo"
        class="flex size-[40px] shrink-0 items-center justify-center rounded-control border border-line bg-surface
               /* derived: tidak ada di Figma */
               hover:bg-muted-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        aria-label="Kembali"
      >
        <Icon name="lucide:arrow-left" class="size-[18px] text-brand-900" />
      </NuxtLink>

      <!-- Titles -->
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <h1 class="truncate text-26 font-bold leading-normal text-ink">{{ title }}</h1>
        <p v-if="subtitle" class="text-14 text-ink-muted">{{ subtitle }}</p>
      </div>
    </div>

    <!-- Actions slot (tombol, dll.) -->
    <div v-if="$slots.actions" class="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:gap-[14px]">
      <slot name="actions" />
    </div>
  </div>
</template>
