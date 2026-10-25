<script setup lang="ts">
/**
 * AppBadge — Badge/Success 2:160, Warning 2:162, Neutral 2:164 (docs/03 §3)
 * Pil: rounded-full px-[10px] py-[4px] text-12 font-medium (tinggi 23)
 */
interface Props {
  variant: 'success' | 'warning' | 'neutral'
}
defineProps<Props>()

const variantClass: Record<string, string> = {
  success: 'bg-success-bg text-success-fg',
  warning: 'bg-warning-bg text-warning-fg',
  neutral: 'bg-neutral-bg text-neutral-fg',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full px-[10px] py-[4px]',
      'text-12 font-medium',
      variantClass[variant],
    ]"
  >
    <slot />
  </span>
</template>
