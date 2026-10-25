<script setup lang="ts">
/**
 * AppSidebar — Sidebar utama 2:194 (docs/03 §6, docs/06 §4)
 * fixed inset-y-0 left-0 w-[248px] bg-brand-900
 * padding 24 16, gap 4, flex-col
 */
import { ICONS } from '~/utils/icons'

const route = useRoute()
const router = useRouter()

interface Props {
  mobileOpen?: boolean
}
withDefaults(defineProps<Props>(), { mobileOpen: false })
const emit = defineEmits<{ close: [] }>()

// Tentukan nav aktif berdasarkan prefix route
const isActive = (prefix: string) => route.path.startsWith(prefix)

const navItems = [
  { label: 'Dashboard',         icon: ICONS.home,          to: '/dashboard',          prefix: '/dashboard' },
  { label: 'Data Warga',        icon: ICONS.users,         to: '/data-warga',         prefix: '/data-warga' },
  { label: 'Catatan Kematian',  icon: ICONS.clipboardList, to: '/catatan-kematian',   prefix: '/catatan-kematian' },
  { label: 'Laporan',           icon: ICONS.fileText,      to: '/laporan',            prefix: '/laporan' },
  { label: 'Panduan Admin',     icon: ICONS.bookOpen,      to: '/panduan-admin',      prefix: '/panduan-admin' },
]

function handleKeluar() {
  router.push('/login')
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[calc(100vw-24px)] flex-col bg-brand-900 px-4 pb-6 pt-5
           transition-transform duration-300 lg:w-[248px] lg:translate-x-0 lg:pt-6"
    :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >

    <!-- 1. Brand -->
    <div class="flex items-center gap-3 px-2 py-1">
      <img
        src="/image.png"
        alt="Logo Kabupaten Gowa"
        class="size-[40px] shrink-0 object-contain"
      />
      <div class="flex flex-col gap-[1px]">
        <span class="font-display text-14 font-semibold text-white leading-normal">Pendataan Warga</span>
        <span class="text-12 text-sidebar-subtext">Desa Sunggumanai</span>
      </div>
      <button
        type="button"
        class="ml-auto flex size-[36px] items-center justify-center rounded-control text-sidebar-text lg:hidden
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        aria-label="Tutup menu navigasi"
        @click="emit('close')"
      >
        <Icon name="lucide:x" class="size-[20px]" />
      </button>
    </div>

    <!-- 2. Spacer -->
    <div class="h-5" />

    <!-- 3. Nav utama -->
    <nav class="flex flex-col gap-1 overflow-y-auto" @click="emit('close')">
      <SidebarNavItem
        v-for="item in navItems"
        :key="item.to"
        :icon="item.icon"
        :label="item.label"
        :to="item.to"
        :active="isActive(item.prefix)"
      />
    </nav>

    <!-- 4. Flex spacer -->
    <div class="flex-1" />

    <!-- 5. Switch tema -->
    <ThemeToggle variant="sidebar" class="mb-3" />

    <!-- 6. Waktu WITA -->
    <WitaClock />

    <!-- 7. User -->
    <SidebarUser />

    <!-- 8. Keluar -->
    <SidebarNavItem
      :icon="ICONS.logOut"
      label="Keluar"
      @click="handleKeluar"
    />
  </aside>
</template>
