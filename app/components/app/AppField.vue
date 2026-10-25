<script setup lang="ts">
/**
 * AppField — Field/Input 2:143, Field/Select 2:147, Field/Search 2:153 (docs/03 §2)
 * Struktur vertikal gap 6: Label (13/500 ink) + kotak (h-44, border line, radius 8, px-14)
 *
 * Komponen gabungan: prop `type` menentukan varian (input/select/search)
 */
interface SelectOption {
  value: string
  label: string
}

interface Props {
  label?: string
  required?: boolean
  placeholder?: string
  modelValue?: string
  type?: 'text' | 'password' | 'number' | 'select' | 'search'
  options?: SelectOption[]
  hideLabel?: boolean
  id?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  hideLabel: false,
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [v: string] }>()

// ID unik jika tidak diberikan
const uid = useId()
const fieldId = computed(() => props.id ?? `field-${uid}`)

const boxClass = [
  'flex h-[44px] w-full items-center gap-[10px]',
  'rounded-control border border-line bg-surface px-[14px]',
  'text-14 text-ink',
  /* derived: tidak ada di Figma */
  'focus-within:border-brand-500',
  'transition-colors',
].join(' ')

const inputClass = 'flex-1 bg-transparent outline-none placeholder:text-ink-muted disabled:cursor-not-allowed'
</script>

<template>
  <div class="flex w-full flex-col gap-[6px]">
    <!-- Label -->
    <label
      v-if="!hideLabel && label"
      :for="fieldId"
      class="text-13 font-medium text-ink"
    >
      {{ label }}<span v-if="required" class="text-ink"> *</span>
    </label>

    <!-- Input -->
    <div v-if="type !== 'select' && type !== 'search'" :class="[boxClass, error ? 'border-warning-fg' : '']">
      <input
        :id="fieldId"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :aria-label="hideLabel ? label || placeholder : undefined"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${fieldId}-error` : undefined"
        :class="inputClass"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Search -->
    <div v-else-if="type === 'search'" :class="[boxClass, error ? 'border-warning-fg' : '']">
      <Icon name="lucide:search" class="size-[18px] shrink-0 text-ink-muted" />
      <input
        :id="fieldId"
        type="search"
        :aria-label="hideLabel ? label || placeholder : undefined"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${fieldId}-error` : undefined"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        :class="inputClass"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <!-- Select -->
    <div v-else :class="[boxClass, 'relative', error ? 'border-warning-fg' : '']">
      <select
        :required="required"
        :aria-label="hideLabel ? label || placeholder : undefined"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${fieldId}-error` : undefined"
        :id="fieldId"
        :value="modelValue"
        :disabled="disabled"
        class="flex-1 appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
        :class="modelValue ? 'text-ink' : 'text-ink-muted'"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-if="placeholder && !options?.some(o => o.value === '')" value="">{{ placeholder }}</option>
        <option
          v-for="opt in options"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>
      <Icon name="lucide:chevron-down" class="pointer-events-none size-[18px] shrink-0 text-ink-muted" />
    </div>

    <!-- Error message — derived: tidak ada di Figma ([ASUMSI] docs/03 §17) -->
    <p v-if="error" :id="`${fieldId}-error`" class="text-12 text-warning-fg">{{ error }}</p>
  </div>
</template>
