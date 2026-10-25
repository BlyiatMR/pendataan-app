<script setup lang="ts">
/**
 * SidebarNavItem — Nav item sidebar (docs/03 §6)
 * Tinggi 42, padding 11 12, gap 12, radius 8, ikon 20
 * Aktif: bg brand-500, teks white 14/600, ikon white. aria-current="page"
 * Tidak aktif: tanpa bg, teks sidebar-text 14/500, ikon sidebar-text
 */
interface Props {
  icon: string
  label: string
  to?: string
  active?: boolean
}
const props = withDefaults(defineProps<Props>(), { active: false })

const emit = defineEmits<{ click: [] }>()
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :aria-current="active ? 'page' : undefined"
    class="flex h-[42px] items-center gap-3 rounded-control px-3 transition-colors
           /* derived: tidak ada di Figma */"
    :class="active
      ? 'bg-brand-500 text-white'
      : 'text-sidebar-text hover:bg-white/[0.08]'"
  >
    <Icon :name="icon" class="size-[20px] shrink-0" />
    <span
      class="text-14 leading-normal"
      :class="active ? 'font-semibold' : 'font-medium'"
    >{{ label }}</span>
  </NuxtLink>

  <!-- Tombol tanpa navigasi (Keluar) -->
  <button
    v-else
    class="flex h-[42px] w-full items-center gap-3 rounded-control px-3 text-left
           text-sidebar-text transition-colors
           hover:bg-white/[0.08]
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    @click="emit('click')"
  >
    <Icon :name="icon" class="size-[20px] shrink-0" />
    <span class="text-14 font-medium">{{ label }}</span>
  </button>
</template>
