<!-- components/AutoLogosCore.vue -->
<template>
  <div
    class="core-marquee"
    ref="wrap"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousedown.prevent="onDragStart"
    @touchstart.passive="onTouchStart"
    @wheel.passive="onWheel"
  >
    <div class="track" ref="t1" :style="trackStyle(t1Pos)">
      <slot name="items">
        <div v-for="(l,i) in logos" :key="'a'+i" class="logo">
          <img :src="`/images/car-logo/${l}`" :style="{height:size+'px'}" />
        </div>
      </slot>
    </div>

    <div class="track" ref="t2" :style="trackStyle(t2Pos)">
      <slot name="items2">
        <div v-for="(l,i) in logos" :key="'b'+i" class="logo">
          <img :src="`/images/car-logo/${l}`" :style="{height:size+'px'}" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  logos: { type: Array, default: () => [
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
  ]},
  speed: { type: Number, default: 0.5 }, // px per frame base
  size: { type: Number, default: 50 },
  direction: { 
    type: String,
    default: 'left' 
  }, // left | right
  pauseOnHover: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['scrollStart','scrollEnd']);

const wrap = ref(null);
const t1 = ref(null);
const t2 = ref(null);

let t1Pos = 0;
let t2Pos = 0;
let raf = null;
let dragging = false;
let lastPointer = null;
let velocity = 0;
let lastTime = 0;
let paused = false;

function trackStyle(x){ return { transform:`translateX(${x}px)` }; }

function signDir(){ return props.direction === 'left' ? -1 : 1; }

function onMouseEnter(){ if(props.pauseOnHover) paused = true; }
function onMouseLeave(){ paused = false; }

function onDragStart(e){
  dragging = true;
  lastPointer = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
  velocity = 0;
  lastTime = performance.now();
  emit('scrollStart');
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
}

function onTouchStart(e){
  dragging = true;
  lastPointer = e.touches[0].clientX;
  velocity = 0;
  lastTime = performance.now();
  emit('scrollStart');
  window.addEventListener('touchmove', onTouchMove, {passive:false});
  window.addEventListener('touchend', onDragEnd);
}

function onDragMove(e){
  if(!dragging) return;
  const x = e.clientX;
  const dx = x - lastPointer;
  lastPointer = x;
  const now = performance.now();
  velocity = dx / Math.max(1, now - lastTime);
  lastTime = now;
  t1Pos += dx;
  t2Pos += dx;
}

function onTouchMove(e){
  if(!dragging) return;
  e.preventDefault();
  const x = e.touches[0].clientX;
  const dx = x - lastPointer;
  lastPointer = x;
  const now = performance.now();
  velocity = dx / Math.max(1, now - lastTime);
  lastTime = now;
  t1Pos += dx;
  t2Pos += dx;
}

function onDragEnd(){
  if(!dragging) return;
  dragging = false;
  lastPointer = null;
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onDragEnd);
  // keep inertia via velocity
  applyInertia();
  emit('scrollEnd');
}

function applyInertia(){
  const friction = 0.95;
  function step(){
    if(Math.abs(velocity) < 0.0005) return;
    t1Pos += velocity * 30;
    t2Pos += velocity * 30;
    velocity *= friction;
    normalizePositions();
    raf = requestAnimationFrame(step);
  }
  raf = requestAnimationFrame(step);
}

function onWheel(e){
  // horizontal wheel support: move tracks opposite to wheel delta
  const dx = e.deltaY || e.deltaX;
  t1Pos -= dx;
  t2Pos -= dx;
  normalizePositions();
}

function normalizePositions(){
  const width = t1.value?.offsetWidth || 1;
  // keep t1 and t2 separated by exactly width
  if(t1Pos <= -width) t1Pos = t2Pos + width;
  if(t2Pos <= -width) t2Pos = t1Pos + width;
  if(t1Pos >= width) t1Pos = t2Pos - width;
  if(t2Pos >= width) t2Pos = t1Pos - width;
}

function loop(){
  if(!dragging && !paused){
    const dir = signDir();
    t1Pos += props.speed * dir;
    t2Pos += props.speed * dir;
  }
  normalizePositions();
  // apply transforms directly via refs to avoid reactive re-renders
  if(t1.value) t1.value.style.transform = `translateX(${t1Pos}px)`;
  if(t2.value) t2.value.style.transform = `translateX(${t2Pos}px)`;
  raf = requestAnimationFrame(loop);
}

onMounted(()=>{
  // initial placement
  t1Pos = 0;
  t2Pos = t1.value ? t1.value.offsetWidth : 0;
  loop();
});

onUnmounted(()=>{
  cancelAnimationFrame(raf);
  window.removeEventListener('mousemove', onDragMove);
  window.removeEventListener('mouseup', onDragEnd);
  window.removeEventListener('touchmove', onTouchMove);
  window.removeEventListener('touchend', onDragEnd);
});
</script>

<style scoped>
.core-marquee{
  position:relative; overflow:hidden; width:100%; height:80px; cursor:grab;
}
.core-marquee:active{ cursor:grabbing; }
.track{
  position:absolute; top:0; left:0; height:100%; display:flex; align-items:center;
  will-change:transform;
}
.logo{ padding:0 36px; display:flex; align-items:center; justify-content:center; }
.logo img{ height:100%; width:auto; display:block; user-select:none; pointer-events:none; }
</style>
