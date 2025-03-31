<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserPhotos } from '@/api/unsplash/unsplashAPI' // Giả định có API này

defineProps({
  searchQuery: String, // Nhận từ TabBarUser, mặc dù có thể không dùng ở đây
})

const username = ref('')
const photos = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

onLoad((options) => {
  if (options?.username) {
    username.value = options.username
    fetchPhotos()
  }
})

async function fetchPhotos(isLoadMore = false) {
  if (!username.value || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    photos.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    // Gọi API để lấy danh sách ảnh của user
    const results = await getUserPhotos(username.value, currentPage.value)
    if (results.length === 0) {
      hasMore.value = false
    }
    else {
      photos.value = [...photos.value, ...results]
      currentPage.value++
    }
  }
  catch (error) {
    console.error('Lỗi khi tải ảnh của người dùng:', error)
    errorMessage.value = 'Không thể tải ảnh. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchPhotos(true) // Tải thêm ảnh khi cuộn gần cuối
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
  <div class="flex flex-col h-full">
    <div class="flex-1 overflow-auto scroll-container bg-gray-100" @scroll="onScroll">
      <!-- Trạng thái đang tải lần đầu -->
      <div v-if="isLoading && !photos.length" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải ảnh...</span>
      </div>

      <!-- Trạng thái lỗi -->
      <div v-else-if="errorMessage" class="text-center text-red-500 py-4">
        {{ errorMessage }}
      </div>

      <!-- Không có ảnh -->
      <div v-else-if="photos.length === 0" class="text-center text-gray-500 py-4">
        Người dùng này chưa có ảnh nào.
      </div>

      <!-- Danh sách ảnh -->
      <div v-else class="photo-grid">
        <div v-for="photo in photos" :key="photo.id" class="photo-container">
          <img
            :src="photo.urls?.regular || photo.urls?.full || '/default-image.png'"
            :alt="photo.alt_description || 'Ảnh từ Unsplash'"
            class="w-full object-contain"
          />
        </div>
      </div>

      <!-- Trạng thái tải thêm -->
      <div v-if="isLoading && photos.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải thêm ảnh...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  height: calc(100vh - 60px); /* Điều chỉnh dựa trên chiều cao TabBar */
}

.photo-grid {
  display: flex;
  flex-direction: column;
  gap: 1px;

}

.photo-container {
  width: 100%;
  margin-bottom: 1px;
}

.photo-container img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
