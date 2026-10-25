<script setup lang="ts">
/**
 * UploadDropzone — 2:1097 (docs/03 §15)
 * h-107, bg upload-bg, border 1px dashed brand-500, radius 10, padding 20
 * Kolom rata tengah, gap 6: ikon upload 22 + judul + hint
 * Seluruh area klik membuka file picker (accept .pdf,.jpg,.jpeg, maks 2 MB)
 */
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
defineProps<{ fileName?: string }>()

const emit = defineEmits<{
  'file-selected': [file: File]
  'error': [msg: string]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

function openPicker() {
  inputRef.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!/\.(pdf|jpe?g)$/i.test(file.name) || !['application/pdf', 'image/jpeg'].includes(file.type)) {
    emit('error', 'Berkas harus PDF atau JPG.')
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  if (file.size > MAX_SIZE || file.size === 0) {
    emit('error', 'Ukuran file melebihi 2 MB.')
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  emit('file-selected', file)
}
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="flex h-[107px] cursor-pointer flex-col items-center justify-center gap-[6px]
           rounded-chip border border-dashed border-brand-500 bg-upload-bg px-5
           /* derived: tidak ada di Figma */
           focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
    aria-label="Unggah surat keterangan kematian"
    @click="openPicker"
    @keydown.enter.prevent="openPicker"
    @keydown.space.prevent="openPicker"
  >
    <Icon name="lucide:upload" class="size-[22px] text-brand-500" />
    <span class="text-13 font-semibold text-ink">Unggah surat keterangan kematian</span>
    <span class="text-12 text-ink-muted">{{ fileName || 'PDF atau JPG, maksimal 2 MB' }}</span>
  </div>
  <!-- Hidden input -->
  <input
    ref="inputRef"
    type="file"
    accept=".pdf,.jpg,.jpeg"
    class="hidden"
    @change="onFileChange"
  />
</template>
