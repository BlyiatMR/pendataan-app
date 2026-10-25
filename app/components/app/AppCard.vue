<script setup lang="ts">
/**
 * AppCard — Kartu dasar (docs/03 §4)
 * rounded-card border border-line bg-surface + padding via prop
 * padding: 4=16px, 5=20px, 6=24px
 */
interface Props {
  padding?: 4 | 5 | 6
  overflow?: boolean // overflow-hidden untuk tabel
}
const props = withDefaults(defineProps<Props>(), {
  padding: 5,
  overflow: false,
})

const paddingClass = computed(() => ({
  4: 'p-4',
  5: 'p-5',
  6: 'p-6',
}[props.padding]))
</script>

<template>
  <div
    :class="[
      'rounded-card border border-line bg-surface',
      paddingClass,
      overflow ? 'overflow-hidden !p-0' : '',
    ]"
  >
    <slot />
  </div>
</template>
