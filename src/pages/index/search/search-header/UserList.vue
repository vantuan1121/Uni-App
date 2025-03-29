<script setup>
import { onMounted, ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import SearchHeader from './SearchHeader.vue'
import { getUserSearch } from '@/api/unsplash/unsplashAPI'

const searchQuery = ref('')
const users = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

onLoad((options) => {
  if (options?.query) {
    searchQuery.value = decodeURIComponent(options.query)
    fetchUsers()
  }
})

async function fetchUsers(isLoadMore = false) {
  if (!searchQuery.value.trim() || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    users.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    const results = await getUserSearch(searchQuery.value, currentPage.value)

    if (results.length === 0) {
      hasMore.value = false
      return
    }

    const newUsers = [...users.value, ...results]
    users.value = newUsers

    currentPage.value++
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    errorMessage.value = 'Không thể tải người dùng. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

watch(searchQuery, () => {
  fetchUsers()
})

function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchUsers(true)
  }
}

onMounted(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <SearchHeader v-model="searchQuery" />

    <div class="flex-1 overflow-auto mt-{15px} scroll-container bg-gray-100">
      <div v-if="isLoading && !users.length" class="text-center text-gray-500">
        <span class="animate-pulse">Đang tải...</span>
      </div>
      <div v-else-if="errorMessage" class="text-center text-red-500">
        {{ errorMessage }}
      </div>
      <div v-else-if="users.length === 0" class="text-center">
        Không tìm thấy người dùng nào.
      </div>

      <div v-else>
        <div
          v-for="user in users"
          :key="user.id"
          class="bg-white py-4 px-4 mx-2 my-2 rounded-lg shadow-sm"
        >
          <div class="flex items-center">
            <!-- Avatar -->
            <img
              :src="user.profile_image?.medium || '/default-avatar.png'"
              :alt="user.name"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            />

            <!-- Thông tin người dùng -->
            <div class="flex-1">
              <h3 class="font-bold text-lg">
                {{ user.name }}
              </h3>
              <p class="text-gray-600 text-sm">
                @{{ user.username }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading && users.length > 0" class="text-center text-gray-500 py-4">
        <span class="animate-pulse">Đang tải thêm...</span>
      </div>
    </div>
  </div>
</template>
