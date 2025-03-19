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
</script>

<template>
  <div>
    <h1 class="font-bold">
      Browse by Category
    </h1>
    <div>
      <div class="flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide p-2">
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Nature" alt="Nature" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Nature</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Textures" alt="Textures" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Textures</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="BlackandWhite" alt="Black-and-White" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Black and White</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Abstract" alt="Abstract" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Abstract</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Space" alt="Space" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Space</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Minimal" alt="Minimal" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Minimal</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Animals" alt="Animals" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Animals</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Sky" alt="Sky" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Sky</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Flowers" alt="Flowers" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Flowers</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Travel" alt="Travel" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Travel</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Underwater" alt="Underwater" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Underwater</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Drones" alt="Drones" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Drones</span>
            </div>
          </div>
        </div>

        <!-- ======= -->
        <div class="flex flex-col space-y-4">
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Architecture" alt="Architecture" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Architecture</span>
            </div>
          </div>
          <!--  -->
          <div class="relative w-40 h-40 rounded-lg overflow-hidden bg-black shrink-0">
            <img :src="Gradients" alt="Gradients" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <span class="text-white text-xl font-bold">Gradients</span>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
    </div>
  </div>
</template>
