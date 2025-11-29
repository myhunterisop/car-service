<template>
  <div class="ad-banner" :class="{ 'ad-banner--visible': isVisible }">
    <div class="ad-banner__content">
      <!-- <img 
        :src="currentBanner.image" 
        :alt="currentBanner.alt"
        class="ad-banner__image"
      > -->
      <NuxtImg
        :src="currentBanner.image" 
        :alt="currentBanner.alt"
        class="ad-banner__image"
        loading="lazy"
        quality="20"
        format="webp"
        width="280"
        height="212"
        sizes="100vw sm:50vw md:100vw"
      />
      <p class="ad-banner__text">
        {{ currentBanner.alt }}
      </p>
      <button 
        @click="closeBanner" 
        class="ad-banner__close"
        aria-label="Закрыть баннер"
      >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentBannerIndex = ref(0)

// Массив баннеров для ротации
const banners = [
  {
    image: '/images/banner1.jpg',
    alt: 'Скидка 20% на диагностику'
  },
  {
    image: '/images/banner2.jpg', 
    alt: 'Замена масла со скидкой'
  },
  {
    image: '/images/banner3.jpg',
    alt: 'Шиномонтаж круглосуточно'
  }
]

const currentBanner = computed(() => banners[currentBannerIndex.value])

let bannerInterval = null

const isVisible = ref(false)
const isClosed = ref(false)

const showBanner = () => {
  if (!isClosed.value) {
    isVisible.value = true
  }
}

const closeBanner = () => {
  isVisible.value = false
  isClosed.value = true
}

const rotateBanner = () => {
  currentBannerIndex.value = (currentBannerIndex.value + 1) % banners.length
}

onMounted(() => {
  // Показываем баннер через 5 секунд
  setTimeout(showBanner, 5000)

  // Меняем баннер каждые 10 секунд
  bannerInterval = setInterval(() => {
    if (!isClosed.value) {
      rotateBanner()
      showBanner()
    }
  }, 10000)
})


onUnmounted(() => {
  if (bannerInterval) {
    clearInterval(bannerInterval)
  }
})
</script>

<style lang="scss" scoped>
.ad-banner {
  $self: &;

  position: fixed;
  bottom: 100px;
  width: 280px;
  z-index: 9999;
  transition: right 0.5s ease-in-out;

  &:not(#{$self}--visible) {
    right: -280px;
  }
  
  &--visible {
    right: 20px;
  }
  
  &__content {
    position: relative;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }

  &__text {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 24px;
    text-align: center;
    font-weight: bold;
  }
  
  &__image {
    width: 100%;
    height: auto;
    display: block;
  }
  
  // &__close {
  //   position: absolute;
  //   z-index: 20;
  //   top: 10px;
  //   right: 10px;
  //   background: rgba(0, 0, 0, 0.7);
  //   color: white;
  //   border: none;
  //   border-radius: 50%;
  //   width: 30px;
  //   height: 30px;
  //   font-size: 18px;
  //   cursor: pointer;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   transition: background 0.3s;
    
  //   &:hover {
  //     background: rgba(0, 0, 0, 0.9);
  //   }
  // }

  &__close {
    position: absolute;
    z-index: 100;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    color: #1a1a1a;
    // background: #ed1c5b;
    background: #BFE756;
    border-radius: 50%;
    border: none;
    transition: box-shadow 200ms cubic-bezier(.2,0,.7,1), transform 200ms cubic-bezier(.2,0,.7,1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover{
        transform: rotate(180deg);
        box-shadow: 0 0 1px 7px rgba(#bee75673, 0.4),
        0 0 1px 13px rgba(#bee75673, 0.1),
    }
  }
}

@media (max-width: 768px) {
  .ad-banner {
    width: 250px;
    
    &--visible {
      right: 10px;
    }
  }
}
</style>
