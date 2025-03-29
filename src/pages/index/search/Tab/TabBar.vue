<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import ImageSearch from '@/pages/index/search/search-header/ImageSearch.vue'
import CollectionList from '@/pages/index/search/search-header/CollectionList.vue'
import UserList from '@/pages/index/search/search-header/UserList.vue'

const tabs = ref(['Photos', 'Collections', 'Users'])
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
  if (activeTab.value === 'Users' && tabIndex === 1) {
    return false // Ẩn thanh giữa Collections và Users
  }
  if (activeTab.value === 'Collections') {
    return false // Ẩn cả 2 thanh khi ở Collections
  }
  return true
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <!-- TabBar cố định trên cùng với khoảng cách 20px mỗi bên -->
    <div class="fixed mt-4 left-0 w-full z-30 bg-white px-5">
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

    <!-- Nội dung có thể cuộn -->
    <div class="mt-16 flex-1 overflow-auto">
      <ImageSearch v-if="activeTab === 'Photos'" :query="searchQuery" />
      <CollectionList v-else-if="activeTab === 'Collections'" :query="searchQuery" />
      <UserList v-else-if="activeTab === 'Users'" :query="searchQuery" />
    </div>
  </div>
</template>
