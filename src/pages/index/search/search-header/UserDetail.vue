<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TabBarUser from './TabBarUser.vue'
import { getUserProfile } from '@/api/unsplash/unsplashAPI'

defineProps({
  username: String,
})

const username = ref(null)
const user = ref(null)
const isLoading = ref(true)
const errorMessage = ref('')
const scrollPosition = ref(0)
const headerOpacity = ref(0)

onLoad(async (options) => {
  if (options?.username) {
    username.value = options.username
    scrollPosition.value = Number(options.scrollTop || 0)
    await fetchUserDetail()
  }
})

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

function goBack() {
  try {
    uni.setStorageSync('scrollPosition', scrollPosition.value)
    console.log('Đã lưu vị trí scroll vào storage:', scrollPosition.value)
  }
  catch (e) {
    console.error('Lỗi khi lưu vị trí scroll:', e)
  }
  uni.navigateBack({
    delta: 1,
    fail: (err) => {
      console.error('Lỗi khi navigateBack:', err)
      uni.switchTab({ url: '/pages/index/index' })
    },
  })
}

const tabBarRef = ref(null)
const headerRef = ref(null)
const profileInfoRef = ref(null)

const displayName = computed(() => {
  if (!user.value)
    return ''
  return user.value.name || user.value.username || ''
})

function handleScroll() {
  if (!headerRef.value || !profileInfoRef.value)
    return

  const scrollDistance = window.scrollY
  headerOpacity.value = Math.min(scrollDistance / 100, 1) // Tăng opacity trong 100px đầu
  scrollPosition.value = scrollDistance
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="">
    <div class="content-wrapper">
      <div class="flex flex-col h-[260px] bg-[#222222] text-white">
        <!-- Nút quay lại và tên tác giả -->
        <div
          ref="headerRef"
          class="fixed-button fixed top-0 w-full h-[50px] flex items-center z-10"
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

        <!-- Phần thông tin profile -->
        <div v-if="isLoading" ref="profileInfoRef" class="flex-1 flex">
          <span class="animate-pulse text-xs"></span>
        </div>
        <div v-else-if="errorMessage" ref="profileInfoRef" class="flex-1 flex text-red-500 text-xs">
          {{ errorMessage }}
        </div>
        <div v-else-if="user" ref="profileInfoRef" class="flex flex-col px-2 mt-[70px]">
          <div class="flex mb-2">
            <img
              v-if="user.profile_image?.large"
              :src="user.profile_image.large"
              :alt="user.name || user.username"
              class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 rounded-full bg-gray-700 flex text-xs">
              {{ (user.username || '?').charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="mb-2">
            <h1 class="text-xl font-bold">
              {{ displayName }}
            </h1>
          </div>
          <div v-if="user.location" class="flex items-center text-gray-400 mb-1 mt-[10px]">
            <div class="flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                <path d="M5.988 15.637C7.313 17.596 9.317 19.717 12 22c2.683-2.283 4.688-4.404 6.013-6.363C19.338 13.679 20 11.867 20 10.2c0-2.5-.804-4.492-2.413-5.975C15.979 2.742 14.117 2 12 2c-2.117 0-3.979.742-5.587 2.225C4.804 5.708 4 7.7 4 10.2c0 1.667.663 3.479 1.988 5.437ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
              </svg>
            </div>
            <span class="text-sm -mt-[7px] ml-1 overflow-hidden text-ellipsis">{{ user.location }}</span>
          </div>
          <div v-if="user.portfolio_url" class="flex items-center text-gray-400 mt-[5px]">
            <div class="flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93Zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39Z"></path>
              </svg>
            </div>
            <span class="text-sm -mt-[7px] ml-1 overflow-hidden text-ellipsis">{{ user.portfolio_url }}</span>
          </div>
        </div>
      </div>

      <div ref="tabBarRef">
        <TabBarUser :username="username" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.content-wrapper {
  position: relative;
  height: 100%;
}

.fixed-button {
  transition: all 0.2s ease;
}
</style>
