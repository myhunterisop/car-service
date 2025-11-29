<template>
  <div
    class="carousel"
    @mouseenter="pause"
    @mouseleave="resume"
    @mousedown.prevent="dragStart"
    @touchstart.passive="touchStart"
    :aria-label="ariaLabel"
  >
    <div class="carousel__viewport">
      <div class="carousel__fade carousel__fade--left" v-if="fade"></div>
      <div class="carousel__fade carousel__fade--right" v-if="fade"></div>

      <div
        class="carousel__track"
        ref="t1"
      >
        <div
          v-for="(l, i) in logos"
          :key="'a' + i"
          class="carousel__logo"
        >
          <!-- <img
            :src="`/images/car-logo/${l}`"
            :style="{ height: size + 'px' }"
            :alt="l.slice(0, -4)"
            loading="lazy"
          /> -->
          <NuxtImg
            :src="`/images/car-logo/${l}`"
            :alt="l.slice(0, -4)"
            loading="lazy"
            width="70"
            height="70"
          />
        </div>
      </div>

      <div
        class="carousel__track"
        ref="t2"
      >
        <div
          v-for="(l, i) in logos"
          :key="'b' + i"
          class="carousel__logo"
        >
          <NuxtImg
            :src="`/images/car-logo/${l}`"
            :alt="l.slice(0, -4)"
            loading="lazy"
            width="70"
            height="70"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  speed: {
    type: [Number, String],
    default: 0.45
  },
  pause: {
    type: Boolean,
    default: false,
  },
  size: {
    type: [Number, String],
    default: 56
  },
  direction: {
    type: String,
    default: 'left'
  },
  fade: {
    type: Boolean,
    default: true
  },
  inertiaStrength: {
    type: Number,
    default: 0.92
  },
  ariaLabel: {
    type: String,
    default: 'Логотипы марок автомобилей'
  }
});

const emit = defineEmits(['scrollStart', 'scrollEnd', 'paused', 'resumed']);

const t1 = ref(null);
const t2 = ref(null);

let t1Pos = 0, t2Pos = 0, raf;
let dragging = false, pointerX = 0, velocity = 0, lastTime = 0, paused = false;

const logos = [
  "bmw.svg",
  "audi.svg",
  "mercedes.svg",
  "volkswagen.svg",
  "ford.svg",
  "nissan.svg",
  "honda.svg",
  "hyundai.svg",
  "mazda.svg",
  "volvo.svg",
  "lada.svg",
  "kia.svg",
  "skoda.svg",
  "opel.svg",
  "chevrolet.svg",
  "suzuki.svg",
  "renault.svg",
  "mitsubishi.svg",
]

function signDir() { return props.direction === 'left' ? -1 : 1; }

function dragStart(e) {
  dragging = true;
  pointerX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
  velocity = 0; lastTime = performance.now();
  emit('scrollStart');
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerEnd);
}

function touchStart(e) {
  dragging = true;
  pointerX = e.touches[0].clientX;
  velocity = 0; lastTime = performance.now();
  emit('scrollStart');
  window.addEventListener('touchmove', touchMove, { passive: false });
  window.addEventListener('touchend', pointerEnd);
}

function pointerMove(e) {
  if (!dragging) return;
  const x = e.clientX;
  const dx = x - pointerX;
  pointerX = x;
  const now = performance.now();
  velocity = dx / Math.max(1, now - lastTime);
  lastTime = now;
  t1Pos += dx;
  t2Pos += dx;
}

function touchMove(e) {
  if (!dragging) return;
  e.preventDefault();
  const x = e.touches[0].clientX;
  const dx = x - pointerX;
  pointerX = x;
  const now = performance.now();
  velocity = dx / Math.max(1, now - lastTime);
  lastTime = now;
  t1Pos += dx;
  t2Pos += dx;
}

function pointerEnd() {
  dragging = false;
  window.removeEventListener('mousemove', pointerMove);
  window.removeEventListener('mouseup', pointerEnd);
  window.removeEventListener('touchmove', touchMove);
  window.removeEventListener('touchend', pointerEnd);
  applyInertia();
  emit('scrollEnd');
}

function applyInertia() {
  function step() {
    if (Math.abs(velocity) < 0.0006) return;
    t1Pos += velocity * 26;
    t2Pos += velocity * 26;
    velocity *= props.inertiaStrength;
    normalize();
    raf = requestAnimationFrame(step);
  }
  raf = requestAnimationFrame(step);
}

function normalize() {
  const width = t1.value?.offsetWidth || 1;
  if (t1Pos <= -width) t1Pos = t2Pos + width;
  if (t2Pos <= -width) t2Pos = t1Pos + width;
  if (t1Pos >= width) t1Pos = t2Pos - width;
  if (t2Pos >= width) t2Pos = t1Pos - width;
}

function pause() { paused = true; emit('paused'); }
function resume() { paused = false; emit('resumed'); }

function loop() {
  if (!dragging && !paused && !props.pause) {
    const dir = signDir();
    t1Pos += props.speed * dir;
    t2Pos += props.speed * dir;
  }
  normalize();
  if (t1.value) t1.value.style.transform = `translateX(${t1Pos}px)`;
  if (t2.value) t2.value.style.transform = `translateX(${t2Pos}px)`;
  raf = requestAnimationFrame(loop);
}

onMounted(async () => {
  t1Pos = 0;
  t2Pos = t1.value ? t1.value.offsetWidth : 0;
  loop();
});

onUnmounted(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener('mousemove', pointerMove);
  window.removeEventListener('mouseup', pointerEnd);
  window.removeEventListener('touchmove', touchMove);
  window.removeEventListener('touchend', pointerEnd);
});
</script>

<style scoped lang="scss">
.carousel {
  display: flex;
  align-items: center;
  width: 100%;
  height: 92px;
  cursor:grab;
  // box-shadow: 10px 8px 10px 5px rgba(49, 49, 49, 0.34);

  &:active {
    cursor: grabbing;
  }

  &__viewport {
    position: relative;
    overflow: hidden;
    flex: 1;
    height: 100%;
    border-radius: 8px;
  }

  &__fade {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 10%;
    pointer-events: none;
    z-index: 5;

    &--left {
      left: 0;
      background: linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }

    &--right {
      right: 0;
      // background-color: red;
      background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
    }
  }

  &__track {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    will-change: transform;
  }

  &__logo {
    padding: 0 36px;
    display: flex;
    align-items: center;
    justify-content: center;

    // transform: rotate(360deg);
    // animation-name: rotation;
    // animation-duration: 1s;
    // animation-iteration-count: infinite;
    // animation-timing-function: linear;

    // @keyframes rotation {
    //   from {
    //     transform: rotate(0deg);
    //   }
    //   to {
    //     transform: rotate(360deg);
    //   }
    // }

    img {
      width: 70px;
      height: 70px;
      display: block;
      user-select: none;
      pointer-events: none;
    }
  }
}

</style>