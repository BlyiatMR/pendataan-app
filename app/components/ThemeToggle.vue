<script setup lang="ts">
import { ICONS } from '~/utils/icons'

interface Props {
  variant?: 'surface' | 'sidebar'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'surface',
})

const { isDark, toggleTheme } = useTheme()

const isSidebar = computed(() => props.variant === 'sidebar')
const label = computed(() => isDark.value ? 'Tema terang' : 'Tema gelap')
const icon = computed(() => isDark.value ? ICONS.sun : ICONS.moon)

function handleToggle(event: MouseEvent) {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  toggleTheme({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  })
}
</script>

<template>
  <button
    type="button"
    :aria-label="`Aktifkan ${label.toLowerCase()}`"
    :aria-pressed="isDark"
    :title="`Aktifkan ${label.toLowerCase()}`"
    class="group flex h-[42px] items-center gap-3 rounded-control border px-3 text-left
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
           transition-colors"
    :class="isSidebar
      ? 'w-full border-white/[0.12] bg-white/[0.06] text-sidebar-text hover:bg-white/[0.12]'
      : 'border-line bg-surface text-ink hover:bg-muted-bg'"
    @click="handleToggle"
  >
    <Icon
      :name="icon"
      class="theme-toggle-icon size-[18px] shrink-0 transition-transform duration-200"
      :class="isDark ? 'rotate-90' : 'rotate-0'"
    />
    <span class="flex-1 text-13 font-medium">{{ label }}</span>
    <span
      class="relative flex h-[22px] w-[40px] shrink-0 items-center rounded-full border p-[2px]"
      :class="isSidebar
        ? 'border-white/[0.16] bg-white/[0.10]'
        : 'border-line bg-muted-bg'"
      aria-hidden="true"
    >
      <span
        class="theme-toggle-thumb size-[16px] rounded-full border"
        :class="[
          isDark ? 'translate-x-[16px]' : 'translate-x-0',
          isSidebar ? 'border-white/[0.18] bg-gold-500' : 'border-line bg-surface',
        ]"
      />
    </span>
  </button>
</template>
