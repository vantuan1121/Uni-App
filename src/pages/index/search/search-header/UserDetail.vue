<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TabBarUser from './TabBarUser.vue'
import { getUserProfile } from '@/api/unsplash/unsplashAPI'

// Các biến trạng thái
const username = ref(null)
const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const scrollPosition = ref(0)
const headerOpacity = ref(0)

// Các hằng số
const MAX_SCROLL_HEIGHT = 225
const SCROLL_STORAGE_KEY = 'scrollPosition'
const HEADER_OPACITY_THRESHOLD = 100

// Các tham chiếu DOM
const headerRef = ref(null)
const profileInfoRef = ref(null)
const containerRef = ref(null)

// Giá trị tính toán
const displayName = computed(() => {
  if (!user.value)
    return ''
  return user.value.name || user.value.username || ''
})

// Khởi tạo trang
onLoad(async (options) => {
  if (options?.username) {
    username.value = options.username
    if (options?.scrollTop) {
      scrollPosition.value = Number(options.scrollTop || 0)
    }
    await fetchUserDetail()
  }
})

// Tải thông tin chi tiết người dùng
async function fetchUserDetail() {
  if (!username.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  try {
    const userData = await getUserProfile(username.value)
    user.value = userData
  }
  catch (error) {
    console.error('Lỗi khi tải chi tiết người dùng:', error)
    errorMessage.value = 'Không thể tải thông tin người dùng!'
  }
  finally {
    isLoading.value = false
  }
}

// Xử lý sự kiện cuộn trang
function handleScroll() {
  if (!headerRef.value)
    return

  const scrollDistance = window.scrollY

  // Giới hạn vị trí cuộn đến mức tối đa
  if (scrollDistance > MAX_SCROLL_HEIGHT) {
    window.scrollTo(0, MAX_SCROLL_HEIGHT)
    scrollPosition.value = MAX_SCROLL_HEIGHT
    headerOpacity.value = 1
    return
  }

  // Tính toán độ mờ của header
  headerOpacity.value = Math.min(scrollDistance / HEADER_OPACITY_THRESHOLD, 1)
  scrollPosition.value = scrollDistance
}

// Quay lại trang trước
function goBack() {
  try {
    // Lưu vị trí cuộn hiện tại vào storage
    uni.setStorageSync(SCROLL_STORAGE_KEY, scrollPosition.value)
    console.log('Đã lưu vị trí cuộn vào bộ nhớ:', scrollPosition.value)
  }
  catch (error) {
    console.error('Lỗi khi lưu vị trí cuộn:', error)
  }

  // Phát sự kiện restoreScroll trước khi điều hướng
  uni.$emit('restoreScroll', scrollPosition.value)
  console.log('Đã phát sự kiện restoreScroll với giá trị:', scrollPosition.value)

  // Chờ một chút để đảm bảo sự kiện được xử lý
  setTimeout(() => {
    uni.navigateBack({
      delta: 1,
      animationType: 'pop-out',
      fail: () => {
        console.log('Không thể quay lại, chuyển về trang chủ')
        uni.switchTab({ url: '/pages/index/index' })
      },
    })
  }, 50)
}

// Đăng ký và hủy đăng ký sự kiện cuộn
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- Phần template giữ nguyên như cũ -->
  <div ref="containerRef">
    <div class="content-wrapper">
      <div class="flex flex-col h-[275px] bg-[#222222] text-white">
        <!-- Header với nút quay lại và tên tác giả -->
        <div
          ref="headerRef"
          class="fixed-header fixed top-0 w-full h-[50px] flex items-center z-10"
          :style="{
            backgroundColor: `rgba(0, 0, 0, ${headerOpacity})`,
            transition: 'background-color 0.2s ease',
          }"
        >
          <!-- Nút back -->
          <button class="!bg-transparent !shadow-none !outline-none ml-0" @click="goBack">
            <svg width="27" height="27" viewBox="0 0 32 32" fill="white">
              <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="white"></path>
            </svg>
          </button>

          <!-- Tên tác giả -->
          <div
            v-if="displayName"
            class="absolute left-1/2 transform -translate-x-1/2 text-white font-medium transition-opacity duration-200"
            :style="{
              opacity: headerOpacity,
              fontWeight: 400 + (headerOpacity * 300),
            }"
          >
            {{ displayName }}
          </div>
        </div>

        <!-- Thông tin người dùng -->
        <div
          ref="profileInfoRef"
          class="flex flex-col px-2 mt-[70px]"
        >
          <!-- Trạng thái đang tải -->
          <div v-if="isLoading" class="flex-1 flex">
            <span class="animate-pulse text-xs">Đang tải thông tin...</span>
          </div>

          <!-- Trạng thái lỗi -->
          <div v-else-if="errorMessage" class="flex-1 flex text-red-500 text-xs">
            {{ errorMessage }}
          </div>

          <!-- Hiển thị thông tin người dùng -->
          <template v-else-if="user">
            <!-- Ảnh đại diện -->
            <div class="flex mb-2">
              <img
                v-if="user.profile_image?.large"
                :src="user.profile_image.large"
                :alt="displayName"
                class="w-12 h-12 rounded-full object-cover"
              />
              <div v-else class="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                {{ (user.username || '?').charAt(0).toUpperCase() }}
              </div>
            </div>

            <!-- Tên hiển thị -->
            <div class="mb-2">
              <h1 class="text-xl font-bold">
                {{ displayName }}
              </h1>
            </div>

            <!-- Địa điểm -->
            <div v-if="user.location" class="flex items-center text-gray-400 mb-1 mt-[10px]">
              <div class="flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                  <path d="M5.988 15.637C7.313 17.596 9.317 19.717 12 22c2.683-2.283 4.688-4.404 6.013-6.363C19.338 13.679 20 11.867 20 10.2c0-2.5-.804-4.492-2.413-5.975C15.979 2.742 14.117 2 12 2c-2.117 0-3.979.742-5.587 2.225C4.804 5.708 4 7.7 4 10.2c0 1.667.663 3.479 1.988 5.437ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                </svg>
              </div>
              <span class="text-sm -mt-[7px] ml-1 overflow-hidden text-ellipsis">
                {{ user.location }}
              </span>
            </div>

            <!-- Website -->
            <div v-if="user.portfolio_url" class="flex items-center text-gray-400 mt-[5px]">
              <div class="flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"></path>
                </svg>
              </div>
              <span class="text-sm -mt-[7px] ml-1 overflow-hidden text-ellipsis">
                {{ user.portfolio_url }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Tab Bar -->
      <div>
        <div class="tab-bar-container">
          <TabBarUser :username="username" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  position: relative;
  height: 100%;
}

.fixed-header {
  transition: all 0.2s ease;
}

.tab-bar-container {
  z-index: 1;
}
</style>
