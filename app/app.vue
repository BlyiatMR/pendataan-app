<script setup lang="ts">
const { initTheme } = useTheme()
initTheme()
</script>

<template>
  <div
    id="theme-transition-overlay"
    class="theme-transition-overlay"
    aria-hidden="true"
  />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
