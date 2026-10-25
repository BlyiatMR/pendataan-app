<script setup lang="ts">
/**
 * AppCheckbox — Checkbox login (docs/03 §16)
 * 18×18, bg white, border 1 line, radius 4; label 13/400 ink-muted (gap 8)
 */
interface Props {
  label?: string
  modelValue?: boolean
  id?: string
}
const props = withDefaults(defineProps<Props>(), {
  label: '',
  modelValue: false,
  id: 'checkbox',
})
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()
</script>

<template>
  <label
    :for="id"
    class="flex cursor-pointer items-center gap-2"
  >
    <input
      :id="id"
      type="checkbox"
      :checked="modelValue"
      class="size-[18px] shrink-0 cursor-pointer rounded-[4px] border border-line bg-surface accent-brand-500
             /* derived: tidak ada di Figma */
             focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span v-if="label" class="text-13 text-ink-muted">{{ label }}</span>
  </label>
</template>
