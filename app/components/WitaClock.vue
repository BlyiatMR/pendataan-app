<script setup lang="ts">
import { ICONS } from '~/utils/icons'

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | undefined

const time = computed(() => new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Makassar',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}).format(now.value).replace(/\./g, ':'))

const date = computed(() => new Intl.DateTimeFormat('id-ID', {
  timeZone: 'Asia/Makassar',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
}).format(now.value))

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div
    class="mx-2 mb-3 flex items-center gap-2 rounded-control border border-white/[0.12] bg-white/[0.06] px-3 py-2"
    aria-label="Waktu Indonesia Tengah"
  >
    <Icon :name="ICONS.clock" class="size-[18px] shrink-0 text-sidebar-text" />
    <div class="flex min-w-0 flex-col gap-[1px]">
      <span class="text-11 text-sidebar-subtext">{{ date }}</span>
      <span class="text-13 font-semibold text-white">{{ time }} WITA</span>
    </div>
  </div>
</template>
