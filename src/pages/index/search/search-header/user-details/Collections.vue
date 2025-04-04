<script setup>
import { onMounted, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getCollectionPhotos, getUserCollections } from '@/api/unsplash/unsplashAPI' // Giả định có API này
import PhotoActions from '@/components/PhotoActions.vue'

defineProps({
  searchQuery: String, // Nhận từ TabBarUser, có thể không dùng
})

const username = ref('')
const collections = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const currentPage = ref(1)
const hasMore = ref(true)

// Biến mới để hiển thị chi tiết bộ sưu tập
const selectedCollection = ref(null)
const collectionPhotos = ref([])
const isLoadingPhotos = ref(false)
const photosPage = ref(1)
const hasMorePhotos = ref(true)
const isFullscreenMode = ref(false) // Biến để kiểm soát chế độ toàn màn hình

// Biến mới để xem chi tiết ảnh
const selectedPhotoIndex = ref(-1)
const isPhotoDetailMode = ref(false)
const photoViewPosition = ref(0) // Lưu vị trí scroll khi xem chi tiết ảnh

// Thêm biến để lưu vị trí scroll
const savedScrollPosition = ref(0)

// Biến để theo dõi thao tác vuốt
const touchStartX = ref(0)
const touchEndX = ref(0)

onLoad((options) => {
  if (options?.username) {
    username.value = options.username
    fetchCollections()
  }
})

async function fetchCollections(isLoadMore = false) {
  if (!username.value || isLoading.value)
    return

  isLoading.value = true
  errorMessage.value = ''

  if (!isLoadMore) {
    collections.value = []
    currentPage.value = 1
    hasMore.value = true
  }

  try {
    // Gọi API để lấy danh sách collections của user
    const results = await getUserCollections(username.value, currentPage.value)
    if (results.length === 0) {
      hasMore.value = false
    }
    else {
      collections.value = [...collections.value, ...results]
      currentPage.value++
    }
  }
  catch (error) {
    console.error('Lỗi khi tải danh sách bộ sưu tập:', error)
    errorMessage.value = 'Không thể tải bộ sưu tập. Vui lòng thử lại!'
    hasMore.value = false
  }
  finally {
    isLoading.value = false
  }
}

// Hàm để xem ảnh trong bộ sưu tập
async function viewCollection(collection) {
  // Lưu vị trí scroll trước khi chuyển view
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    savedScrollPosition.value = scrollContainer.scrollTop
  }

  selectedCollection.value = collection
  collectionPhotos.value = []
  photosPage.value = 1
  hasMorePhotos.value = true
  isFullscreenMode.value = true // Bật chế độ toàn màn hình
  isPhotoDetailMode.value = false // Đảm bảo tắt chế độ xem chi tiết ảnh

  await fetchCollectionPhotos()

  // Ẩn tabbar - thêm code tương tác với DOM để ẩn thanh tabbar
  const tabbarElement = document.querySelector('.tabbar') // Thay bằng class thực tế của tabbar
  if (tabbarElement) {
    tabbarElement.style.display = 'none'
  }

  // Hoặc sử dụng API của uni-app nếu có sẵn
  // uni.hideTabBar()
}

// Hàm để tải ảnh trong bộ sưu tập
async function fetchCollectionPhotos(isLoadMore = false) {
  if (!selectedCollection.value || isLoadingPhotos.value)
    return

  isLoadingPhotos.value = true

  if (!isLoadMore) {
    collectionPhotos.value = []
    photosPage.value = 1
    hasMorePhotos.value = true
  }

  try {
    const photos = await getCollectionPhotos(selectedCollection.value.id, photosPage.value)

    if (photos.length === 0) {
      hasMorePhotos.value = false
      return
    }

    collectionPhotos.value = [...collectionPhotos.value, ...photos]
    photosPage.value++
  }
  catch (error) {
    console.error('Lỗi khi tải ảnh bộ sưu tập:', error)
    errorMessage.value = 'Không thể tải ảnh. Vui lòng thử lại!'
    hasMorePhotos.value = false
  }
  finally {
    isLoadingPhotos.value = false
  }
}

// Hàm để quay lại danh sách bộ sưu tập
function backToCollections() {
  selectedCollection.value = null
  collectionPhotos.value = []
  isFullscreenMode.value = false // Tắt chế độ toàn màn hình
  isPhotoDetailMode.value = false // Đảm bảo tắt chế độ xem chi tiết ảnh

  // Hiện lại tabbar
  const tabbarElement = document.querySelector('.tabbar') // Thay bằng class thực tế của tabbar
  if (tabbarElement) {
    tabbarElement.style.display = 'flex' // hoặc giá trị display ban đầu
  }

  // Hoặc sử dụng API của uni-app nếu có sẵn
  // uni.showTabBar()

  // Khôi phục vị trí scroll sau khi DOM đã cập nhật
  setTimeout(() => {
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = savedScrollPosition.value
    }
  }, 50)
}

