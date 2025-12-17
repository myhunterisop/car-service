<template>
  <input
    type="checkbox"
    name="theme-switcher"
    v-model="isChecked"
    aria-label="Переключатель темы"
    :class="[
      'theme-switcher',
      {'theme-switcher--is-checked': isChecked } 
    ]"
  >
</template>

<script setup>
// import { onMounted, ref } from 'vue';
import { ref } from 'vue';

const isChecked = ref(false);

// function getTime() {
//   const date = new Date();
//   const clientLocalTime = date.toLocaleTimeString();

//   console.log(clientLocalTime)

//   if (clientLocalTime) {
//     isChecked.value = true
//   } else {
//     isChecked.value = false
//   }
// }

// onMounted(() => {
//   getTime();
// });
</script>

<style scoped lang="scss">
.theme-switcher {
  position: relative;
  width: 45px;
  height: 24px;
  margin-right: 10px;
  outline: none;
  background: #111;
  -webkit-appearance: none;
  cursor: pointer;
  border-radius: 20px;
  box-shadow: -5px -5px 20px rgba(255, 255, 255, 0.1),
    inset -2px -2px 5px rgba(255, 255, 255, 0.1),
    inset 0px 0px 5px rgba(0, 0, 0, 1);
  transition: 0.5s;

  &:before {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: linear-gradient(to top, #333, #00000073);
    border-radius: 50%;
    box-shadow: 0 0 0 1px #444;
    transform: scale(0.98, 0.96);
    transition: 0.5s;
  }

  &--is-checked {
    &:checked {
      background: #006666;

      &:before {
        left: 23px;
      }
    }

    .main {
      background: red;
    }
  }
}
</style>