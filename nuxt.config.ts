import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  ssr: false,
  compatibilityDate: 'latest',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/fonts'],
  css: ['~/assets/css/main.css'],
  vite: { plugins: [tailwindcss()] },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700] },
      { name: 'Montserrat', provider: 'google', weights: [600] },
    ],
  },
  icon: { serverBundle: 'local' },
  app: {
    pageTransition: { name: 'dissolve', mode: 'out-in' },
    layoutTransition: { name: 'dissolve', mode: 'out-in' },
    head: {
      title: 'SI Pendataan Warga — Desa Sunggumanai',
      htmlAttrs: { lang: 'id' },
      link: [{ rel: 'icon', type: 'image/png', href: '/image.png' }],
    },
  },
  typescript: { strict: true },
})
