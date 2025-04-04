<script setup>
import { computed, defineAsyncComponent, markRaw, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// Import các component tab từ đường dẫn tuyệt đối
const Photos = defineAsyncComponent(() => import('@/pages/index/search/search-header/user-details/Photos.vue'))
const Likes = defineAsyncComponent(() => import('@/pages/index/search/search-header/user-details/Likes.vue'))
const Collections = defineAsyncComponent(() => import('@/pages/index/search/search-header/user-details/Collections.vue'))

// Hoặc nếu đang ở cùng thư mục user-details, bạn có thể dùng import tương đối:
// const Photos = defineAsyncComponent(() => import('./Photos.vue'))
// const Likes = defineAsyncComponent(() => import('./Likes.vue'))
// const Collections = defineAsyncComponent(() => import('./Collections.vue'))

// Mapping tab name với component tương ứng
const tabComponents = {
  Photos: markRaw(Photos),
  Likes: markRaw(Likes),
  Collections: markRaw(Collections),
}

const tabs = ref(['Photos', 'Likes', 'Collections'])
const activeTab = ref('Photos')
const searchQuery = ref('')
const tabWidth = ref(0)
const tabBarRef = ref(null)

// Tính chiều rộng của mỗi tab dựa trên chiều rộng tổng và số lượng tab
function calculateTabWidth() {
  if (tabBarRef.value) {
    const containerWidth = tabBarRef.value.offsetWidth
    tabWidth.value = containerWidth / tabs.value.length
  }
}

// Tính toán vị trí transform cho nền trượt
const slideTransform = computed(() => {
  const tabIndex = tabs.value.findIndex(tab => tab === activeTab.value)
  return `translateX(${tabIndex * tabWidth.value}px)`
})

// Component hiện tại dựa trên tab đang active
const currentComponent = computed(() => {
  return tabComponents[activeTab.value]
})

// Lắng nghe sự kiện resize của cửa sổ
function setupResizeListener() {
  calculateTabWidth()
  window.addEventListener('resize', calculateTabWidth)

  // Tính toán lại khi component được mount
  setTimeout(calculateTabWidth, 0)
}

onLoad((options) => {
  if (options.query) {
    searchQuery.value = decodeURIComponent(options.query)
  }

  // Thiết lập resize listener sau khi component được load
  setupResizeListener()
})

// Hàm kiểm tra hiển thị thanh ngăn cách
function shouldShowSeparator(tabIndex) {
  if (activeTab.value === 'Photos' && tabIndex === 0) {
    return false // Ẩn thanh giữa Photos và Collections
  }
  if (activeTab.value === 'Collections' && tabIndex === 1) {
    return false // Ẩn thanh giữa Collections và Users
  }
  if (activeTab.value === 'Likes') {
    return false // Ẩn cả 2 thanh khi ở Likes
  }
  return true
}
</script>

<template>
  <div class="flex flex-col h-screen bg-[#111111]">
    <!-- TabBar cố định trên cùng với khoảng cách 20px mỗi bên -->
    <div class=" left-0 w-full bg-black px-5">
      <div class="flex justify-center items-center py-2">
        <div
          ref="tabBarRef"
          class="relative inline-flex bg-[#555555] text-white rounded-lg shadow-lg w-full"
        >
          <!-- Nền trượt -->
          <div
            class="absolute bg-[#888888] rounded-lg transition-all duration-300 ease-in-out h-8"
            :style="{
              width: `${tabWidth}px`,
              transform: slideTransform,
            }"
          ></div>
          <!-- Các tab -->
          <div
            v-for="(tab, tabIndex) in tabs"
            :key="tab"
            class="flex items-center z-10 flex-1"
          >
            <div
              class="px-2 py-2 text-center cursor-pointer transition-all rounded-lg h-8 flex items-center justify-center relative z-20 w-full"
              @click="activeTab = tab"
            >
              {{ tab }}
            </div>

            <!-- Thanh ngăn cách -->
            <div
              v-if="tabIndex < tabs.length - 1 && shouldShowSeparator(tabIndex)"
              class="w-px h-6 bg-white/30"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần nội dung -->
    <div class="flex-1 overflow-auto">
      <component :is="currentComponent" :search-query="searchQuery" />
    </div>
  </div>
</template>
