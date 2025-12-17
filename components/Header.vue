<template>
  <header :class="[
    'header',
    { 'header--is-scrolled': isScrolled }
  ]">
    <div class="header__content container">
      <h1 class="logo">АвтоСервис</h1>
      <Navigation class="header__navigation"/>
      <ThemeSwitcher class="header__theme-switcher" v-model="themeStore.isChecked" />
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()

const isScrolled = ref(true);

function handleScroll() {
  const scrollY = window.scrollY || document.documentElement.scrollTop;

  isScrolled.value = scrollY > 0;
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});
</script>

<style lang="scss">
.header {
  background-color: #116466;
  background-color: #025b67;
  background-color: #006666;
  // background: linear-gradient(-90deg, #116466,#006666,#025b67);
  background-color: #131b1b;
  backdrop-filter: blur(10px);
  
  // background: rgba(225, 225, 225, 0.05);
  
  position: fixed;
  width: 100%;
  z-index: 1000;
  min-height: $header-height;
  padding-top: $gutter * 2;
  padding-bottom: $gutter * 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ease-in-out .3s;
  box-shadow: 0px 5px 20px 0px rgba(49, 49, 49, 0.34);


  &--is-scrolled {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 10px 8px 10px 5px rgb(49 49 49 / 34%);
  }
  
  &__content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    row-gap: $gutter;
    column-gap: $gutter * 3;
  }

  &__theme-switcher {
    margin-left: 20px;

    @media (max-width: $tablet) {
      margin-left: auto;
    }
  }

  &__navigation {
    @media (max-width: $tablet) {
      width: 100%;
    }
  }
}

.logo {
  margin-right: auto;

  @media (max-width: $tablet) {
    margin-left: auto;
  }
}

.logo {
  font-size: $font-size * 2;
  // color: #a5ecc7;
  color: $navigation-color;
  user-select: none;
}
</style>