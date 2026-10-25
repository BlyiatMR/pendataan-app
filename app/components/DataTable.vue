<script setup lang="ts">
/**
 * DataTable — Tabel data generik (docs/03 §8)
 * Wadah: rounded-card border border-line bg-surface overflow-hidden
 * Kolom dikonfigurasi lewat prop columns (CSS grid template)
 *
 * Slot per kolom: #header-{key} dan #cell-{key}
 */
interface Column {
  key: string
  label: string
}

interface Props {
  columns: Column[]
  rows: Record<string, unknown>[]
  gridTemplate: string // CSS grid-template-columns value
}

defineProps<Props>()
</script>

<template>
  <div class="overflow-x-auto rounded-card border border-line bg-surface">
    <div class="min-w-[820px] overflow-hidden">
      <!-- Header -->
      <div
        class="grid h-[40px] items-center gap-4 bg-muted-bg px-5"
        :style="{ gridTemplateColumns: gridTemplate }"
      >
        <template v-for="col in columns" :key="col.key">
          <slot :name="`header-${col.key}`">
            <span class="truncate text-13 font-semibold text-ink-muted">{{ col.label }}</span>
          </slot>
        </template>
      </div>

      <!-- Baris -->
      <div
        v-for="(row, i) in rows"
        :key="i"
        class="grid items-center gap-4 px-5 py-[13px]"
        :class="i < rows.length - 1 ? 'border-b border-line' : ''"
        :style="{ gridTemplateColumns: gridTemplate }"
      >
        <template v-for="col in columns" :key="col.key">
          <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]" :index="i">
            <span class="truncate text-13 text-ink">{{ row[col.key] as string }}</span>
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>
