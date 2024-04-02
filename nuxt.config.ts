// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    port: 8000
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ]
})
