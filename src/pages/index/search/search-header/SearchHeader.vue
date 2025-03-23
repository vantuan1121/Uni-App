<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import search from '@/static/tabbar/search.png'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue || '')
const isSearching = ref(false) // Kiểm soát hiển thị lịch sử & trending
const searchHistory = ref([])
const trendingSearches = ref(['Nature', 'Technology', 'Art', 'Animals', 'Travel'])

const searchBox = ref(null) // Tham chiếu đến ô tìm kiếm

// Theo dõi modelValue
watch(() => props.modelValue, (newVal) => {
  searchQuery.value = newVal
  isSearching.value = !!newVal
})

onMounted(() => {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || []
  searchHistory.value = history

  // Lắng nghe sự kiện click ngoài ô tìm kiếm
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Lưu lịch sử tìm kiếm
function saveSearchQuery(query) {
  if (!query.trim())
    return
  const history = new Set([query, ...searchHistory.value])
  searchHistory.value = Array.from(history).slice(0, 5)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// Xóa lịch sử tìm kiếm
function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

// Xóa ô tìm kiếm

function clearSearch() {
  searchQuery.value = '' // Xóa nội dung ô tìm kiếm nhưng không ảnh hưởng đến trạng thái tìm kiếm
  isSearching.value = true // Giữ giao diện tìm kiếm hiển thị

  nextTick(() => {
    document.querySelector('input').focus() // Giữ lại focus cho input
  })
}

// Điều hướng đến trang tìm kiếm
function handleCancel() {
  uni.reLaunch({ url: '/' })
}

// Xử lý tìm kiếm khi nhấn Enter
function handleSearch(event) {
  if (event.key === 'Enter' && searchQuery.value.trim()) {
    saveSearchQuery(searchQuery.value)
    uni.navigateTo({
      url: `/pages/index/search/search-header/ImageSearch?query=${encodeURIComponent(searchQuery.value)}`,
    })
    isSearching.value = false // Ẩn lịch sử sau khi tìm kiếm
  }
}

// Khi focus vào ô tìm kiếm
function handleFocus() {
  isSearching.value = true
}

// Khi chọn từ khóa từ lịch sử hoặc trending
function selectSearch(query) {
  searchQuery.value = query
  emit('update:modelValue', query)
  handleSearch({ key: 'Enter' })
}

// Đóng danh sách khi click ngoài ô tìm kiếm
function handleClickOutside(event) {
  if (searchBox.value && !searchBox.value.contains(event.target)) {
    isSearching.value = false
  }
}
</script>

<template>
  <div ref="searchBox" class="flex flex-col w-full gap-3 ">
    <div class="flex items-center w-full gap-3 fixed top-9 left-0 right-0 bg-white p-3  z-50">
      <!-- Ô tìm kiếm -->
      <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 flex-grow relative">
        <img :src="search" alt="search" class="w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search photos, collections, users"
          class="flex-1 bg-transparent outline-none text-sm"
          @focus="handleFocus"
          @keydown.enter="handleSearch"
        />
        <span
          v-if="searchQuery"
          class="absolute right-3 cursor-pointer text-gray-500"
          @click.stop="clearSearch"
        >
          ☒
        </span>
      </div>
      <span
        v-if="isSearching"
        class="text-gray-500 text-sm cursor-pointer"
        @click="handleCancel"
      >
        Cancel
      </span>
    </div>

    <!-- Lịch sử tìm kiếm -->
    <div v-if="isSearching && searchHistory.length" class="mt-[50px]">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Recent
        </h3>
        <span class="text-sm text-gray-500 cursor-pointer translate-x-[-20px] translate-y-[-5px]" @click.stop="clearHistory">
          Clear
        </span>
      </div>
      <ul class="flex flex-col gap-2">
        <li
          v-for="query in searchHistory"
          :key="query"
          class="flex items-center gap-2 cursor-pointer px-3 py-2 text-black font-bold rounded-md"
          @click="selectSearch(query)"
        >
          <span>🔍</span> {{ query }}
        </li>
      </ul>
    </div>

    <!-- Xu hướng tìm kiếm -->
    <div v-if="isSearching" class="mt-[50px]">
      <h3 class="text-sm font-semibold text-gray-600 mb-2">
        Trending
      </h3>
      <ul class="flex flex-col gap-2">
        <li
          v-for="trend in trendingSearches"
          :key="trend"
          class="flex items-center gap-2 cursor-pointer px-3 py-2 text-black font-bold rounded-md"
          @click="selectSearch(trend)"
        >
          <span>📈</span> {{ trend }}
        </li>
      </ul>
    </div>
  </div>
</template>
