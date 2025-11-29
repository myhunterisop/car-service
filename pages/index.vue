<template>
  <div>
    <section id="hero" ref="heroSection" class="section section--hero hero">
      <div class="hero__inner">
        <div class="hero__text">
          <p class="hero__eyebrow">Премиальный сервис</p>
          <h1>
            Drag &amp; Drive
            <span>технологичный автосервис</span>
          </h1>
          <p class="hero__lead">
            Сочетаем точную диагностику, инженерный подход и визуальный контроль за работами.
            Перетащи карточки, чтобы увидеть наши компетенции.
          </p>
          <div class="hero__cta">
            <a href="#contacts" class="hero__button">Записаться</a>
          </div>
        </div>

        <div
          class="hero-drag"
          ref="dragSurface"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        >
          <div class="hero-drag__track" ref="dragTrack">
            <article
              v-for="(card, index) in heroGallery"
              :key="card.id"
              class="hero-card"
              :style="{ backgroundImage: `url(${card.src})` }"
            >
              <div class="hero-card__overlay">
                <p class="hero-card__label">{{ card.label }}</p>
                <h2>{{ card.title }}</h2>
                <span>{{ card.meta }}</span>
              </div>
              <span class="hero-card__index">0{{ index + 1 }}</span>
            </article>
          </div>
          <div class="hero-drag__indicator">
            <span>Прокрутите вниз</span>
            <span class="hero-drag__dot"></span>
          </div>
        </div>
        <div class="indicator">
            <div class="pointer">
							☟
						</div>
          </div>
      </div>
    </section>

    <!-- <section id="hero" class="section section--hero">
      412421
    </section> -->

    <section id="gallery" class="section section--gallery">
      <div class="container">
        <h2 class="section-title">Наши работы</h2>
        <PhotoGallery />
      </div>
      <Carousel size="70" speed="0.2" />
    </section>

    <section id="contacts" class="section section--map">
      <div class="container">
        <h2 class="section-title">Как нас найти</h2>
        <YandexMap />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const heroSection = ref(null)
const dragSurface = ref(null)
const dragTrack = ref(null)

const dragging = ref(false)
// let pointerStartX = 0
// let pointerStartProgress = 0
let scrollTriggerInstance = null
let ctx = null
let ScrollTriggerRef = null

const heroGallery = [
  {
    id: 1,
    src: '/images/work1.jpg',
    label: 'Диагностика',
    title: 'Компьютерный контроль',
    meta: 'Ford / Focus'
  },
  {
    id: 2,
    src: '/images/work2.jpg',
    label: 'Тормозная система',
    title: 'Силовая безопасность',
    meta: 'Audi / Q7'
  },
  {
    id: 3,
    src: '/images/work3.jpg',
    label: 'Кузовной ремонт',
    title: 'Восстановление геометрии',
    meta: 'BMW / 5 series'
  },
  {
    id: 4,
    src: '/images/work4.jpg',
    label: 'Покраска',
    title: 'Мультислойные покрытия',
    meta: 'Mercedes / E-class'
  },
  {
    id: 5,
    src: '/images/work5.jpg',
    label: 'Техническое обслуживание',
    title: 'Сервисные интервалы',
    meta: 'Toyota / Camry'
  },
  {
    id: 6,
    src: '/images/work6.jpg',
    label: 'Двигатель',
    title: 'Наддув и впуск',
    meta: 'VW / Arteon'
  }
]

// const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

const handleResize = () => {
  scrollTriggerInstance?.refresh()
}

onMounted(async () => {
  if (!heroSection.value) {
    return
  }

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  ScrollTriggerRef = ScrollTrigger

  ctx = gsap.context(() => {
    const trackTween = gsap.to(dragTrack.value, {
      x: () => {
        const surface = dragSurface.value
        const track = dragTrack.value
        if (!surface || !track) {
          return 0
        }
        const distance = track.scrollWidth - surface.offsetWidth
        return distance > 0 ? -distance : 0
      },
      ease: 'none'
    })

    scrollTriggerInstance = ScrollTrigger.create({
      trigger: heroSection.value,
      start: 'top top',
      end: '+=220%',
      pin: true,
      scrub: true,
      animation: trackTween,
      anticipatePin: 1
    })

    gsap
      .timeline({
        scrollTrigger: {
          trigger: heroSection.value,
          start: 'top top',
          end: '+=60%',
          scrub: true
        }
      })
      .from('.hero__eyebrow', { yPercent: 60, opacity: 0 }, 0)
      .from('.hero__text h1', { yPercent: 35, opacity: 0 }, 0.1)
      .from('.hero__lead', { yPercent: 25, opacity: 0 }, 0.2)
      .from('.hero__cta', { yPercent: 20, opacity: 0 }, 0.3)

    ScrollTrigger.addEventListener('refreshInit', handleResize)
  }, heroSection)
})

