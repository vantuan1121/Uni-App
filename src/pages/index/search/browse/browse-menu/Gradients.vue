<script setup>
import { onMounted, ref } from 'vue'
import { searchUnsplashImages } from '@/api/unsplash/unsplashAPI'

const leftColumn = ref([])
const rightColumn = ref([])
const query = 'Gradients'
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
  </div>
</template>
