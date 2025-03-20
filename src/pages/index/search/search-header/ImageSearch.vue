<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { searchUnsplashImages } from '@/api/unsplash/unsplashAPI'

const searchQuery = ref('')
const images = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

// Lấy từ khóa tìm kiếm từ query params và gọi API
onLoad(async (options) => {
  if (options.query) {
    searchQuery.value = decodeURIComponent(options.query)
    await fetchImages()
  }
})

async function fetchImages() {
  if (!searchQuery.value.trim())
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const results = await searchUnsplashImages(searchQuery.value)
    images.value = results
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    errorMessage.value = 'Không thể tải ảnh. Vui lòng thử lại!'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-4">
    <div v-if="isLoading" class="text-center text-gray-500">
      <span class="animate-pulse">Đang tải...</span>
    </div>
    <div v-else-if="errorMessage" class="text-center text-red-500">
      {{ errorMessage }}
    </div>
    <div v-else-if="images.length === 0" class="text-center">
      Không tìm thấy kết quả nào.
    </div>

    <div v-else class="grid grid-cols-2 gap-4">
      <div v-for="image in images" :key="image.id" class="rounded-lg overflow-hidden shadow-md">
        <img
          :src="image.urls.small"
          :alt="image.alt_description"
          class="w-full h-auto object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
