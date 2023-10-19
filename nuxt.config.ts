// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  css: ['@/assets/css/main.css'],
  image: {
    domains: [process.env.APP_URL || 'http://localhost:3000']
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@bg-dev/nuxt-naiveui',
    '@pinia/nuxt',
    "@nuxt/image"
  ],
  typescript: {
    typeCheck: true,
    strict: true,
  },
  runtimeConfig: {
    public: {
      appName: process.env.APP_NAME || 'Cardápio.Ninja',
      appNameNormalized: process.env.APP_NAME_NORMALIZED || 'Cardapio.Ninja',
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      serverUrl: process.env.SERVER_URL || 'https://minhaloji.rangelpereira.com/',
      apiUrl: process.env.API_URL || 'https://minhaloji.rangelpereira.com/api/',
    },
  },
  app: {
    head: {
      title: 'Cardápio.ninja',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'pt-br',
      },
      meta: [
        { name: 'language', content: 'pt-br' },
        { 'http-equiv': 'Content-Type', charset: 'utf-8' },
        { name: 'robots', content: 'index, follow' },
        { name: 'description', content: 'Descubra como é simples criar seu cardápio online: cadastro, personalização e compartilhamento com seu público. Tudo em apenas alguns passos.' },
        { name: 'keywords', content: 'Cardápio Digital, Cardápio Online, Digitalização de Cardápio, Cardápio no WhatsApp, Cardápio Gratuito, Pedidos pelo WhatsApp' },
      ]
    },
    pageTransition: {
      name: 'page', mode: 'out-in'
    }
  },
  imports: {
    dirs: [
      'services'
    ]
  },
  routeRules: {
    '/': { ssr: true },
    '/app': { redirect: '/app/minha-area' },
  },
})