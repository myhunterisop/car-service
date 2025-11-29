<template>
  <nav class="navigation">
    <ul class="navigation__list">
      <li
        v-for="(item, index) in data"
        :key="index"
        class="navigation__item"
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
  margin-left: auto;

  &__list {
    display: flex;
    column-gap: 20px;
  }

  &__item {
    list-style-type: none;
  }
  
  &__link {
    color: #a5ecc7;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: color.adjust(#a5ecc7, $lightness: -20%);
    }
  }
}
</style>