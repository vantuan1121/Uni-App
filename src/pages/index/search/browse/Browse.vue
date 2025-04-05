<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Nature from '@/assets/BrowseImages/nature.avif'
import Textures from '@/assets/BrowseImages/Textures.jpg'
import BlackandWhite from '@/assets/BrowseImages/Black-and-White.jpg'
import Abstract from '@/assets/BrowseImages/Abstract.jpg'
import Space from '@/assets/BrowseImages/Space.jpg'
import Minimal from '@/assets/BrowseImages/Minimal.jpg'
import Animals from '@/assets/BrowseImages/Animals.jpg'
import Sky from '@/assets/BrowseImages/Sky.jpg'
import Flowers from '@/assets/BrowseImages/Flowers.jpg'
import Travel from '@/assets/BrowseImages/Travel.jpg'
import Underwater from '@/assets/BrowseImages/Underwater.jpg'
import Drones from '@/assets/BrowseImages/Drones.jpg'
import Architecture from '@/assets/BrowseImages/Architecture.jpg'
import Gradients from '@/assets/BrowseImages/Gradients.jpg'

// Style CSS
const btnClass = 'flex flex-col space-y-2'

// Tham chiếu đến container cuộn
const scrollContainer = ref(null)

// Sử dụng sessionStorage thay vì uni storage
// sessionStorage sẽ tự động xóa khi tab đóng hoặc refresh
function saveScrollPosition() {
  if (scrollContainer.value) {
    const scrollLeft = scrollContainer.value.scrollLeft
    // Đặt một flag để biết rằng đây là điều hướng (không phải refresh)
    sessionStorage.setItem('wasNavigation', 'true')
    // Lưu vị trí cuộn
    sessionStorage.setItem('menuScrollPosition', scrollLeft.toString())
  }
}

function restoreScrollPosition() {
  const wasNavigation = sessionStorage.getItem('wasNavigation')

  // Nếu là điều hướng bình thường (không phải refresh)
  if (wasNavigation === 'true' && scrollContainer.value) {
    const savedPosition = sessionStorage.getItem('menuScrollPosition')
    if (savedPosition) {
      scrollContainer.value.scrollLeft = Number.parseInt(savedPosition)
    }
  }
  else {
    // Nếu là refresh hoặc lần đầu vào trang
    if (scrollContainer.value) {
      scrollContainer.value.scrollLeft = 0
    }
  }
}

// Sử dụng cả beforeunload để phát hiện refresh
function handleBeforeUnload() {
  // Khi trang sắp tải lại, xóa flag wasNavigation
  sessionStorage.removeItem('wasNavigation')
}

onMounted(() => {
  restoreScrollPosition()
  // Thêm trình nghe sự kiện beforeunload
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  // Xóa trình nghe sự kiện khi component bị hủy
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<template>
  <div>
    <div class="mt-[10px] relative">
      <!-- Thêm padding bên trái chỉ cho phần chưa cuộn -->
      <div class="absolute left-0 top-0 w-[40px] h-full bg-transparent pointer-events-none"></div>

      <!-- Container cuộn với padding-left mà không có margin âm -->
      <div
        ref="scrollContainer"
        class="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-[30px]"
      >
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Nature"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Nature" alt="Nature" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Nature</span>
            </div>
          </router-link>

          <router-link
            to="/pages/index/search/browse/browse-menu/Textures"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Textures" alt="Textures" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Textures</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/BlackandWhite"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="BlackandWhite" alt="Black-and-White" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <span class="text-white text-[20px] font-bold">Black and</span>
              <span class="text-white text-[20px] font-bold">White</span>
            </div>
          </router-link>

          <router-link
            to="/pages/index/search/browse/browse-menu/Abstract"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Abstract" alt="Abstract" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Abstract</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Space"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Space" alt="Space" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Space</span>
            </div>
          </router-link>
          <router-link
            to="/pages/index/search/browse/browse-menu/Minimal"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Minimal" alt="Minimal" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Minimal</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Animals"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Animals" alt="Animals" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Animals</span>
            </div>
          </router-link>
          <router-link
            to="/pages/index/search/browse/browse-menu/Sky"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Sky" alt="Sky" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Sky</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Flowers"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Flowers" alt="Flowers" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Flowers</span>
            </div>
          </router-link>
          <router-link
            to="/pages/index/search/browse/browse-menu/Travel"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Travel" alt="Travel" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Travel</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Underwater"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Underwater" alt="Underwater" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Underwater</span>
            </div>
          </router-link>
          <router-link
            to="/pages/index/search/browse/browse-menu/Drones"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Drones" alt="Drones" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Drones</span>
            </div>
          </router-link>
        </div>

        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Architecture"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Architecture" alt="Architecture" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Architecture</span>
            </div>
          </router-link>
          <router-link
            to="/pages/index/search/browse/browse-menu/Gradients"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
            @click="saveScrollPosition"
          >
            <img :src="Gradients" alt="Gradients" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Gradients</span>
            </div>
          </router-link>
        </div>

        <!-- Khoảng trắng right -->
        <div class="border-[15px] opacity-0"></div>
      </div>
    </div>
  </div>
</template>
