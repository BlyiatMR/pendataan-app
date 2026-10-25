<template>
  <!--
    layouts/auth.vue — Layout dua panel layar 01 Login (docs/04 §01, docs/06 §4)
    Figma: 2:166 — grid grid-cols-2, min-h-screen
    Panel kiri bg-brand-500 (720×900), panel kanan transparan (tampil page)
  -->
  <div class="grid min-h-screen grid-cols-1 bg-page lg:grid-cols-2">
    <slot />
  </div>
</template>
