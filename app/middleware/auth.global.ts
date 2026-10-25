// middleware/auth.global.ts — Guard sesi (Fase 7, client-side, ssr: false)
// Cek sekali saja per sesi — tidak perlu ping /api/auth/me tiap navigasi

export default defineNuxtRouteMiddleware(async (to) => {
  // Route publik — tidak perlu auth
  const publicRoutes = ['/login', '/']
  if (publicRoutes.includes(to.path)) return

  const { user, checkAuth } = useAuth()

  // Sudah terautentikasi dalam sesi ini — langsung lanjut
  if (user.value.authenticated) return

  // Belum ada data session — cek ke server sekali
  const ok = await checkAuth()
  if (!ok) return navigateTo('/login', { replace: true })
})