// Hàm mới để xem chi tiết một ảnh
function viewPhotoDetail(index) {
  // Lưu vị trí scroll hiện tại trước khi xem chi tiết ảnh
  const scrollContainer = document.querySelector('.scroll-container')
  if (scrollContainer) {
    photoViewPosition.value = scrollContainer.scrollTop
  }

  selectedPhotoIndex.value = index
  isPhotoDetailMode.value = true
}

// Hàm để quay lại danh sách ảnh từ chế độ xem chi tiết
function backToPhotosList() {
  isPhotoDetailMode.value = false

  // Khôi phục vị trí scroll đến ảnh đã chọn
  setTimeout(() => {
    const scrollContainer = document.querySelector('.scroll-container')
    if (scrollContainer) {
      scrollContainer.scrollTop = photoViewPosition.value
    }
  }, 50)
}

// Hàm để xem ảnh tiếp theo
function nextPhoto() {
  if (selectedPhotoIndex.value < collectionPhotos.value.length - 1) {
    selectedPhotoIndex.value++
  }
}

// Hàm để xem ảnh trước đó
function prevPhoto() {
  if (selectedPhotoIndex.value > 0) {
    selectedPhotoIndex.value--
  }
}

// Xử lý các sự kiện vuốt
function handleTouchStart(event) {
  touchStartX.value = event.touches[0].clientX
}

function handleTouchEnd(event) {
  touchEndX.value = event.changedTouches[0].clientX
  handleSwipe()
}

function handleSwipe() {
  const minSwipeDistance = 50 // Ngưỡng tối thiểu để xác định là vuốt
  const swipeDistance = touchEndX.value - touchStartX.value

  if (isPhotoDetailMode.value) {
    if (swipeDistance > minSwipeDistance) {
      // Vuốt phải -> xem ảnh trước đó
      prevPhoto()
    }
    else if (swipeDistance < -minSwipeDistance) {
      // Vuốt trái -> xem ảnh tiếp theo
      nextPhoto()
    }
  }
}

function onScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target

  if (scrollTop + clientHeight >= scrollHeight - 200) {
    if (selectedCollection.value) {
      // Đang ở trang chi tiết bộ sưu tập
      if (!isLoadingPhotos.value && hasMorePhotos.value) {
        fetchCollectionPhotos(true)
      }
    }
    else {
      // Đang ở trang danh sách bộ sưu tập
      if (!isLoading.value && hasMore.value) {
        fetchCollections(true)
      }
    }
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
  <div
    class="flex flex-col h-full"
    :class="{ 'fullscreen-mode': isFullscreenMode }"
  >
    <div
      class="flex-1 overflow-auto scroll-container bg-[#111111]"
      :class="{ 'pt-0': isFullscreenMode }"
    >
      <!-- Chế độ xem chi tiết ảnh -->
      <div
        v-if="isPhotoDetailMode && selectedCollection"
        class="fixed inset-0 bg-black z-50 flex flex-col"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Header cho chế độ xem chi tiết ảnh -->
        <div class="bg-black text-white p-4 flex items-center">
          <button class="flex -ml-[10px] !bg-transparent !shadow-none !outline-none" @click="backToPhotosList">
            <svg width="27" height="27" viewBox="0 0 32 32" fill="white">
              <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="white"></path>
            </svg>
          </button>

          <div class="flex flex-1 font-bold justify-center text-xl text-white">
            <span v-if="collectionPhotos[selectedPhotoIndex]?.user?.name">
              {{ collectionPhotos[selectedPhotoIndex].user.name }}
            </span>
            <span v-else></span>
          </div>
        </div>

        <!-- Hiển thị ảnh chi tiết -->
        <div class="flex-1 flex items-center justify-center bg-black">
          <img
            v-if="collectionPhotos[selectedPhotoIndex]"
            :src="collectionPhotos[selectedPhotoIndex].urls?.regular"
            :alt="collectionPhotos[selectedPhotoIndex].alt_description || 'Ảnh chi tiết'"
            class="max-w-full max-h-full object-contain"
          />
          <!-- Sử dụng PhotoActions component -->
          <div class="absolute bottom-4 right-4">
            <PhotoActions :photo="collectionPhotos[selectedPhotoIndex]" />
          </div>
        </div>
      </div>

      <!-- Hiển thị chi tiết bộ sưu tập khi đã chọn - chế độ toàn màn hình -->
      <div v-else-if="selectedCollection" class="relative">
        <!-- Header cố định nhỏ gọn -->
        <div class="fixed top-0 left-0 right-0 z-10 bg-[#111111]">
          <div class="flex items-center p-2">
            <button class="flex -ml-[10px] !bg-transparent !shadow-none !outline-none" @click="backToCollections">
              <svg width="27" height="27" viewBox="0 0 32 32" fill="white">
                <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#white"></path>
              </svg>
            </button>

            <div class="flex-1 text-center">
              <div v-if="selectedCollection" class="font-bold truncate text-white">
                {{ selectedCollection.title }}
              </div>
              <div v-if="selectedCollection" class="text-gray text-xs truncate">
                Cruated by {{ selectedCollection.user?.name || 'Ẩn danh' }}
              </div>
              <div v-else class="font-bold">
                Collection
              </div>
            </div>
          </div>
        </div>

        <!-- Khoảng trống để không bị che bởi header -->
        <div class="pt-12"></div>

        <!-- Hiển thị ảnh trong bộ sưu tập theo hàng dọc -->
        <div v-if="isLoadingPhotos && !collectionPhotos.length" class="text-center text-gray-500 py-4">
          <span class="animate-pulse"></span>
        </div>

        <div v-else-if="collectionPhotos.length === 0" class="text-center py-4 text-white">
          No photos
        </div>

        <div v-else class="flex flex-col">
          <div
            v-for="(photo, index) in collectionPhotos"
            :key="photo.id"
            class="w-full mb-[1px] relative"
            @click="viewPhotoDetail(index)"
          >
            <img
              :src="photo.urls?.regular"
              :alt="photo.alt_description || 'Ảnh từ bộ sưu tập'"
              class="w-full object-cover h-auto"
            />
            <!-- Hiển thị tên tác giả của mỗi bức ảnh -->
            <div class="absolute bottom-0 left-0 right-0 text-white p-2 b">
              <p class="text-sm font-semibold">
                {{ photo.user?.name || 'Ẩn danh' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Danh sách bộ sưu tập -->
      <div v-else>
        <!-- Trạng thái đang tải lần đầu -->
        <div v-if="isLoading && !collections.length" class="text-center text-gray-500 py-4">
          <span class="animate-pulse"></span>
        </div>

        <!-- Trạng thái lỗi -->
        <div v-else-if="errorMessage" class="text-center text-red-500 py-4">
          {{ errorMessage }}
        </div>

        <!-- Không có bộ sưu tập -->
        <div v-else-if="collections.length === 0" class="text-center text-gray-500 py-4">
          No collections
        </div>

        <!-- Danh sách bộ sưu tập -->
        <!-- Thay thế phần hiển thị hình ảnh bộ sưu tập hiện có bằng đoạn code này -->
        <div v-else class="space-y-4 p-4">
          <div
            v-for="collection in collections"
            :key="collection.id"
            class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            @click="viewCollection(collection)"
          >
            <!-- Bố cục hiển thị 3 ảnh, chỉ hiển thị nếu có ảnh -->
            <div class="relative flex h-40">
              <!-- Ảnh đầu tiên (luôn hiển thị nếu có cover_photo) -->
              <div class="flex-1 overflow-hidden">
                <img
                  v-if="collection.cover_photo?.urls?.small"
                  :src="collection.cover_photo.urls.small"
                  :alt="collection.title || 'Bộ sưu tập từ Unsplash'"
                  class="w-full h-40 object-cover"
                />
                <!-- Nếu không có ảnh bìa, hiển thị một vùng trống -->
                <div v-else class="w-full h-40 bg-[#333333]"></div>
              </div>

              <!-- Ảnh thứ hai (chỉ hiển thị nếu có) -->
              <div class="flex-1 overflow-hidden">
                <img
                  v-if="collection.preview_photos && collection.preview_photos.length > 1 && collection.preview_photos[1]?.urls?.small"
                  :src="collection.preview_photos[1].urls.small"
                  :alt="collection.title || 'Bộ sưu tập từ Unsplash'"
                  class="w-full h-40 object-cover"
                />
                <!-- Nếu không có ảnh thứ hai, hiển thị một vùng trống -->
                <div v-else class="w-full h-40 bg-[#333333]"></div>
              </div>

              <!-- Ảnh thứ ba (chỉ hiển thị nếu có) -->
              <div class="flex-1 overflow-hidden">
                <img
                  v-if="collection.preview_photos && collection.preview_photos.length > 2 && collection.preview_photos[2]?.urls?.small"
                  :src="collection.preview_photos[2].urls.small"
                  :alt="collection.title || 'Bộ sưu tập từ Unsplash'"
                  class="w-full h-40 object-cover"
                />
                <!-- Nếu không có ảnh thứ ba, hiển thị một vùng trống -->
                <div v-else class="w-full h-40 bg-[#333333]"></div>
              </div>

              <!-- Lớp phủ chứa thông tin bộ sưu tập -->
              <div class="absolute bottom-0 left-0 right-0 bg-[#222222] text-white p-2">
                <p class="text-sm font-bold truncate">
                  {{ collection.title }} <!-- Tiêu đề bộ sưu tập -->
                </p>
                <p class="text-xs">
                  {{ collection.total_photos }} photos <!-- Số lượng ảnh trong bộ sưu tập -->
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Trạng thái tải thêm -->
        <div v-if="isLoading && collections.length > 0" class="text-center text-gray-500 py-4">
          <span class="animate-pulse"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-container {
  height: calc(100vh - 60px);
}

.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background-color: white;
}
</style>
