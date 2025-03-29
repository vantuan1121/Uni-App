<script setup>
import { onMounted, ref } from 'vue'
import { getLatestPhotos } from '@/api/unsplash/unsplashAPI'

const masonryColumns = ref(2)
const columns = ref(Array.from({ length: masonryColumns.value }, () => []))
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

// Trạng thái cho photo viewer
const showPhotoViewer = ref(false)
const currentPhotoIndex = ref(0)
const allPhotos = ref([]) // Lưu tất cả ảnh theo thứ tự mảng phẳng

// Tính toán chiều cao ước lượng để phân phối
function calculateEstimatedHeight(image, targetWidth = 500) {
  const aspectRatio = image.height / image.width
  return Math.round(targetWidth * aspectRatio)
}

// Phân phối ảnh vào các cột
function distributeImagesToColumns(newImages) {
  // Thêm ảnh mới vào mảng phẳng
  allPhotos.value = [...allPhotos.value, ...newImages]

  newImages.forEach((image) => {
    // Tìm cột có chiều cao nhỏ nhất để thêm ảnh
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

// Hàm tải ảnh
async function fetchLatestPhotos() {
  if (loading.value || !hasMore.value)
    return // Nếu đang tải hoặc không còn ảnh thì không gọi tiếp

  loading.value = true

  try {
    const newPhotos = await getLatestPhotos(page.value)

    if (newPhotos.length === 0) {
      hasMore.value = false
      return
    }

    // Phân phối ảnh vào các cột
    distributeImagesToColumns(newPhotos)

    page.value++ // Tăng số trang lên để lần sau tải trang tiếp theo
  }
  catch (error) {
    console.error('Lỗi khi tải ảnh:', error)
    hasMore.value = false
  }
  finally {
    loading.value = false
  }
}

// Kiểm tra vị trí cuộn
function handleScroll() {
  const scrollPosition = window.innerHeight + window.scrollY
  const pageHeight = document.documentElement.scrollHeight

  if (scrollPosition >= pageHeight - 500 && !loading.value && hasMore.value) {
    fetchLatestPhotos()
  }
}

// Mở photo viewer
function openPhotoViewer(photo) {
  // Tìm index của ảnh được click trong mảng phẳng
  const index = allPhotos.value.findIndex(p => p.id === photo.id)
  if (index !== -1) {
    currentPhotoIndex.value = index
    showPhotoViewer.value = true
    // Vô hiệu hóa cuộn trang khi đang xem ảnh
    document.body.style.overflow = 'hidden'
  }
}

// Đóng photo viewer
function closePhotoViewer() {
  showPhotoViewer.value = false
  // Khôi phục cuộn trang
  document.body.style.overflow = 'auto'
}

// Xem ảnh tiếp theo
function nextPhoto() {
  if (currentPhotoIndex.value < allPhotos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

// Xem ảnh trước đó
function prevPhoto() {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

// Xử lý sự kiện vuốt
let touchStartX = 0
let touchEndX = 0

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].screenX
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].screenX
  handleSwipe()
}

function handleSwipe() {
  const swipeThreshold = 50 // Ngưỡng để xác định vuốt

  if (touchEndX < touchStartX - swipeThreshold) {
    // Vuốt sang trái -> ảnh tiếp theo
    nextPhoto()
  }

  if (touchEndX > touchStartX + swipeThreshold) {
    // Vuốt sang phải -> ảnh trước đó
    prevPhoto()
  }
}

// Lắng nghe sự kiện cuộn
onMounted(() => {
  fetchLatestPhotos() // Tải trang đầu tiên khi component mount
  window.addEventListener('scroll', handleScroll) // Bắt sự kiện cuộn
})
</script>

<template>
  <div>
    <div class="flex gap-[1px]">
      <!-- Render từng cột -->
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="flex-1 flex flex-col gap-y-[1px]"
      >
        <div
          v-for="photo in column"
          :key="photo.id"
          class="relative"
          @click="openPhotoViewer(photo)"
        >
          <image
            :src="photo.urls.small"
            mode="widthFix"
            class="w-full block"
          />
          <div class="absolute bottom-0 left-0 text-white div-sm p-2 rounded-bl-lg">
            {{ photo.user.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- Phần tử hiển thị trạng thái tải -->
    <div class="h-10 w-full text-center text-gray-500 mt-4">
      <span v-if="loading" class="animate-pulse">Đang tải...</span>
      <span v-else-if="!hasMore && columns[0].length > 0">
        Không còn ảnh để tải
      </span>
    </div>

    <!-- Photo Viewer Modal -->
    <!-- Photo Viewer Modal -->
    <div
      v-if="showPhotoViewer"
      class="fixed inset-0 bg-black z-50 flex flex-col"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <!-- Header chứa nút quay lại và tên tác giả -->
      <div class="flex items-center justify-between w-full bg-black bg-opacity-50">
        <!-- Nút quay lại -->
        <div class="p-2 cursor-pointer" @click="closePhotoViewer">
          <svg width="27" height="27" viewBox="0 0 32 32" fill="white">
            <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z"></path>
          </svg>
        </div>

        <!-- Tên tác giả -->
        <div class="text-white font-bold text-lg flex-1 text-center">
          {{ allPhotos[currentPhotoIndex].user.name }}
        </div>

        <!-- Chừa một div rỗng để căn giữa tên -->
        <div class="w-10"></div>
      </div>

      <!-- Ảnh và thông tin -->
      <div class="flex-1 flex items-center justify-center overflow-hidden">
        <img
          v-if="allPhotos[currentPhotoIndex]"
          :src="allPhotos[currentPhotoIndex].urls.regular"
          class="max-w-full max-h-full object-contain"
          alt="Photo"
        />
      </div>
    </div>
  </div>
</template>
