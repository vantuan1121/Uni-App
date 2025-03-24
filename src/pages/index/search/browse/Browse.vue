<script setup>
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
</script>

<template>
  <div>
    <div class="mt-[10px] relative">
      <!-- Thêm padding bên trái chỉ cho phần chưa cuộn -->
      <div class="absolute left-0 top-0 w-[40px] h-full bg-transparent pointer-events-none"></div>

      <!-- Container cuộn với padding-left mà không có margin âm -->
      <div class="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide px-[30px]">
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Nature"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Nature" alt="Nature" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Nature</span>
            </div>
          </router-link>

          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Textures"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Textures" alt="Textures" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Textures</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/BlackandWhite"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="BlackandWhite" alt="Black-and-White" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <span class="text-white text-[20px] font-bold">Black and</span>
              <span class="text-white text-[20px] font-bold">White</span>
            </div>
          </router-link>

          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Abstract"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Abstract" alt="Abstract" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Abstract</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Space"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Space" alt="Space" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Space</span>
            </div>
          </router-link>
          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Minimal"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Minimal" alt="Minimal" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Minimal</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Animals"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Animals" alt="Animals" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Animals</span>
            </div>
          </router-link>
          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Sky"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Sky" alt="Sky" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Sky</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Flowers"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Flowers" alt="Flowers" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Flowers</span>
            </div>
          </router-link>
          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Travel"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Travel" alt="Travel" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Travel</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Underwater"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Underwater" alt="Underwater" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Underwater</span>
            </div>
          </router-link>
          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Drones"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Drones" alt="Drones" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Drones</span>
            </div>
          </router-link>
        </div>

        <!-- ======= -->
        <div :class="btnClass">
          <router-link
            to="/pages/index/search/browse/browse-menu/Architecture"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Architecture" alt="Architecture" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Architecture</span>
            </div>
          </router-link>
          <!--  -->
          <router-link
            to="/pages/index/search/browse/browse-menu/Gradients"
            class="relative w-35 h-35 rounded-lg overflow-hidden bg-black shrink-0"
          >
            <img :src="Gradients" alt="Gradients" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-[20px] font-bold">Gradients</span>
            </div>
          </router-link>
        </div>

        <!-- Khoảng trắng right -->
        <div class="border-[15px] opacity-0">
        </div>
      </div>
      <!--  -->
    </div>
  </div>
</template>
