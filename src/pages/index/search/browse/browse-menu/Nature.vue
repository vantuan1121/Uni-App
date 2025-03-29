<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { getImageSearch } from '@/api/unsplash/unsplashAPI'

const masonryColumns = ref(2)
const columns = ref(Array.from({ length: masonryColumns.value }, () => []))
const query = 'Nature'
const perPage = 30
const page = ref(1)
const loading = ref(false)
const hasMore = ref(true)

// Tính toán chiều cao ước lượng để phân phối
function calculateEstimatedHeight(image, targetWidth = 500) {
  const aspectRatio = image.height / image.width
  return Math.round(targetWidth * aspectRatio)
}

// Phân phối ảnh vào các cột
function distributeImagesToColumns(newImages) {
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

async function fetchImages() {
  if (loading.value || !hasMore.value)
    return

  loading.value = true

  try {
    const images = await getImageSearch(query, page.value, perPage)

    if (images.length === 0) {
      hasMore.value = false
      return
    }

    // Phân phối ảnh vào các cột
    distributeImagesToColumns(images)

    page.value++ // Tăng số trang lên
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

function handleCancel() {
  uni.reLaunch({ url: '/' })
}

onMounted(() => {
  fetchImages()
  setupInfiniteScroll()

  // Lấy ID menu từ lịch sử duyệt web
  const menuId = history.state.menuId
  if (menuId) {
    nextTick(() => {
      const targetElement = document.getElementById(menuId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
})
</script>

<template>
  <view class="fixed top-0 left-0 w-full h-12 bg-white flex items-center px-4 shadow z-100">
    <div @click="handleCancel">
      <svg width="27" height="27" viewBox="0 0 32 32">
        <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#000000"></path>
      </svg>
    </div>
    <text class="text-lg font-bold mx-auto">
      Nature
    </text>
  </view>

  <div class="grid grid-cols-2 gap-[1px]">
    <!-- Render từng cột -->
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      class="flex flex-col gap-[1px]"
    >
      <div
        v-for="image in column"
        :key="image.id"
        class="relative overflow-hidden"
      >
        <img
          :src="image.urls.small"
          :alt="image.alt_description"
          class="w-full h-auto object-contain"
          style="max-height: 500px;"
        />
        <div class="absolute bottom-0 left-0 w-full text-white p-2 ">
          <a
            class="font-semibold block"
          >
            {{ image.user.name }}
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Phần tử theo dõi cuộn -->
  <div
    id="scroll-sentinel"
    class="h-10 w-full text-center text-gray-500"
  >
    <span v-if="loading" class="animate-pulse">Đang tải...</span>
    <span v-else-if="!hasMore && columns[0].length > 0">
      Không còn ảnh để tải
    </span>
  </div>
</template>
