// composables/useAuth.ts — Auth nyata via API (Fase 7)
// Menggantikan mock Fase 1

export function useAuth() {
  const user = useState('auth-user', () => ({
    nama:    'Admin Desa',
    peran:   'Petugas Kantor',
    inisial: 'AD',
    authenticated: false,
  }))

  const loginError = ref('')

  async function login(username: string, password: string): Promise<boolean> {
    loginError.value = ''
    try {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      user.value = { nama: 'Admin Desa', peran: 'Petugas Kantor', inisial: 'AD', authenticated: true }
      return true
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } }
      loginError.value = e?.data?.message ?? 'Login gagal'
      return false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    user.value = { nama: 'Admin Desa', peran: 'Petugas Kantor', inisial: 'AD', authenticated: false }
    await navigateTo('/login')
  }

  async function checkAuth(): Promise<boolean> {
    try {
      const res = await $fetch<{ authenticated: boolean }>('/api/auth/me')
      user.value.authenticated = res.authenticated
      return res.authenticated
    } catch {
      return false
    }
  }

  return { user, login, logout, checkAuth, loginError }
}
