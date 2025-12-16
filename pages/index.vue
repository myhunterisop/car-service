<template>
  <div>
    <section id="hero" class="section section--hero hero">
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
        >
          <div class="hero-drag__track" ref="dragTrack">
            <div class="hero-drag__slides">
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
          </div>

          <div class="hero-drag__indicator" role="status" aria-label="Инструкция по прокрутке">
            <span>Листайте вбок</span>
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
        <ClientOnly>
          <YandexMap />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const dragSurface = ref(null)
const dragTrack = ref(null)

// drag-to-scroll state
let isDragging = false
let dragStartX = 0
let dragStartScroll = 0

// momentum state
let momentumId = null
let lastVel = 0
let prevScroll = 0
let prevTime = 0
let lastTimestamp = null

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


onMounted(() => {
  if (!dragTrack.value || !dragSurface.value) return

  // pointer drag handlers
  const onPointerDown = (e) => {
    // cancel momentum if active
    if (momentumId) {
      cancelAnimationFrame(momentumId)
      momentumId = null
    }

    isDragging = true
    dragStartX = e.clientX
    dragStartScroll = dragTrack.value.scrollLeft
    dragSurface.value.classList.add('dragging')

    // init velocity tracking
    prevScroll = dragTrack.value.scrollLeft
    prevTime = performance.now()
    lastVel = 0

    dragTrack.value.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!isDragging) return
    const dx = e.clientX - dragStartX
    dragTrack.value.scrollLeft = dragStartScroll - dx

    // velocity estimation (pixels per ms)
    const now = performance.now()
    const dt = now - prevTime
    if (dt > 0) {
      lastVel = (dragTrack.value.scrollLeft - prevScroll) / dt
      prevScroll = dragTrack.value.scrollLeft
      prevTime = now
    }

    e.preventDefault()
  }

  const onPointerUp = (e) => {
    if (!isDragging) return
    isDragging = false
    dragSurface.value.classList.remove('dragging')
    dragTrack.value.releasePointerCapture?.(e.pointerId)

    // start momentum if velocity is significant
    const threshold = 0.02 // px per ms
    if (Math.abs(lastVel) > threshold) {
      lastTimestamp = null
      const friction = 0.005 // friction coefficient, tweakable

      const step = (ts) => {
        if (!lastTimestamp) lastTimestamp = ts
        const dt = ts - lastTimestamp
        lastTimestamp = ts

        // update scroll
        dragTrack.value.scrollLeft += lastVel * dt

        // apply exponential decay
        lastVel = lastVel * Math.exp(-friction * dt)

        // stop if velocity very small or reached edges
        const maxScroll = dragTrack.value.scrollWidth - dragTrack.value.clientWidth
        if (Math.abs(lastVel) < 0.01 || dragTrack.value.scrollLeft <= 0 && lastVel < 0 || dragTrack.value.scrollLeft >= maxScroll && lastVel > 0) {
          momentumId = null
          return
        }

        momentumId = requestAnimationFrame(step)
      }

      momentumId = requestAnimationFrame(step)
    }
  }

  dragTrack.value.addEventListener('pointerdown', onPointerDown, { passive: true })
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)

  dragTrack.value._onPointerDown = onPointerDown
  dragTrack.value._onPointerMove = onPointerMove
  dragTrack.value._onPointerUp = onPointerUp
})

onBeforeUnmount(() => {
  // cleanup pointer handlers
  const down = dragTrack.value?._onPointerDown
  const move = dragTrack.value?._onPointerMove
  const up = dragTrack.value?._onPointerUp
  if (down) dragTrack.value.removeEventListener('pointerdown', down)
  if (move) window.removeEventListener('pointermove', move)
  if (up) {
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
})


useHead({
  title: 'АвтоСервис - Профессиональный ремонт автомобилей',
  meta: [
    {
      name: 'description',
      content:
        'Профессиональный автосервис с полным спектром услуг по ремонту и обслуживанию автомобилей'
    },
    { property: 'og:title', content: 'Автосервис у Васи на Химиков' },
    { property: 'og:description', content: 'Саня Пантюхин - внатури чоткий механ!' },
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


  &__track {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    transform: translateZ(0);
    touch-action: pan-y;
    cursor: grab;
  }

  .hero-drag.dragging {
    cursor: grabbing;
    user-select: none;
  }

  &__slides {
    display: flex;
    gap: clamp(20px, 3vw, 40px);
    padding: clamp(30px, 4vw, 60px);
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
  pointer-events: auto;



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
