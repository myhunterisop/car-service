<template>
  <div class="layout">
    <Header />
    <main class="main">
      <slot />
    </main>
    <Footer />
    <AdBanner />
    <SpeedInsights/>
  </div>
</template>

<script setup>
  import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>
