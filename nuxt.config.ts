import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  devtools: { enabled: true },
  
  runtimeConfig: {
    public: {
      yandexMapsApiKey: ''
    }
  },
  modules: ['@pinia/nuxt', '@nuxtjs/sitemap', '@nuxt/image'],
  sitemap: {
    hostname: 'https://your-domain.com',
    routes: [
      '/',
    ],
    exclude: ['/admin/**', '/private/**'],
    defaults: {
      changefreq: 'weekly',
      priority: 1.0,
      lastmod: new Date().toISOString()
    }
  },
  robots: {
    UserAgent: '*',
    Allow: '/',
    Disallow: ['/admin', '/private'],
    Sitemap: 'https://your-domain.com/sitemap.xml'
  },
  css: [
    '~/assets/scss/main.scss',
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1' },
        { name: 'description', content: 'Профессиональный автосервис с полным спектром услуг по ремонту и обслуживанию автомобилей' }
      ],
      script: []
    },
    baseURL: process.env.NODE_ENV === 'production' ? '/auto-service/' : '/',
  },
  
  nitro: {
    compatibilityDate: '2025-12-16'
  },
  vite: {
    server: {
      hmr: { port: 0 }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '~/assets/scss/variables' as *;`
        }
      }
    }
  }
} as any)