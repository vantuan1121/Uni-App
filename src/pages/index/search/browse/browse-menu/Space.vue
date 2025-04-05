<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { getTopicPhotos } from '@/api/unsplash/unsplashAPI'
import PhotoActions from '@/components/PhotoActions.vue'

// Các biến reactive
const masonryColumns = ref(2)
const columns = ref(Array.from({ length: masonryColumns.value }, () => []))
const topicId = ref('textures-patterns')
const topicTitle = ref('Space')
const perPage = 30
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)
const selectedImage = ref(null)
const showDetail = ref(false)
const selectedImageIndex = ref(-1)
const scrollPosition = ref(0)
const allImagesFlat = ref([])

// Thuộc tính computed cho danh sách ảnh được làm phẳng
const allImages = computed(() => {
  const maxLength = Math.max(...columns.value.map(col => col.length))
  const images = []
  for (let i = 0; i < maxLength; i++) {
    for (let j = 0; j < columns.value.length; j++) {
      if (columns.value[j][i])
        images.push(columns.value[j][i])
    }
  }
  return images
})

// Tính toán chiều cao ảnh dựa trên tỷ lệ khung hình
function calculateEstimatedHeight(image, targetWidth = 500) {
  return Math.round((image.height / image.width) * targetWidth)
}

// Phân phối ảnh vào các cột sử dụng layout masonry
function distributeImagesToColumns(newImages) {
  allImagesFlat.value.push(...newImages)
  newImages.forEach((image) => {
    const shortestColumnIndex = columns.value.reduce((minIdx, col, idx) =>
      col.reduce((sum, img) => sum + img.estimatedHeight, 0)
      < columns.value[minIdx].reduce((sum, img) => sum + img.estimatedHeight, 0)
        ? idx
        : minIdx, 0)

    columns.value[shortestColumnIndex].push({
      ...image,
      estimatedHeight: calculateEstimatedHeight(image),
    })
  })
}

// Lấy ảnh từ Unsplash API
async function fetchImages() {
  if (loading.value || !hasMore.value)
    return
  loading.value = true

  try {
    const images = await getTopicPhotos(topicId.value, page.value, perPage)
    if (!images.length) {
      hasMore.value = false
      return
    }
    distributeImagesToColumns(images)
    page.value++
  }
  catch (error) {
    console.error('Lỗi khi tải ảnh:', error)
    hasMore.value = false
  }
  finally {
    loading.value = false
  }
}

// Thiết lập cuộn vô hạn
function setupInfiniteScroll() {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && hasMore.value) {
      fetchImages()
    }
  }, { threshold: 0.1 })

  const sentinel = document.getElementById('scroll-sentinel')
  if (sentinel)
    observer.observe(sentinel)
}

// Xử lý điều hướng
function handleCancel() {
  uni.reLaunch({ url: '/' })
  // Tùy chọn: Xóa vị trí cuộn đã lưu nếu bạn không muốn giữ nó sau khi quay lại
  // uni.removeStorageSync('menuScrollPosition')
}

function handleImageClick(image) {
  scrollPosition.value = window.scrollY
  selectedImageIndex.value = allImages.value.findIndex(img => img.id === image.id)
  selectedImage.value = allImages.value[selectedImageIndex.value]
  showDetail.value = true
  document.body.style.overflow = 'hidden'
}

function backToGallery() {
  showDetail.value = false
  selectedImage.value = null
  selectedImageIndex.value = -1
  document.body.style.overflow = ''
  nextTick(() => window.scrollTo({ top: scrollPosition.value, behavior: 'auto' }))
}

// Xử lý cảm ứng để điều hướng ảnh
let touchStartX = 0
let touchEndX = 0
let isSwiping = false

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
  touchEndX = touchStartX
  isSwiping = false
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX
  const swipeDistance = Math.abs(touchEndX - touchStartX)
  const threshold = 10
  if (swipeDistance > threshold) {
    isSwiping = true
  }
}

function handleTouchEnd() {
  const swipeDistance = touchEndX - touchStartX
  const swipeThreshold = 75

  if (isSwiping) {
    if (swipeDistance > swipeThreshold && selectedImageIndex.value > 0) {
      selectedImageIndex.value--
      selectedImage.value = allImages.value[selectedImageIndex.value]
    }
    else if (swipeDistance < -swipeThreshold && selectedImageIndex.value < allImages.value.length - 1) {
      selectedImageIndex.value++
      selectedImage.value = allImages.value[selectedImageIndex.value]
    }
  }
}

// Khởi tạo component
onMounted(() => {
  fetchImages()
  setupInfiniteScroll()
})
</script>

<template>
  <!-- Header -->
  <view v-if="!showDetail" class="fixed top-0 left-0 w-full h-12 bg-[#222222] flex items-center px-4 z-100">
    <div @click="handleCancel">
      <svg width="27" height="27" viewBox="0 0 32 32">
        <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="white"></path>
      </svg>
    </div>
    <text class="text-lg font-bold mx-auto text-white">
      {{ topicTitle }}
    </text>
  </view>

  <!-- Xem chi tiết -->
  <div
    v-if="showDetail"
    class="fixed inset-0 bg-[#222222] z-50 flex flex-col"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="fixed top-0 left-0 w-full h-12 flex items-center px-4 bg-[#222222] text-white z-50">
      <div class="cursor-pointer" @click="backToGallery">
        <svg width="27" height="27" viewBox="0 0 32 32">
          <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#ffffff"></path>
        </svg>
      </div>
      <text class="text-lg font-bold mx-auto text-white">
        {{ selectedImage?.user?.name || '' }}
      </text>
    </div>
    <div class="flex-1 flex items-center justify-center">
      <img
        v-if="selectedImage"
        :src="selectedImage.urls.regular || selectedImage.urls.small"
        :alt="selectedImage.alt_description"
        class="max-w-full max-h-full object-contain"
      />
      <div class="absolute bottom-4 right-4">
        <PhotoActions :photo="selectedImage" />
      </div>
    </div>
  </div>

  <!-- Thư viện ảnh -->
  <div v-if="!showDetail" class="pt-12">
    <div class="grid grid-cols-2 gap-[1px] bg-[#222222]">
      <div v-for="(column, index) in columns" :key="index" class="flex flex-col gap-[1px]">
        <div
          v-for="image in column"
          :key="image.id"
          class="relative overflow-hidden"
          @click="handleImageClick(image)"
        >
          <img
            :src="image.urls.small"
            :alt="image.alt_description"
            class="w-full h-auto object-contain cursor-pointer"
            style="max-height: 500px;"
          />
          <div class="absolute bottom-0 left-0 w-full text-white p-2 bg-gradient-to-t from-black/50 to-transparent">
            <a class="font-semibold block">{{ image.user.name }}</a>
          </div>
        </div>
      </div>
    </div>
    <div id="scroll-sentinel" class="h-10 w-full text-center text-gray-500">
      <span v-if="loading" class="animate-pulse"></span>
      <span v-else-if="!hasMore && columns[0].length > 0">Không còn ảnh để tải</span>
    </div>
  </div>
</template>