onBeforeUnmount(() => {
  ScrollTriggerRef?.removeEventListener('refreshInit', handleResize)
  scrollTriggerInstance?.kill()
  ctx?.revert()
})

const moveToProgress = (progress) => {
  if (!scrollTriggerInstance) {
    return
  }
  const distance = scrollTriggerInstance.end - scrollTriggerInstance.start
  const scrollPos = scrollTriggerInstance.start + progress * distance
  scrollTriggerInstance.scroll(scrollPos)
}

// const onPointerDown = (event) => {
//   if (!scrollTriggerInstance) {
//     return
//   }
//   dragging.value = true
//   pointerStartX = event.clientX
//   pointerStartProgress = scrollTriggerInstance.progress
//   dragSurface.value?.setPointerCapture?.(event.pointerId)
// }

// const onPointerMove = (event) => {
//   if (!dragging.value || !scrollTriggerInstance) {
//     return
//   }
//   const delta = (pointerStartX - event.clientX) / window.innerWidth
//   const nextProgress = clamp(pointerStartProgress + delta * 1.5)
//   moveToProgress(nextProgress)
// }

const onPointerUp = (event) => {
  if (!dragging.value) {
    return
  }
  dragging.value = false
  dragSurface.value?.releasePointerCapture?.(event.pointerId)
}

useHead({
  title: 'АвтоСервис - Профессиональный ремонт автомобилей',
  meta: [
    {
      name: 'description',
      content:
        'Профессиональный автосервис с полным спектром услуг по ремонту и обслуживанию автомобилей'
    },
    { property: 'og:title', content: 'Автосервис' },
    { property: 'og:description', content: 'Описание для соцсетей' },
    { property: 'og:image', content: '/images/preview.jpg' }
  ]
})
</script>

<style scoped lang="scss">
.hero {
  background: #04070b;
  color: #f9f9f7;
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  padding: 0;

  &__inner {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: clamp(40px, 6vw, 120px);
    width: 100%;
    padding: 80px;
    padding-top: calc($header-height + 50px);
  }

  &__text {
    max-width: 520px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }

  &__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.35em;
    font-size: 0.85rem;
    color: rgba(149, 236, 199, 0.7);
  }

  h1 {
    font-size: clamp(2.5rem, 4vw, 4.5rem);
    line-height: 1;

    span {
      display: block;
      font-size: clamp(1.25rem, 2vw, 1.8rem);
      margin-top: 1rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }
  }

  &__lead {
    font-size: 1.1rem;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.75);
  }

  &__cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;
  }

  &__button {
    padding: 1rem 2.5rem;
    border-radius: 999px;
    background: linear-gradient(110deg, #22d1ad, #67f7c8);
    color: #041516;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-decoration: none;
    transition: transform 0.25s ease;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.hero-drag {
  position: relative;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: radial-gradient(
      circle at top,
      rgba(149, 236, 199, 0.08),
      rgba(0, 0, 0, 0)
    ),
    rgba(4, 11, 16, 0.75);
  // cursor: grab;
  user-select: none;

  &:active {
    // cursor: grabbing;
  }

  &__track {
    display: flex;
    gap: clamp(20px, 3vw, 40px);
    padding: clamp(30px, 4vw, 60px);
    transform: translateZ(0);
  }

  &__indicator {
    position: absolute;
    bottom: 24px;
    right: 32px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.35);
    font-size: 0.85rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.7);

    .hero-drag__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22d1ad;
      animation: pulse 1.4s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.25);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

.hero-card {
  flex: 0 0 clamp(220px, 18vw, 320px);
  aspect-ratio: 4 / 5;
  border-radius: 28px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 1.5rem;
  color: #fff;
  pointer-events: none;


  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.85));
  }

  &__overlay {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  &__label {
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.65);
  }

  h3 {
    font-size: 1.4rem;
    margin: 0;
  }

  span {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.65);
  }

  &__index {
    position: relative;
    z-index: 2;
    font-size: 1.1rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.4);
  }
}

@media (max-width: 1024px) {
  .hero {
    &__inner {
      grid-template-columns: 1fr;
    }

    &__cta {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;

    &__inner {
      padding: 40px 20px;
      gap: 32px;
    }
  }

  .hero-drag {
    border-radius: 24px;

    &__track {
      padding: 24px;
    }
  }
}

.indicator {
  position: absolute;
  top: 90vh;
  left: 50%;
  transform: translateY(-100%);
  font-size: clamp(48px, 5.5vw, 129px);
}

.pointer {
		animation: pointDown 2.5s infinite;
	}
	
	@keyframes pointDown {
		0% {
			transform: translateY(0);
		}
		10% {
			transform: translateY(20px);
		}
		20% {
			transform: translateY(0);
		}
		30% {
			transform: translateY(20px);
		}
		40% {
			transform: translateY(0);
		}
	}
</style>
