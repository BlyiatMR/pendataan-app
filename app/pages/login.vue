<script setup lang="ts">
/**
 * Layar 01 — Login · route /login · layout auth
 * Figma: mockup 2:166 · prototype 3:1415
 * docs/04 §01
 */
definePageMeta({ layout: 'auth' })

const { login, loginError } = useAuth()
const router = useRouter()

const username  = ref('')
const password  = ref('')
const ingatSaya = ref(false)
const loading   = ref(false)

// Validasi client-side sederhana
const formError = ref('')

async function handleMasuk() {
  formError.value = ''
  if (!username.value.trim()) { formError.value = 'Username wajib diisi'; return }
  if (!password.value)        { formError.value = 'Password wajib diisi'; return }

  loading.value = true
  try {
    const ok = await login(username.value.trim(), password.value)
    if (ok) router.push('/dashboard')
    else formError.value = loginError.value || 'Username atau password salah'
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <!--
    Panel kiri — Brand panel (720×900)
    bg brand-500, padding 72, flex-col, justify-between, gap 20
  -->
  <div class="flex min-h-[280px] flex-col justify-between gap-5 bg-brand-500 p-8 sm:min-h-[360px] sm:p-12 lg:min-h-screen lg:p-[72px]">
    <!-- Logo Kab. Gowa 104×104 -->
    <img
      src="/image.png"
      alt="Logo Kabupaten Gowa"
      class="size-[104px] object-contain"
    />

    <!-- Judul sistem -->
    <h1
      class="font-display text-34 font-semibold text-white sm:text-46"
      style="line-height: 1.18; letter-spacing: -0.01em; max-width: 560px;"
    >
      Sistem Pendataan Warga Desa Sunggumanai
    </h1>

    <!-- Footer -->
    <p class="text-15 text-white/[0.88]" style="line-height: 1.5;">
      Kantor Desa Sunggumanai<br />
      Kabupaten Gowa, Sulawesi Selatan
    </p>
  </div>

  <!--
    Panel kanan — Form panel (720×900)
    Tanpa background sendiri (tampil page dari layout)
    flex col, items-center justify-center, gap 24
  -->
  <div class="relative flex min-h-[620px] flex-col items-center justify-center gap-6 px-4 pb-8 pt-20 sm:px-8 lg:min-h-screen lg:px-0 lg:py-0">
    <ThemeToggle class="absolute right-4 top-4 sm:right-8 sm:top-8" />
    <!--
      Login card 420×489
      radius 12, padding 36, gap 18
      TANPA fill, border, atau shadow (docs/09 #2)
    -->
    <div
      class="flex w-full max-w-[420px] flex-col gap-[18px] rounded-card p-6 sm:p-9"
      style="min-height: 489px;"
    >
      <!-- "Masuk" — Montserrat 30/600 ink -->
      <h2 class="font-display text-30 font-semibold text-ink leading-normal">
        Masuk
      </h2>

      <!-- Subtitle -->
      <p class="text-14 text-ink-muted leading-normal">
        Gunakan akun petugas desa untuk melanjutkan.
      </p>

      <!-- Field Username -->
      <AppField
        id="username"
        v-model="username"
        label="Username"
        placeholder="Masukkan username"
        type="text"
      />

      <!-- Field Password -->
      <AppField
        id="password"
        v-model="password"
        label="Password"
        placeholder="••••••••"
        type="password"
      />

      <!-- Pesan error login (Fase 7) — turunan warning-fg (docs/09 B1) -->
      <p v-if="formError" class="text-13 font-medium text-warning-fg">
        {{ formError }}
      </p>

      <!--
        Row tinggi 100px — quirk desain, pertahankan (docs/04 §01)
        flex items-center gap-2: Checkbox + "Ingat saya" (kiri) · "Lupa password?" (kanan)
      -->
      <div class="flex h-[100px] items-center gap-2">
        <AppCheckbox
          id="ingat-saya"
          v-model="ingatSaya"
          label="Ingat saya"
        />
        <!-- "Lupa password?" — hanya teks, tanpa aksi (docs/01 §5) -->
        <a
          href="#"
          class="ml-auto text-13 font-semibold text-brand-700
                 /* derived: tidak ada di Figma */
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          @click.prevent
        >
          Lupa password?
        </a>
      </div>

      <!-- Tombol Masuk (primary, block) -->
      <AppButton
        variant="primary"
        :block="true"
        type="submit"
        :disabled="loading"
        @click="handleMasuk"
      >
        {{ loading ? 'Memuat…' : 'Masuk' }}
      </AppButton>
    </div>

    <!-- Copyright di bawah kartu -->
    <p class="text-12 text-ink-muted">
      © 2026 Pemerintah Desa Sunggumanai
    </p>
  </div>
</template>
