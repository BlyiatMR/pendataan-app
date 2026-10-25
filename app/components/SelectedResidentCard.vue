<script setup lang="ts">
/**
 * SelectedResidentCard — 2:1058 (docs/03 §14)
 * Flex, gap 14, padding 14, h-74, bg selected-bg, border line, radius 10, items-center
 * Avatar 44 · teks (flex-1) · Badge success "Dipilih"
 */
interface Props {
  nama: string
  nik: string
  rt: number | string
  rw: number | string
}
defineProps<Props>()

</script>

<template>
  <div class="flex h-[74px] items-center gap-[14px] rounded-chip border border-line bg-selected-bg px-[14px]">
    <!-- Avatar -->
    <AvatarInitials :nama="nama" :size="44" />
    <!-- Teks -->
    <div class="flex flex-1 flex-col gap-[2px]">
      <span class="text-14 font-semibold text-ink">{{ nama }}</span>
      <span class="text-12 text-ink-muted">
        NIK {{ nik }} • RT {{ String(rt).padStart(2, '0') }} / RW {{ String(rw).padStart(2, '0') }}
      </span>
    </div>
    <!-- Badge -->
    <AppBadge variant="success">Dipilih</AppBadge>
  </div>
</template>
