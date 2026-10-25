<script setup lang="ts">
/**
 * IconChip — chip ikon 36×36 (docs/03 §5, bagian dari StatCard)
 * bg brand-100, radius 10, ikon 18 brand-500
 */
interface Props {
  icon: string
}
defineProps<Props>()
</script>

<template>
  <div class="flex size-[36px] shrink-0 items-center justify-center rounded-chip bg-brand-100">
    <Icon :name="icon" class="size-[18px] text-brand-500" />
  </div>
</template>
