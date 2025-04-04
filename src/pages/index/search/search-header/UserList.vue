<script setup>
import { onMounted, ref, watch } from 'vue'
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'
import SearchHeader from './SearchHeader.vue'
import { getUserSearch } from '@/api/unsplash/unsplashAPI'

// Các biến trạng thái
const searchQuery = ref('')
const users = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)
const scrollPosition = ref(0)
const needToRestore = ref(false)

// Các hằng số
const SCROLL_STORAGE_KEY = 'scrollPosition'
const SCROLL_THRESHOLD = 200
const MAX_RESTORE_ATTEMPTS = 5
const RESTORE_DELAY_BASE = 100

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

// Xử lý khi trang được tải
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

  // Đăng ký lắng nghe sự kiện restoreScroll từ trang chi tiết
  uni.$on('restoreScroll', (position) => {
    console.log('Nhận sự kiện restoreScroll với vị trí:', position)
    scrollPosition.value = position
    needToRestore.value = true
    // Đảm bảo đợi DOM render xong trước khi khôi phục vị trí cuộn
    setTimeout(() => {
      restoreScrollPosition()
    }, 100)
  })
})

// Xử lý khi trang được hiển thị
onShow(() => {
  // Đọc vị trí scroll đã lưu
  try {
    const savedPosition = uni.getStorageSync(SCROLL_STORAGE_KEY)
    if (savedPosition) {
      scrollPosition.value = Number(savedPosition)
      needToRestore.value = true
      console.log('Đọc vị trí cuộn từ storage:', savedPosition)

      // Xóa vị trí đã lưu sau khi đã đọc
      uni.removeStorageSync(SCROLL_STORAGE_KEY)
    }
  }
  catch (error) {
    console.error('Lỗi khi đọc vị trí cuộn:', error)
  }

  // Nếu danh sách users rỗng, tải lại dữ liệu
  if (!users.value.length && searchQuery.value) {
    fetchUsers()
  }
  else if (needToRestore.value) {
    // Khôi phục vị trí cuộn sau khi trang đã hiển thị hoàn toàn
    setTimeout(() => {
      restoreScrollPosition()
    }, 300)
  }
})

// Khôi phục vị trí cuộn
function restoreScrollPosition(attempts = 0) {
  if (attempts >= MAX_RESTORE_ATTEMPTS) {
    console.warn('Không thể khôi phục vị trí cuộn sau nhiều lần thử')
    needToRestore.value = false
    return
  }

  // Đảm bảo danh sách users đã được tải
  if (!users.value.length) {
    console.log('Danh sách users chưa sẵn sàng, thử lại sau...')
    setTimeout(() => restoreScrollPosition(attempts + 1), RESTORE_DELAY_BASE * (attempts + 1))
    return
  }

  // Tìm container cuộn
  const scrollContainer = document.querySelector('.scroll-container')
  if (!scrollContainer) {
    console.error('Không tìm thấy container cuộn')
    setTimeout(() => restoreScrollPosition(attempts + 1), RESTORE_DELAY_BASE)
    return
  }

  setTimeout(() => {
    try {
      // Cuộn trực tiếp container thay vì dùng uni.pageScrollTo
      scrollContainer.scrollTop = scrollPosition.value
      console.log('Khôi phục scroll thành công tới:', scrollPosition.value)
      needToRestore.value = false
    }
    catch (err) {
      console.error('Lỗi khi cuộn container:', err)
      setTimeout(() => restoreScrollPosition(attempts + 1), RESTORE_DELAY_BASE)
    }
  }, 100)
}

// Lấy dữ liệu người dùng từ API
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

    if (!results || results.length === 0) {
      hasMore.value = false
    }
    else {
      users.value = [...users.value, ...results]
      currentPage.value++

      // Nếu cần khôi phục vị trí cuộn và đã tải xong dữ liệu lần đầu
      if (needToRestore.value && !isLoadMore) {
        setTimeout(() => restoreScrollPosition(), 100)
      }
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

// Xử lý sự kiện cuộn
function onScroll(event) {
  // Lưu vị trí scroll hiện tại
  scrollPosition.value = event.target.scrollTop

  // Kiểm tra xem có cần tải thêm dữ liệu
  const { scrollTop, scrollHeight, clientHeight } = event.target
  if (scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD && !isLoading.value && hasMore.value) {
    fetchUsers(true)
  }
}

// Lưu vị trí cuộn và chuyển đến trang chi tiết
function goToUserDetail(user) {
  // Lấy container cuộn
  const scrollContainer = document.querySelector('.scroll-container')
  if (!scrollContainer) {
    console.error('Không tìm thấy container cuộn')
    return
  }

  // Lưu vị trí cuộn hiện tại
  const currentScrollPosition = scrollContainer.scrollTop

  try {
    uni.setStorageSync(SCROLL_STORAGE_KEY, currentScrollPosition)
    console.log('Lưu vị trí cuộn khi chuyển:', currentScrollPosition)
  }
  catch (error) {
    console.error('Lỗi lưu vị trí cuộn:', error)
  }

  // Chuyển đến trang chi tiết
  uni.navigateTo({
    url: `/UserDetail?username=${user.username}&scrollTop=${currentScrollPosition}`,
  })
}

// Theo dõi thay đổi searchQuery để tự động gọi lại fetchUsers
watch(searchQuery, () => {
  fetchUsers()
})

// Khởi tạo các sự kiện khi component được mount
onMounted(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', onScroll)
  }

  // Khôi phục vị trí cuộn sau khi DOM sẵn sàng
  if (needToRestore.value) {
    setTimeout(() => {
      restoreScrollPosition()
    }, 300)
  }
})

// Dọn dẹp khi component bị hủy
onUnload(() => {
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', onScroll)
  }

  // Hủy đăng ký lắng nghe sự kiện
  uni.$off('restoreScroll')
})
</script>

<template>
  <div class="flex flex-col h-screen">
    <SearchHeader v-model="searchQuery" />

    <div class="flex-1 overflow-auto mt-4 scroll-container bg-[#111111]" @scroll="onScroll">
      <!-- Trạng thái đang tải ban đầu -->
      <div v-if="isLoading && !users.length" class="text-center p-4 text-white">
        <span class="animate-pulse">Đang tải...</span>
      </div>

      <!-- Trạng thái lỗi -->
      <div v-else-if="errorMessage" class="text-center p-4 text-red-500">
        {{ errorMessage }}
      </div>

      <!-- Trạng thái không có dữ liệu -->
      <div v-else-if="users.length === 0" class="text-center p-4 text-white">
        Không tìm thấy người dùng nào.
      </div>

      <!-- Danh sách người dùng -->
      <div v-else class="p-2">
        <div
          v-for="user in users"
          :id="`user-${user.id}`"
          :key="user.id"
          class="bg-[#222222] py-4 px-4 my-2 rounded-lg shadow-sm cursor-pointer"
          @click="goToUserDetail(user)"
        >
          <div class="flex items-center">
            <img
              :src="user.profile_image?.medium || '/default-avatar.png'"
              :alt="user.name"
              class="w-12 h-12 rounded-full mr-4 object-cover"
            />
            <div class="flex-1">
              <h3 class="font-bold text-lg text-white">
                {{ user.name }}
              </h3>
              <p class="text-white text-sm">
                {{ user.username }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Trạng thái đang tải thêm -->
      <div v-if="isLoading && users.length > 0" class="text-center p-4 text-gray-400">
        <span class="animate-pulse">Đang tải thêm...</span>
      </div>
    </div>
  </div>
</template>
