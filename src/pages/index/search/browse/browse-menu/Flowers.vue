<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { getImageSearch } from '@/api/unsplash/unsplashAPI'

const leftColumn = ref([])
const rightColumn = ref([])
const query = 'Flowers'
const perPage = 30
const page = ref(1) // Bắt đầu từ trang 1
const loading = ref(false) // Trạng thái tải ảnh

async function fetchImages() {
  if (loading.value)
    return
  loading.value = true

  const images = await getImageSearch(query, page.value, perPage)

  images.forEach((image, index) => {
    if (index % 2 === 0) {
      leftColumn.value.push(image)
    }
    else {
      rightColumn.value.push(image)
    }
  })

  page.value++ // Tăng số trang lên
  loading.value = false
}

// Thiết lập cuộn vô hạn
function setupInfiniteScroll() {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
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
      Flowers
    </text>
  </view>

  <div class="grid grid-cols-2 gap-[1px]">
    <!-- Cột trái -->
    <div class="flex flex-col gap-[1px]">
      <div v-for="(image, index) in leftColumn" :key="index" class="relative">
        <img :src="image.urls.small" :alt="image.alt_description" class="shadow-md w-full object-cover" />
        <div class="absolute bottom-0 left-0 w-full text-white p-2 rounded-b-lg">
          <a :href="image.user.links.html" target="_blank" class="font-semibold block">
            {{ image.user.name }}
          </a>
        </div>
      </div>
    </div>

    <!-- Cột phải -->
    <div class="flex flex-col gap-[1px]">
      <div v-for="(image, index) in rightColumn" :key="index" class="relative">
        <img :src="image.urls.small" :alt="image.alt_description" class="shadow-md w-full object-cover" />
        <div class="absolute bottom-0 left-0 w-full text-white p-2 rounded-b-lg">
          <a :href="image.user.links.html" target="_blank" class="font-semibold block">
            {{ image.user.name }}
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Phần tử theo dõi cuộn -->
  <div id="scroll-sentinel" class="h-10 w-full text-center text-gray-500">
    <span v-if="loading"></span>
  </div>
</template>
