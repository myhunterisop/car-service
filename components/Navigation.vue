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
        >
          {{ item.name }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
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
  if (typeof window === 'undefined') {
    return
  }

  const target = document.querySelector(hash)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
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

    
    &:hover {
      // padding: $gutter;
      // border: 1px solid red;
      // border-radius: 50%;
      color: color.adjust($navigation-color, $lightness: 60%);
    }
  }
}
</style>