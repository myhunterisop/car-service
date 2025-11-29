<template>
  <header :class="[
    'header',
    { 'header--is-scrolled': isScrolled }
  ]">
    <div class="header__content container">
      <div class="logo">
        <h1>АвтоСервис</h1>
      </div>
      <Navigation />
      <ThemeSwitcher class="header__theme-switcher" />
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue';

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
  background: linear-gradient(-90deg, #116466,#006666,#025b67);
  backdrop-filter: blur(10px);
  
  background: rgba(225, 225, 225, 0.05);
  
  position: fixed;
  width: 100%;
  z-index: 1000;
  height: $header-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all ease-in-out .3s;
  box-shadow: 0px 0px 20px 2px rgba(49, 49, 49, 0.34);


  &--is-scrolled {
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    box-shadow: 10px 8px 10px 5px rgb(49 49 49 / 34%);
  }
  
  &__content {
    display: flex;
    align-items: center;
  }

  &__theme-switcher {
    margin-left: 20px;
  }
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #a5ecc7;
}
</style>