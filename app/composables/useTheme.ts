import { gsap } from 'gsap'

const THEME_STORAGE_KEY = 'sunggumanai-theme'

export function useTheme() {
  const isDark = useState('theme-is-dark', () => false)
  const initialized = useState('theme-initialized', () => false)

  function syncTheme() {
    if (!import.meta.client) return

    const root = document.documentElement
    root.classList.toggle('dark', isDark.value)
    root.style.colorScheme = isDark.value ? 'dark' : 'light'
  }

  function initTheme() {
    if (!import.meta.client || initialized.value) return

    isDark.value = window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark'
    initialized.value = true
    syncTheme()
  }

  function toggleTheme(origin?: { x: number; y: number }) {
    if (!import.meta.client) return

    const nextIsDark = !isDark.value
    const overlay = document.getElementById('theme-transition-overlay')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Mencegah klik berulang mengacaukan animasi radial yang sedang berjalan.
    if (overlay && gsap.isTweening(overlay)) return

    isDark.value = nextIsDark
    window.localStorage.setItem(THEME_STORAGE_KEY, nextIsDark ? 'dark' : 'light')

    if (!overlay || reducedMotion) {
      syncTheme()
      if (overlay) overlay.style.display = 'none'
      return
    }

    const x = origin?.x ?? window.innerWidth / 2
    const y = origin?.y ?? window.innerHeight / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )
    const targetPageColor = getComputedStyle(document.documentElement)
      .getPropertyValue(nextIsDark ? '--theme-page-dark' : '--theme-page-light')
      .trim()

    // Overlay memakai warna tema tujuan dan menutup layar lama dengan radial reveal.
    gsap.set(overlay, {
      display: 'block',
      opacity: 1,
      backgroundColor: targetPageColor,
      clipPath: `circle(0px at ${x}px ${y}px)`,
    })

    gsap.to(overlay, {
      clipPath: `circle(${radius}px at ${x}px ${y}px)`,
      duration: 0.58,
      ease: 'power3.inOut',
      onComplete: () => {
        syncTheme()
        gsap.set(overlay, {
          display: 'none',
          clearProps: 'clipPath,backgroundColor,opacity',
        })
      },
    })
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
  }
}
