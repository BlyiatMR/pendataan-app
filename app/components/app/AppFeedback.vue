<script setup lang="ts">
defineProps<{ error?: string; pending?: boolean; empty?: boolean }>()
</script>

<template>
  <!-- Derived states, docs/03 §17. Tidak menambah toast atau warna baru. -->
  <p v-if="error" role="alert" class="text-12 text-warning-fg">{{ error }}</p>
  <p v-else-if="pending" role="status" class="text-13 text-ink-muted">Memuat data…</p>
  <p v-else-if="empty" role="status" class="text-13 text-ink-muted">Tidak ada data.</p>
</template>
