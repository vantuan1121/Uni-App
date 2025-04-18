<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import SearchHeader from './SearchHeader.vue'
import { getImageSearch } from '@/api/unsplash/unsplashAPI'
import PhotoActions from '@/components/PhotoActions.vue'

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

// Biến cho chức năng xem chi tiết
const isDetailView = ref(false)
const currentImageIndex = ref(0)
const scrollPosition = ref(0)
const allFlattenedImages = computed(() => {
  const flattenedImages = []
  columns.value.forEach((column) => {
    column.forEach((image) => {
      flattenedImages.push(image)
    })
  })
  return flattenedImages
})

const currentDetailImage = computed(() => {
  return allFlattenedImages.value[currentImageIndex.value] || null
})

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

// Hàm debounce để giới hạn tần suất gọi hàm
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
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

// Hàm xử lý sự kiện cuộn trang với debounce
const debouncedFetchImages = debounce(() => {
  if (!isLoading.value && hasMore.value) {
    fetchImages(true)
  }
}, 200)

function onScroll(event) {
  if (isDetailView.value)
    return

  const { scrollTop, scrollHeight, clientHeight } = event.target
  scrollPosition.value = scrollTop

  if (scrollTop + clientHeight >= scrollHeight - 200) {
    debouncedFetchImages()
  }
}

// Chức năng xem chi tiết ảnh
function openImageDetail(image, columnIndex, imageIndex) {
  let flatIndex = 0
  let found = false

  for (let i = 0; i < columns.value.length; i++) {
    if (found)
      break

    for (let j = 0; j < columns.value[i].length; j++) {
      if (i < columnIndex || (i === columnIndex && j < imageIndex)) {
        flatIndex++
      }
      else if (i === columnIndex && j === imageIndex) {
        found = true
        break
      }
    }
  }

  currentImageIndex.value = flatIndex
  isDetailView.value = true
}

function closeImageDetail() {
  isDetailView.value = false
  setTimeout(() => {
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollPosition.value
    }
  }, 50)
}

function nextImage() {
  if (currentImageIndex.value < allFlattenedImages.value.length - 1) {
    currentImageIndex.value++
  }
}

function prevImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--
  }
}

// Xử lý vuốt trái phải
let touchStartX = 0
let touchEndX = 0
let isSwiping = false

function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
  isSwiping = false
}

function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX
  if (Math.abs(touchEndX - touchStartX) > 10) {
    isSwiping = true
  }
}

function handleTouchEnd() {
  if (isSwiping) {
    if (touchStartX - touchEndX > 50) {
      nextImage()
    }
    else if (touchEndX - touchStartX > 50) {
      prevImage()
    }
  }
  touchStartX = 0
  touchEndX = 0
  isSwiping = false
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
  <div class="flex flex-col h-screen bg-[#111111]">
    <SearchHeader v-model="searchQuery" />

    <div class="flex-1 overflow-auto mt-[15px] scroll-container">
      <div v-if="isLoading && !images.length" class="text-center text-gray-500">
        <span class="animate-pulse">Loading...</span>
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-500">
        {{ errorMessage }}
      </div>
      <div v-else-if="images.length === 0" class="text-center text-white text-[20px] font-bold">
        <div class="flex justify-center mt-[150px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" class="bi bi-film " viewBox="0 0 16 16">
            <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z" />
          </svg>
        </div>
        <div class="mt-[20px]">
          No photos
        </div>
      </div>

      <div v-else class="grid grid-cols-2 gap-[1px]">
        <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="flex flex-col gap-[1px]">
          <div
            v-for="(image, imageIndex) in column"
            :key="image.id"
            class="relative overflow-hidden shadow-md"
            @click="openImageDetail(image, columnIndex, imageIndex)"
          >
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

    <!-- Chi tiết ảnh -->
    <div
      v-if="isDetailView && currentDetailImage"
      class="fixed inset-0 bg-[#111111] z-50 flex flex-col text-center"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <div class="flex items-center p-4 bg-[#111111] text-white">
        <button
          class="mr-4 p-2 bg-transparent border-0 outline-none shadow-none focus:bg-transparent active:bg-transparent hover:bg-transparent"
          style="appearance: none; -webkit-appearance: none; -webkit-tap-highlight-color: transparent;"
          @click="closeImageDetail"
        >
          <svg width="27" height="27" viewBox="0 0 32 32">
            <path
              d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z"
              fill="White"
            ></path>
          </svg>
        </button>
        <h1 class="text-xl font-bold flex-1 -ml-[20px]">
          {{ currentDetailImage.user.name }}
        </h1>
      </div>
      <div class="flex-1 flex items-center justify-center overflow-hidden bg-[#111111]">
        <img
          :src="currentDetailImage.urls.regular || currentDetailImage.urls.small"
          :alt="currentDetailImage.alt_description"
          class="w-full h-auto object-cover"
        />
        <!-- Sử dụng PhotoActions component -->
        <div class="absolute bottom-4 right-4">
          <PhotoActions :photo="currentDetailImage" />
        </div>
      </div>
    </div>
  </div>
</template>
