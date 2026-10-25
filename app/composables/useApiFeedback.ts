export function useApiFeedback() {
  const { user } = useAuth()
  const router = useRouter()
  const busy = ref(false)
  const error = ref('')
  const errors = ref<Record<string, string>>({})

  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    if (busy.value) return
    busy.value = true
    error.value = ''
    errors.value = {}
    try {
      return await action()
    } catch (cause) {
      const e = cause as { statusCode?: number; data?: { message?: string; data?: { field?: string } } }
      error.value = e.data?.message || 'Permintaan gagal. Silakan coba lagi.'
      if (e.data?.data?.field) errors.value[e.data.data.field] = error.value
      if (e.statusCode === 401) {
        user.value.authenticated = false
        await router.replace('/login')
      }
    } finally {
      busy.value = false
    }
  }
  return { busy, error, errors, run }
}
