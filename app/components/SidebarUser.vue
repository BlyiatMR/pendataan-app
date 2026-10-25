<script setup lang="ts">
/**
 * SidebarUser — Area user di bawah sidebar (docs/03 §6)
 * 216×56, padding 10 8, gap 10
 * Avatar 36 gold-500 "AD" + nama "Admin Desa" (13/600 white) / peran (11/400 sidebar-subtext)
 */
interface Props {
  nama?: string
  peran?: string
}
withDefaults(defineProps<Props>(), {
  nama: 'Admin Desa',
  peran: 'Petugas Kantor',
})
</script>

<template>
  <div class="flex items-center gap-[10px] px-2 py-[10px]">
    <AvatarInitials :nama="nama ?? 'Admin Desa'" :size="36" />
    <div class="flex flex-col gap-0">
      <span class="text-13 font-semibold text-white">{{ nama }}</span>
      <span class="text-11 text-sidebar-subtext">{{ peran }}</span>
    </div>
  </div>
</template>
