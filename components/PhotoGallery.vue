<template>
  <div class="photo-gallery">
    <Swiper
      v-if="mounted"
      :modules="modules"
      :slides-per-view="1"
      :space-between="30"
      :loop="true"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :navigation="true"
      :pagination="{ clickable: true }"
      :breakpoints="{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }"
      class="swiper-container"
    >
      <SwiperSlide
        v-for="(photo, index) in photos"
        :key="index"
        class="swiper-slide"
      >
        <div class="gallery-item">
          <!-- <img 
            :src="photo.src" 
            :alt="photo.alt"
            class="gallery__image"
            loading="lazy"
          > -->
          <NuxtImg
            :src="photo.src" 
            :alt="photo.alt"
            class="gallery__image"
            loading="lazy"
            quality="80"
            format="webp"
            width="260"
            height="195"
          />
          <div class="gallery__overlay">
            <h3 class="gallery__title">{{ photo.title }}</h3>
            <p class="gallery__description">{{ photo.description }}</p>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    <div v-else class="photo-gallery-loading">
      <p>Загрузка галереи...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Импорт стилей Swiper
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const modules = [Navigation, Pagination, Autoplay]
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})

// Массив фотографий из /public/images/
const photos = [
  {
    src: '/images/work1.jpg',
    alt: 'Ремонт двигателя',
    title: 'Ремонт двигателя',
    description: 'Капитальный ремонт двигателя'
  },
  {
    src: '/images/work2.jpg',
    alt: 'Замена тормозных колодок',
    title: 'Тормозная система',
    description: 'Замена тормозных колодок и дисков'
  },
  {
    src: '/images/work3.jpg',
    alt: 'Диагностика автомобиля',
    title: 'Компьютерная диагностика',
    description: 'Полная диагностика всех систем'
  },
  {
    src: '/images/work4.jpg',
    alt: 'Покраска кузова',
    title: 'Кузовной ремонт',
    description: 'Покраска и восстановление кузова'
  },
  {
    src: '/images/work5.jpg',
    alt: 'Замена масла',
    title: 'ТО автомобиля',
    description: 'Техническое обслуживание'
  },
  {
    src: '/images/work6.jpg',
    alt: 'Ремонт',
    title: 'Профессиональный ремонт',
    description: 'Качественный ремонт любой сложности'
  }
]
</script>

<style lang="scss" scoped>
.photo-gallery {
  margin: 2rem 0;
  width: 100%;

  // // Стили для навигации и пагинации Swiper
  // &:deep(.swiper-button-next),
  // &:deep(.swiper-button-prev) {
  //   color: #a5ecc7;
  //   background: rgba(1, 100, 102, 0.5);
  //   width: 44px;
  //   height: 44px;
  //   border-radius: 50%;
  //   backdrop-filter: blur(10px);
    
  //   &:after {
  //     font-size: 20px;
  //   }
    
  //   &:hover {
  //     background: rgba(1, 100, 102, 0.8);
  //   }
  // }

  // &:deep(.swiper-pagination-bullet) {
  //   background: #a5ecc7;
  //   opacity: 0.5;
    
  //   &-active {
  //     opacity: 1;
  //     background: #a5ecc7;
  //   }
  // }
}

.photo-gallery-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: $text-color;
  font-size: 1.1rem;
}

.swiper-container {
  width: 100%;
  padding-bottom: 50px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  aspect-ratio: 4 / 3;
  cursor: pointer;
}

.gallery__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.gallery-item:hover .gallery__image {
  transform: scale(1.1);
}

.gallery__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 1.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery__overlay {
  transform: translateY(0);
}

.gallery__title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.gallery__description {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.4;
}


// Адаптивность
@media (max-width: 768px) {
  .gallery__overlay {
    padding: 1rem;
    transform: translateY(0);
    background: rgba(0, 0, 0, 0.7);
  }
  
  .gallery__title {
    font-size: 1rem;
  }
  
  .gallery__description {
    font-size: 0.8rem;
  }
}
</style>