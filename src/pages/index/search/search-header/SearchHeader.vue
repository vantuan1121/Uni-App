<script setup>
import { ref } from 'vue'
import search from '@/static/tabbar/search.png'

const searchQuery = ref('')
const isSearching = ref(false)

function clearSearch() {
  searchQuery.value = ''
  isSearching.value = false
}

// Điều hướng khi nhấn Enter
function handleSearch(event) {
  if (event.key === 'Enter' && searchQuery.value.trim()) {
    uni.navigateTo({
      url: `/pages/index/search/search-header/ImageSearch?query=${encodeURIComponent(searchQuery.value)}`,
    })
  }
}
</script>

<template>
  <div class="flex items-center w-full">
    <!-- Ô tìm kiếm -->
    <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 flex-1 transition-all duration-300">
      <img :src="search" alt="search" class="w-5 h-5" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search photos, collections, users"
        class="flex-1 bg-transparent outline-none text-sm"
        @focus="isSearching = true"
        @blur="isSearching = searchQuery.length > 0"
        @keydown.enter="handleSearch"
      />
    </div>

    <!-- Hiệu ứng xuất hiện cho nút Cancel -->
    <transition name="fade-slide">
      <button
        v-if="isSearching"
        class="ml-2 text-gray-500 text-sm transition-all duration-300"
        @click="clearSearch"
      >
        Cancel
      </button>
    </transition>
  </div>
</template>

<style>
/* Hiệu ứng cho nút Cancel */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
