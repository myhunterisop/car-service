<template>
  <div class="map-container">
    <div class="map-container__reviews">
      <iframe
        style="width:100%;height:100%;border:1px solid #e6e6e6;border-radius:8px;box-sizing:border-box"
        src="https://yandex.ru/maps-reviews-widget/103858085585?comments"
        title="Яндекс карта"
      >
      </iframe>
      <a href="https://yandex.ru/maps/org/avtoservis/103858085585/" target="_blank" style="box-sizing:border-box;text-decoration:none;color:#b3b3b3;font-size:10px;font-family:YS Text,sans-serif;padding:0 20px;position:absolute;bottom:8px;width:100%;text-align:center;left:0;overflow:hidden;text-overflow:ellipsis;display:block;max-height:14px;white-space:nowrap;padding:0 16px;box-sizing:border-box">Автосервис на карте Санкт‑Петербурга — Яндекс Карты</a>
    </div>
    <div class="map-info map-container__info">
      <div class="contact-info">
        <h3>Контактная информация</h3>
        <div class="contact-item">
          <strong>Адрес:</strong> г. Санкт-Петербург, ул. Химиков, 2 ст2 
        </div>
        <div class="contact-item">
          <strong>Телефон:</strong> +7 (999) 123-LIVE (LIVE RELOAD РАБОТАЕТ!)
        </div>
        <div class="contact-item">
          <strong>Режим работы:</strong> 10:00 - 20:00 ежедневно
        </div>
        <div class="contact-item">
          <strong>Email:</strong> test@live-reload.ru
        </div>
      </div>
    </div>
  
    <div 
      id="yandex-map" 
      class="yandex-map map-container__map"
      ref="mapContainer"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mapContainer = ref(null)

// Координаты автосервиса
const coordinates = [59.965100, 30.467661]

onMounted(() => {
  // Проверяем доступность Yandex Maps API
  if (typeof window !== 'undefined' && window.ymaps) {
    initMap()
  } else {
    // Если API еще не загружен, ждем его загрузки
    window.ymapsReady = initMap
  }
})

const initMap = () => {
  window.ymaps.ready(() => {
    const map = new window.ymaps.Map('yandex-map', {
      center: coordinates,
      zoom: 15,
      controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
    })

    // Добавляем метку автосервиса
    const placemark = new window.ymaps.Placemark(coordinates, {
      balloonContentHeader: 'АвтоСервис',
      balloonContentBody: 'Профессиональный ремонт автомобилей<br><strong>Адрес:</strong> г. Санкт-Петербург, ул. Химиков, 2 ст2 ',
      balloonContentFooter: 'Телефон: +7 (495) 123-45-67',
      hintContent: 'АвтоСервис - Профессиональный ремонт'
    }, {
      iconLayout: 'default#image',
      iconImageHref: '/images/map-marker.png',
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -40]
    })

    map.geoObjects.add(placemark)

    // Отключаем скролл карты колесиком мыши
    // map.behaviors.disable('scrollZoom')
  })
}
</script>

<style lang="scss" scoped>
.map-container {
  display: grid;
  grid-template-columns: 2fr 3fr;
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;

  &__reviews {
    overflow:hidden;
    position:relative;
    grid-area: 1 / 1 / 3 / 2;
  }

  &__info {
    grid-area: 1 / 2 / 2 / 3;
  }

  &__map {
    grid-area: 2 / 2 / 3 / 3;
  }
}

.map-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 10px;
  
  h3 {
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }
}

.contact-item {
  margin-bottom: 1rem;
  line-height: 1.6;
  
  strong {
    color: black;
    display: inline-block;
    min-width: 120px;
  }
}

.yandex-map {
  height: 400px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .map-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .map-info {
    padding: 1.5rem;
  }
  
  .yandex-map {
    height: 300px;
  }
  
  .contact-item strong {
    min-width: auto;
    display: block;
    margin-bottom: 0.25rem;
  }
}
</style>
