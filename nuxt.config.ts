export default defineNuxtConfig({
  devtools: { enabled: true },
  
  runtimeConfig: {
    public: {
      // Значение подтягивается из .env переменной NUXT_PUBLIC_YANDEX_MAPS_API_KEY
      yandexMapsApiKey: ''
    }
  },
  
  modules: ['@pinia/nuxt', '@nuxtjs/sitemap', '@nuxt/image'],
  sitemap: {
    hostname: 'https://your-domain.com',
  },
  css: [
    '~/assets/scss/main.scss',
    '~/assets/scss/_variables.scss',
  ],
  image: {
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      title: 'Автосервис - Профессиональный ремонт автомобилей',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Профессиональный автосервис с полным спектром услуг по ремонту и обслуживанию автомобилей' }
      ],
      script: []
    }
  },
  
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
  }
})