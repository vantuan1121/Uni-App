<script setup>
import { onMounted, ref } from 'vue'
import { searchUnsplashImages } from '@/api/unsplash/unsplashAPI'

const leftColumn = ref([])
const rightColumn = ref([])
const query = 'Black and White'
const perPage = 20

async function fetchImages() {
  const images = await searchUnsplashImages(query, 1, perPage)

  // Tách ảnh thành 2 cột
  leftColumn.value = images.filter((_, index) => index % 2 !== 0)
  rightColumn.value = images.filter((_, index) => index % 2 === 0)
}

onMounted(fetchImages)
</script>

<template>
  <view class="fixed top-0 left-0 w-full h-12 bg-white flex items-center px-4 shadow z-100">
    <router-link to="/" class="text-lg cursor-pointer">
      <svg width="27" height="27" viewBox="0 0 32 32"><path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path></svg>
    </router-link>
    <text class="text-lg font-bold mx-auto">
      Black and White
    </text>
  </view>

  <div class="grid grid-cols-2 gap-1">
    <!-- Cột trái -->
    <div class="flex flex-col gap-4">
      <div v-for="(image, index) in leftColumn" :key="index" class="relative">
        <a :href="image.links.html" target="_blank">
          <img
            :src="image.urls.small" :alt="image.alt_description"
            class=" shadow-md w-full object-cover"
          />
        </a>
        <!-- tên tác giả -->
        <div class="absolute bottom-0 left-0 w-full text-white p-2 rounded-b-lg">
          <a :href="image.user.links.html" target="_blank" class="font-semibold block">
            {{ image.user.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Cột phải -->
    <div class="flex flex-col gap-1">
      <div v-for="(image, index) in rightColumn" :key="index" class="relative">
        <a :href="image.links.html" target="_blank">
          <img
            :src="image.urls.small" :alt="image.alt_description"
            class="1 shadow-md w-full object-cover"
          />
        </a>
        <!-- tên tác giả -->
        <div class="absolute bottom-0 left-0 w-full text-white p-2 rounded-b-lg">
          <a :href="image.user.links.html" target="_blank" class="font-semibold block">
            {{ image.user.name }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
