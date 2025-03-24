<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import SearchSuggestions from '@/pages/index/search/search-header/SearchSuggestions.vue'
import search from '@/static/tabbar/search.png'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref(props.modelValue || '')
const isSearching = ref(false)
const searchHistory = ref([])
const trendingSearches = ref(['Nature', 'Technology', 'Art', 'Animals', 'Travel'])

const searchBox = ref(null)

watch(() => props.modelValue, (newVal) => {
  searchQuery.value = newVal
  isSearching.value = !!newVal
})

onMounted(() => {
  searchHistory.value = JSON.parse(localStorage.getItem('searchHistory')) || []
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

function saveSearchQuery(query) {
  if (!query.trim())
    return
  const history = new Set([query, ...searchHistory.value])
  searchHistory.value = Array.from(history).slice(0, 5)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

function clearHistory() {
  searchHistory.value = []
  localStorage.removeItem('searchHistory')
}

function clearSearch() {
  searchQuery.value = ''
  isSearching.value = true

  nextTick(() => {
    document.querySelector('input').focus()
  })
}

function handleCancel() {
  uni.reLaunch({ url: '/' })
}

function handleSearch(event) {
  if (event.key === 'Enter' && searchQuery.value.trim()) {
    saveSearchQuery(searchQuery.value)
    uni.navigateTo({
      url: `/pages/index/search/search-header/ImageSearch?query=${encodeURIComponent(searchQuery.value)}`,
    })
    isSearching.value = false
  }
}

function handleFocus() {
  isSearching.value = true
}

function selectSearch(query) {
  searchQuery.value = query
  emit('update:modelValue', query)
  handleSearch({ key: 'Enter' })
}

function handleClickOutside(event) {
  if (searchBox.value && !searchBox.value.contains(event.target)) {
    isSearching.value = false
  }
}
</script>

<template>
  <div ref="searchBox" class="flex flex-col w-full gap-3">
    <div class="flex items-center w-full gap-3 fixed top-0 left-0 right-0 bg-white p-3 z-50">
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
        <span v-if="searchQuery" class="absolute right-3 cursor-pointer text-gray-500" @click.stop="clearSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
          </svg>
        </span>
      </div>
      <span v-if="isSearching" class="text-gray-500 text-sm cursor-pointer" @click="handleCancel">
        Cancel
      </span>
    </div>

    <!-- Component SearchSuggestions -->
    <SearchSuggestions
      v-if="isSearching"
      :search-history="searchHistory"
      :trending-searches="trendingSearches"
      @select-search="selectSearch"
      @clear-history="clearHistory"
    />
  </div>
</template>
