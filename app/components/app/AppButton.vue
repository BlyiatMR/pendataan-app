<script setup lang="ts">
/**
 * AppButton — Button/Primary 2:139, Button/Secondary 2:141 (docs/03 §1)
 * Node Figma: primary=2:139, secondary=2:141
 */
interface Props {
  variant?: 'primary' | 'secondary'
  block?: boolean
  to?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})

const baseClass = [
  'inline-flex items-center justify-center',
  'h-[41px] px-[18px]',
  'rounded-control border',
  'whitespace-nowrap text-14 font-semibold',
  'cursor-pointer select-none',
  /* derived: tidak ada di Figma */
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'transition-colors',
].join(' ')

const variantClass = computed(() =>
  props.variant === 'primary'
    ? [
        'bg-brand-500 border-brand-500 text-white',
        /* derived: tidak ada di Figma */ 'hover:bg-brand-700 hover:border-brand-700',
      ].join(' ')
    : [
        'bg-surface border-line text-ink',
        /* derived: tidak ada di Figma */ 'hover:bg-muted-bg',
      ].join(' '),
)

const widthClass = computed(() => props.block ? 'w-full' : '')
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[baseClass, variantClass, widthClass]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="[baseClass, variantClass, widthClass]"
  >
    <slot />
  </button>
</template>
