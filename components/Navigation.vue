<template>
  <nav class="navigation">
    <ul class="navigation__list">
      <li
        v-for="(item, index) in data"
        :key="index"
      >
        <a
          @click.prevent="onClick(item.link)"
          :href="item.link"
          class="navigation__link"
          :class="{ 'is-active': activeHash === item.link }"
          :aria-current="activeHash === item.link ? 'page' : undefined"
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const activeHash = ref(null)
const HEADER_OFFSET = 80 // высота фиксированного хедера в px
let observer = null
let isProgrammaticScroll = false

const data = [
  {
    name: 'Главная',
    link: '#hero'
  },
  {
    name: 'Наши работы',
    link: '#gallery'
  },
  {
    name: 'Контакты',
    link: '#contacts'
  }
]

function onClick(hash) {
  const target = document.querySelector(hash)
  if (!target) return

  isProgrammaticScroll = true

  const top =
    target.getBoundingClientRect().top +
    window.scrollY -
    HEADER_OFFSET

  window.scrollTo({
    top,
    behavior: 'smooth'
  })

  activeHash.value = hash

  // даём скроллу закончиться
  setTimeout(() => {
    isProgrammaticScroll = false
  }, 500)
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (isProgrammaticScroll) return

      const visible = entries
        .filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visible) {
        activeHash.value = `#${visible.target.id}`
      }
    },
    {
      root: null,
      threshold: [0.4, 0.6],
      rootMargin: `-${HEADER_OFFSET}px 0px 0px 0px`
    }
  )

  data.forEach(item => {
    const section = document.querySelector(item.link)
    if (section) observer.observe(section)
  })

  // ⬇️ синхронизация при прямом заходе по URL
  if (location.hash) {
    setTimeout(() => onClick(location.hash), 0)
  }
})

watch(activeHash, (hash) => {
  if (!hash) return

  history.replaceState(null, '', hash)
})

</script>

<style scoped lang="scss">
@use 'sass:color';

.navigation {
  &__list {
    display: flex;
    column-gap: $gutter * 2;

    @media (max-width: $tablet) {
      justify-content: space-evenly;
    }
  }
  
  &__link {
    font-size: $font-size;
    color: $navigation-color;
    transition: color 0.3s ease-in-out;
    // text-wrap: balance;
    user-select: none;

    &[aria-current="page"] {
      color: color.adjust($navigation-color, $lightness: 60%);
    }

    
    // &:hover,
    // &.is-active {
    //   // padding: $gutter;
    //   // border: 1px solid red;
    //   // border-radius: 50%;
    //   color: color.adjust($navigation-color, $lightness: 60%);
    // }

    // &.is-active {
    //   color: color.adjust($navigation-color, $lightness: 60%);
    // }

    // &:not(.is-active):hover {
    //   color: color.adjust($navigation-color, $lightness: 60%);
    // }
  }
}
</style>