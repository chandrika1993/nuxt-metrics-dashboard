export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  typescript: {
    strict: true,
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Engineering Metrics Dashboard',
      meta: [
        { name: 'description', content: 'Delivery health across teams and repositories.' },
      ],
    },
  },
})
