<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getUserLikes } from '@/api/unsplash/unsplashAPI'
import PhotoActions from '@/components/PhotoActions.vue'

defineProps({
  searchQuery: String,
})

const username = ref('')
const likes = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)
const selectedPhoto = ref(null)
const selectedPhotoIndex = ref(-1)
const preloadedImages = ref(new Set())
const loadingImage = ref(false)

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
    const results = await getUserLikes(username.value, currentPage.value)
    if (results.length === 0) {
      hasMore.value = false
    }
    else {
      likes.value = [...likes.value, ...results]
      currentPage.value++
      preloadImages()
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
    fetchLikes(true)
  }
}

function preloadImages() {
  likes.value.forEach((photo) => {
    if (!preloadedImages.value.has(photo.id)) {
      const img = new Image()
      img.src = photo.urls?.small || photo.urls?.regular || photo.urls?.full || '/default-image.png'
      preloadedImages.value.add(photo.id)
    }
  })
}

function openPhotoDetail(photo, index) {
  selectedPhoto.value = photo
  selectedPhotoIndex.value = index
  preloadAdjacentImages(index)
}

function closePhotoDetail() {
  selectedPhoto.value = null
  selectedPhotoIndex.value = -1
  loadingImage.value = false
}

function preloadAdjacentImages(index) {
  const prevIndex = index - 1
  const nextIndex = index + 1

  if (prevIndex >= 0) {
    const prevPhoto = likes.value[prevIndex]
    if (!preloadedImages.value.has(prevPhoto.id)) {
      const img = new Image()
      img.src = prevPhoto.urls?.small || prevPhoto.urls?.regular || prevPhoto.urls?.full || '/default-image.png'
      preloadedImages.value.add(prevPhoto.id)
    }
  }

  if (nextIndex < likes.value.length) {
    const nextPhoto = likes.value[nextIndex]
    if (!preloadedImages.value.has(nextPhoto.id)) {
      const img = new Image()
      img.src = nextPhoto.urls?.small || nextPhoto.urls?.regular || nextPhoto.urls?.full || '/default-image.png'
      preloadedImages.value.add(nextPhoto.id)
    }
  }
}

function handleSwipe(direction) {
  if (loadingImage.value)
    return

  if (direction === 'left' && selectedPhotoIndex.value < likes.value.length - 1) {
    loadingImage.value = true
    selectedPhotoIndex.value++
    selectedPhoto.value = likes.value[selectedPhotoIndex.value]
    preloadAdjacentImages(selectedPhotoIndex.value)
  }
  else if (direction === 'right' && selectedPhotoIndex.value > 0) {
    loadingImage.value = true
    selectedPhotoIndex.value--
    selectedPhoto.value = likes.value[selectedPhotoIndex.value]
    preloadAdjacentImages(selectedPhotoIndex.value)
  }
}

let touchStartX = 0
let isSwiping = false

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
  isSwiping = false
}

function handleTouchMove(event) {
  const touchCurrentX = event.touches[0].clientX
  const diffX = touchCurrentX - touchStartX
  if (Math.abs(diffX) > 10) {
    isSwiping = true
  }
}

function handleTouchEnd(event) {
  if (!isSwiping)
    return

  const touchEndX = event.changedTouches[0].clientX
  const diffX = touchEndX - touchStartX
  if (Math.abs(diffX) > 50) {
    if (diffX > 0) {
      handleSwipe('right')
    }
    else {
      handleSwipe('left')
    }
  }
}

function onImageLoad() {
  loadingImage.value = false
}

function preventTouchPropagation(event) {
  event.stopPropagation()
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
    <!-- Danh sách ảnh -->
    <div class="flex-1 overflow-auto scroll-container bg-[#111111]" @scroll="onScroll">
      <div v-if="isLoading && !likes.length" class="text-center text-gray-500 py-4">
        <span class="animate-pulse"></span>
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-500 py-4">
        {{ errorMessage }}
      </div>
      <div v-else-if="likes.length === 0" class="text-center text-white py-4">
        <div class="flex justify-center mt-[50px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-film " viewBox="0 0 16 16">
            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
          </svg>
        </div>
        <div class="mt-[20px]">
          No photos
        </div>
      </div>
      <div v-else class="flex flex-col">
        <div v-for="(photo, index) in likes" :key="photo.id" class="relative w-full">
          <img
            :src="photo.urls?.small || photo.urls?.regular || photo.urls?.full || '/default-image.png'"
            :alt="photo.alt_description || 'Ảnh từ Unsplash'"
            class="w-full object-contain cursor-pointer"
            @click="openPhotoDetail(photo, index)"
          />
          <!-- Tên tác giả trên ảnh -->
          <div class="absolute bottom-2 left-2 text-white text-sm font-bold font-semibold px-2 py-1">
            {{ photo.user?.name || '' }}
          </div>
        </div>
      </div>
      <div v-if="isLoading && likes.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse"></span>
      </div>
    </div>

    <!-- Overlay xem chi tiết ảnh -->
    <div
      v-if="selectedPhoto"
      class="fixed inset-0 bg-black flex flex-col z-50"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- Header với nút quay lại và tên tác giả -->
      <div class="flex items-center justify-between p-4 w-full">
        <button
          class="!bg-transparent !shadow-none !outline-none -ml-[15px] -mt-[10px]"
          @click="closePhotoDetail"
          @touchstart="preventTouchPropagation"
          @touchmove="preventTouchPropagation"
          @touchend="preventTouchPropagation"
        >
          <svg width="27" height="27" viewBox="0 0 32 32" fill="white">
            <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="white"></path>
          </svg>
        </button>
        <div class="flex-1 text-white font-bold text-lg text-center">
          {{ selectedPhoto.user?.name || '' }}
        </div>
        <div class="w-10"></div> <!-- Cân bằng layout -->
      </div>

      <!-- Ảnh chi tiết -->
      <div class="flex-1 flex items-center justify-center relative">
        <div v-if="loadingImage" class="absolute inset-0 flex items-center justify-center">
          <span class="text-white animate-pulse"></span>
        </div>
        <img
          :key="selectedPhoto.id"
          :src="selectedPhoto.urls?.regular || selectedPhoto.urls?.full || '/default-image.png'"
          :alt="selectedPhoto.alt_description || ''"
          class="max-w-full max-h-[80vh] object-contain transition-transform duration-300"
          @load="onImageLoad"
        />
        <!-- Sử dụng PhotoActions component -->
        <div class="absolute bottom-4 right-4">
          <PhotoActions :photo="selectedPhoto" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  height: calc(100vh - 60px);
}

img {
  max-height: 100%;
  width: 100%;
  margin-bottom: 1px;
}

.transition-transform {
  transition: transform 0.3s ease-in-out;
}

.fixed {
  overscroll-behavior: none;
  touch-action: pan-y pinch-zoom;
}

/* Đảm bảo header căn giữa chính xác */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Tùy chỉnh nút quay lại */
button {
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

button:active {
  transform: scale(0.95);
}
</style>
