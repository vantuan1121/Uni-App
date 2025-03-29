<script setup>
import { defineProps, onMounted, ref, watch } from 'vue'
import SearchHeader from './SearchHeader.vue'
import { getImageSearch } from '@/api/unsplash/unsplashAPI'

const props = defineProps({
  query: String, // Nhận từ khóa từ TabBar.vue
})

const searchQuery = ref(props.query || '')
const images = ref([])
const masonryColumns = ref(2)
const columns = ref(Array.from({ length: masonryColumns.value }, () => []))
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

// Hàm phân phối ảnh vào các cột
function distributeImagesToColumns(newImages) {
  columns.value = Array.from({ length: masonryColumns.value }, () => [])

  newImages.forEach((image) => {
    const shortestColumnIndex = columns.value.reduce((minIndex, column, index, arr) =>
      column.reduce((sum, img) => sum + img.estimatedHeight, 0)
      < arr[minIndex].reduce((sum, img) => sum + img.estimatedHeight, 0)
        ? index
        : minIndex, 0)

    columns.value[shortestColumnIndex].push({
      ...image,
      estimatedHeight: calculateEstimatedHeight(image),
    })
  })
}

function calculateEstimatedHeight(image, targetWidth = 500) {
  const aspectRatio = image.height / image.width
  return Math.round(targetWidth * aspectRatio)
}

// Gọi API tìm kiếm ảnh
async function fetchImages(isLoadMore = false) {
  if (!searchQuery.value.trim() || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    images.value = []
    columns.value = Array.from({ length: masonryColumns.value }, () => [])
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    const results = await getImageSearch(searchQuery.value, currentPage.value)

    if (results.length === 0) {
      hasMore.value = false
      return
    }

    images.value = [...images.value, ...results]
    distributeImagesToColumns(images.value)
    currentPage.value++
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    errorMessage.value = 'Không thể tải ảnh. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

// Theo dõi sự thay đổi của searchQuery
watch(searchQuery, () => {
  fetchImages()
})

// Theo dõi sự thay đổi của props.query
watch(() => props.query, (newQuery) => {
  searchQuery.value = newQuery
  fetchImages()
}, { immediate: true })

// Hàm xử lý sự kiện cuộn trang
function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchImages(true)
  }
}

// Gắn sự kiện cuộn khi component được mount
onMounted(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <SearchHeader v-model="searchQuery" />

    <div class="flex-1 overflow-auto mt-[15px] scroll-container">
      <div v-if="isLoading && !images.length" class="text-center text-gray-500">
        <span class="animate-pulse">Đang tải...</span>
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-500">
        {{ errorMessage }}
      </div>
      <div v-else-if="images.length === 0" class="text-center">
        Không tìm thấy kết quả nào.
      </div>

      <div v-else class="grid grid-cols-2 gap-[1px]">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="flex flex-col gap-[1px]">
          <div v-for="image in column" :key="image.id" class="relative overflow-hidden shadow-md">
            <img
              :src="image.urls.small"
              :alt="image.alt_description"
              class="w-full h-auto object-contain"
              style="max-height: 500px;"
            />
            <div class="absolute bottom-0 left-0 right-0 text-white font-bold p-2">
              {{ image.user.name }}
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading && images.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải thêm...</span>
      </div>
    </div>
  </div>
</template>
