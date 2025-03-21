<script setup>
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SearchHeader from './SearchHeader.vue'
import { searchUnsplashImages } from '@/api/unsplash/unsplashAPI'

const searchQuery = ref('')
const images = ref([])
const leftColumn = ref([]) // Cột chứa ảnh chẵn
const rightColumn = ref([]) // Cột chứa ảnh lẻ
const isLoading = ref(false)
const errorMessage = ref('')

// Lấy từ khóa tìm kiếm từ query params khi trang load
onLoad((options) => {
  if (options.query) {
    searchQuery.value = decodeURIComponent(options.query)
    fetchImages()
  }
})

// Hàm gọi API tìm kiếm ảnh
async function fetchImages() {
  if (!searchQuery.value.trim())
    return

  isLoading.value = true
  errorMessage.value = ''
  images.value = []
  leftColumn.value = []
  rightColumn.value = []

  try {
    const results = await searchUnsplashImages(searchQuery.value)
    images.value = results

    // Chia ảnh vào hai cột
    leftColumn.value = results.filter((_, index) => index % 2 === 0) // Chẵn
    rightColumn.value = results.filter((_, index) => index % 2 !== 0) // Lẻ
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    errorMessage.value = 'Không thể tải ảnh. Vui lòng thử lại!'
  }
  finally {
    isLoading.value = false
  }
}

// Theo dõi thay đổi của searchQuery để tìm kiếm lại ảnh khi từ khóa thay đổi
watch(searchQuery, () => {
  fetchImages()
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- Thanh tìm kiếm luôn cố định trên cùng -->
    <SearchHeader v-model="searchQuery" />

    <div class="flex-1 overflow-auto p-4 mt-[50px]">
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
        <!-- Cột 1: Ảnh chẵn -->
        <div class="flex flex-col gap-4">
          <div v-for="image in leftColumn" :key="image.id" class="relative rounded-lg overflow-hidden shadow-md">
            <a :href="image.links.html" target="_blank">
              <img
                :src="image.urls.small"
                :alt="image.alt_description"
                class="w-full h-auto object-cover"
              />
            </a>
            <!-- Hiển thị tên tác giả -->
            <div class="absolute bottom-0 left-0 right-0 text-white font-bold p-2">
              {{ image.user.name }}
            </div>
          </div>
        </div>

        <!-- Cột 2: Ảnh lẻ -->
        <div class="flex flex-col gap-4">
          <div v-for="image in rightColumn" :key="image.id" class="relative rounded-lg overflow-hidden shadow-md">
            <a :href="image.links.html" target="_blank">
              <img
                :src="image.urls.small"
                :alt="image.alt_description"
                class="w-full h-auto object-cover"
              />
            </a>
            <!-- Hiển thị tên tác giả -->
            <div class="absolute bottom-0 left-0 right-0 text-white font-bold p-2">
              {{ image.user.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
