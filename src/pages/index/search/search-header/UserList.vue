<script setup>
import { onMounted, ref, watch } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import SearchHeader from './SearchHeader.vue'
import { getUserSearch } from '@/api/unsplash/unsplashAPI'

const searchQuery = ref('')
const users = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)
const scrollPosition = ref(0)
const needToRestore = ref(false)

// Phương thức để lưu vị trí scroll từ trang chi tiết
function setScrollPosition(position) {
  if (position !== undefined) {
    scrollPosition.value = position
    needToRestore.value = true
    console.log('Đã lưu vị trí scroll:', scrollPosition.value)
  }
}

// Công khai phương thức để trang khác có thể gọi
defineExpose({
  setScrollPosition,
})

onLoad((options) => {
  if (options?.query) {
    searchQuery.value = decodeURIComponent(options.query)
    fetchUsers()
  }

  // Kiểm tra nếu có vị trí scroll từ URL
  if (options?.scrollTop) {
    scrollPosition.value = Number.parseInt(options.scrollTop) || 0
    needToRestore.value = true
  }
})

onShow(() => {
  // Kiểm tra vị trí scroll từ storage
  try {
    const savedPosition = uni.getStorageSync('scrollPosition')
    if (savedPosition) {
      scrollPosition.value = Number(savedPosition)
      needToRestore.value = true
      console.log('Đã đọc vị trí scroll từ storage:', scrollPosition.value)
      uni.removeStorageSync('scrollPosition') // Xóa sau khi đã đọc
    }
  }
  catch (e) {
    console.error('Lỗi khi đọc vị trí scroll từ storage:', e)
  }

  // Khôi phục vị trí scroll nếu cần
  if (needToRestore.value) {
    restoreScrollPosition()
  }
})

function restoreScrollPosition(attempts = 0) {
  if (attempts >= 5)
    return // Giới hạn số lần thử

  setTimeout(() => {
    try {
      uni.createSelectorQuery()
        .select('.scroll-container')
        .boundingClientRect((data) => {
          if (data) {
            uni.pageScrollTo({
              scrollTop: scrollPosition.value,
              duration: 0,
            })
            console.log('Đã khôi phục scroll đến:', scrollPosition.value)
            needToRestore.value = false
          }
          else {
            // Thử lại nếu không tìm thấy element
            restoreScrollPosition(attempts + 1)
          }
        })
        .exec()
    }
    catch (error) {
      console.error('Lỗi khi khôi phục scroll với uni API:', error)

      // Phương pháp dự phòng: Sử dụng DOM API
      const scrollContainer = document.querySelector('.scroll-container')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollPosition.value
        console.log('Đã khôi phục scroll với DOM API:', scrollPosition.value)
        needToRestore.value = false
      }
      else if (attempts < 4) {
        restoreScrollPosition(attempts + 1)
      }
    }
  }, 100 * (attempts + 1)) // Tăng thời gian chờ mỗi lần thử
}

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
    }
    else {
      users.value = [...users.value, ...results]
      currentPage.value++
    }
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

// Theo dõi thay đổi searchQuery để tự động gọi lại fetchUsers
watch(searchQuery, () => {
  fetchUsers()
})

function onScroll(event) {
  // Lưu vị trí scroll hiện tại
  scrollPosition.value = event.target.scrollTop

  // Kiểm tra xem có cần tải thêm dữ liệu
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading.value && hasMore.value) {
    fetchUsers(true)
  }
}

function goToUserDetail(user) {
  // Lưu vị trí scroll hiện tại vào storage trước khi chuyển trang
  try {
    uni.setStorageSync('scrollPosition', String(scrollPosition.value))
  }
  catch (e) {
    console.error('Lỗi khi lưu vị trí scroll:', e)
  }

  // Chuyển đến trang chi tiết người dùng
  uni.navigateTo({
    url: `/UserDetail?username=${user.username}`,
  })
}

onMounted(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', onScroll)
    if (needToRestore.value) {
      scrollContainer.scrollTop = scrollPosition.value
    }
  }
})

onUnload(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScroll)
  }
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <SearchHeader v-model="searchQuery" />
    <div class="flex-1 overflow-auto mt-4 scroll-container bg-gray-100" @scroll="onScroll">
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
        <div v-for="user in users" :key="user.id" class="bg-white py-4 px-4 mx-2 my-2 rounded-lg shadow-sm cursor-pointer" @click="goToUserDetail(user)">
          <div class="flex items-center">
            <img :src="user.profile_image?.medium || '/default-avatar.png'" :alt="user.name" class="w-12 h-12 rounded-full mr-4 object-cover" />
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
