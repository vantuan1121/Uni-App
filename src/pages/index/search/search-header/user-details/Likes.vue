<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserLikes } from '@/api/unsplash/unsplashAPI' // Giả định có API này

defineProps({
  searchQuery: String, // Nhận từ TabBarUser, có thể không dùng
})

const username = ref('')
const likes = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

onLoad((options) => {
  if (options?.username) {
    username.value = options.username
    fetchLikes()
  }
})

async function fetchLikes(isLoadMore = false) {
  if (!username.value || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    likes.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    // Gọi API để lấy danh sách ảnh mà user đã thích
    const results = await getUserLikes(username.value, currentPage.value)
    if (results.length === 0) {
      hasMore.value = false
    }
    else {
      likes.value = [...likes.value, ...results]
      currentPage.value++
    }
  }
  catch (error) {
    console.error('Lỗi khi tải danh sách ảnh đã thích:', error)
    errorMessage.value = 'Không thể tải danh sách ảnh đã thích. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchLikes(true) // Tải thêm ảnh khi cuộn gần cuối
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
      <div v-if="isLoading && !likes.length" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải ảnh đã thích...</span>
      </div>

      <!-- Trạng thái lỗi -->
      <div v-else-if="errorMessage" class="text-center text-red-500 py-4">
        {{ errorMessage }}
      </div>

      <!-- Không có ảnh đã thích -->
      <div v-else-if="likes.length === 0" class="text-center text-gray-500 py-4">
        Người dùng này chưa thích ảnh nào.
      </div>

      <!-- Danh sách ảnh đã thích - Đã sửa thành 1 cột -->
      <div v-else class="flex flex-col  ">
        <div v-for="photo in likes" :key="photo.id" class="relative w-full">
          <img
            :src="photo.urls?.small || '/default-image.png'"
            :alt="photo.alt_description || 'Ảnh từ Unsplash'"
            class="w-full object-contain "
          />
        </div>
      </div>

      <!-- Trạng thái tải thêm -->
      <div v-if="isLoading && likes.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải thêm ảnh...</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  height: calc(100vh - 60px); /* Điều chỉnh dựa trên chiều cao TabBar */
}

img {
  max-height: 100%;
  width: 100%;
  margin-bottom: 1px;
}
</style>
