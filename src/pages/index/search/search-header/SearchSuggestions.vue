<script setup>
import search from '@/static/tabbar/search.png'

defineProps({
  searchHistory: Array,
  trendingSearches: Array,
})

const emit = defineEmits(['selectSearch', 'clearHistory'])
</script>

<template>
  <div
    v-if="searchHistory.length || trendingSearches.length"
    class="fixed inset-0 bg-white z-40 overflow-auto max-h-screen px-4 pt-[100px]"
  >
    <!-- Lịch sử tìm kiếm -->
    <div class="h-20px"></div>
    <div v-if="searchHistory.length" class="">
      <div class="flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-600 mb-2">
          Recent
        </h3>
        <span
          class="text-sm text-gray-500 cursor-pointer translate-y-[-5px]"
          @click.stop="emit('clearHistory')"
        >
          Clear
        </span>
      </div>
      <ul class="flex flex-col">
        <li
          v-for="query in searchHistory"
          :key="query"
          class="flex items-center gap-2 cursor-pointer px-3 py-2 text-black font-bold border-b border-gray-300"
          @click="emit('selectSearch', query)"
        >
          <span>
            <img :src="search" alt="search" class="w-5 h-5" />
          </span>
          {{ query }}
        </li>
      </ul>
    </div>

    <!-- Xu hướng tìm kiếm -->
    <div v-if="trendingSearches.length" class="mt-[10px]">
      <h3 class="text-sm font-semibold text-gray-600 mb-2">
        Trending
      </h3>
      <ul class="flex flex-col">
        <li
          v-for="trend in trendingSearches"
          :key="trend"
          class="flex items-center gap-2 cursor-pointer px-3 py-2 text-black font-bold border-b border-gray-300"
          @click="emit('selectSearch', trend)"
        >
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="false">
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6Z"></path>
            </svg>
          </span>
          {{ trend }}
        </li>
      </ul>
    </div>
  </div>
</template>
