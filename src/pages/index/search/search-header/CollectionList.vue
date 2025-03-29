<script setup>
import { onMounted, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SearchHeader from './SearchHeader.vue'
import { getCollectionSearch } from '@/api/unsplash/unsplashAPI'

const searchQuery = ref('')
const collections = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

onLoad((options) => {
  if (options?.query) {
    searchQuery.value = decodeURIComponent(options.query)
    fetchCollections()
  }
})

async function fetchCollections(isLoadMore = false) {
  if (!searchQuery.value.trim() || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    collections.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    const results = await getCollectionSearch(searchQuery.value, currentPage.value)

    if (results.length === 0) {
      hasMore.value = false
      return
    }

    const newCollections = [...collections.value, ...results]
    collections.value = newCollections

    currentPage.value++
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    errorMessage.value = 'Không thể tải bộ sưu tập. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

watch(searchQuery, () => {
  fetchCollections()
})

function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchCollections(true)
  }
}

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
      <div v-if="isLoading && !collections.length" class="text-center text-gray-500">
        <span class="animate-pulse">Đang tải...</span>
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-500">
        {{ errorMessage }}
      </div>
      <div v-else-if="collections.length === 0" class="text-center">
        Không tìm thấy bộ sưu tập nào.
      </div>

      <div v-else class="space-y-4 p-4">
        <div
          v-for="collection in collections"
          :key="collection.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <!-- Phần ảnh preview của bộ sưu tập -->
          <div class="flex overflow-x-auto space-x-1 pb-2">
            <img
              v-for="(photo, index) in collection.preview_photos?.slice(0, 3)"
              :key="index"
              :src="photo.urls?.small"
              class="h-25 w-25 object-cover flex-shrink-0"
            />
          </div>

          <!-- Thông tin bộ sưu tập -->
          <div class="p-2">
            <h3 class="font-bold text-lg">
              {{ collection.title }}
            </h3>
            <p class="text-gray-600 text-sm">
              {{ collection.total_photos }} ảnh • Được tạo bởi {{ collection.user?.name || 'Ẩn danh' }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="isLoading && collections.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải thêm...</span>
      </div>
    </div>
  </div>
</template>
