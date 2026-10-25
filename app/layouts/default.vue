<script setup lang="ts">
const sidebarOpen = ref(false)
</script>

<template>
  <!--
    layouts/default.vue — Layout utama dengan Sidebar (docs/04 §02–08, docs/06 §4)
    Figma: sidebar 248px fixed kiri, main geser ml-[248px], padding 28 32
  -->
  <div class="min-h-screen overflow-x-hidden bg-page">
    <AppSidebar :mobile-open="sidebarOpen" @close="sidebarOpen = false" />

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-brand-900/[0.38] lg:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />

    <div class="fixed inset-x-0 top-0 z-30 flex h-[60px] items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
      <button
        type="button"
        class="flex size-[40px] items-center justify-center rounded-control border border-line text-ink
               focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        aria-label="Buka menu navigasi"
        @click="sidebarOpen = true"
      >
        <Icon name="lucide:menu" class="size-[20px]" />
      </button>
      <div class="flex min-w-0 items-center gap-2">
        <img src="/image.png" alt="Logo Kabupaten Gowa" class="size-[30px] shrink-0 object-contain" />
        <span class="truncate font-display text-14 font-semibold text-ink">Pendataan Warga</span>
      </div>
      <ThemeToggle aria-label="Ganti tema" />
    </div>

    <main class="flex min-h-screen flex-col gap-5 px-4 pb-6 pt-[76px] sm:px-6 lg:ml-[248px] lg:px-8 lg:py-7">
      <slot />
    </main>
  </div>
</template>
