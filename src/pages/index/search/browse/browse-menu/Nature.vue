<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { getTopicPhotos } from '@/api/unsplash/unsplashAPI'

// Khai báo các biến reactive
const masonryColumns = ref(2) // Số cột hiển thị trong gallery
const columns = ref(Array.from({ length: masonryColumns.value }, () => [])) // Mảng chứa dữ liệu các cột
const topicId = ref('nature') // ID của topic trên Unsplash
const topicTitle = ref('Nature') // Tên hiển thị của topic
const perPage = 30 // Số lượng ảnh tải về mỗi lần
const page = ref(1) // Trang hiện tại để phân trang
const loading = ref(false) // Trạng thái đang tải ảnh
const hasMore = ref(true) // Còn ảnh để tải không
const selectedImage = ref(null) // Ảnh được chọn để xem chi tiết
const showDetail = ref(false) // Điều khiển hiển thị chế độ xem chi tiết
const selectedImageIndex = ref(-1) // Chỉ số của ảnh đang xem trong mảng allImages
const scrollPosition = ref(0) // Lưu vị trí cuộn trước khi xem chi tiết
const allImagesFlat = ref([]) // Mảng phẳng lưu tất cả ảnh theo thứ tự tải về

// Tạo mảng phẳng của tất cả ảnh để dễ dàng điều hướng qua trái phải
// Sử dụng computed property để luôn cập nhật khi columns thay đổi
const allImages = computed(() => {
  // Tạo mảng phẳng chứa tất cả ảnh từ mọi cột
  // Sắp xếp theo thứ tự đan xen giữa các cột
  // Ví dụ: cột1[0], cột2[0], cột1[1], cột2[1], ...
  const maxLength = Math.max(...columns.value.map(col => col.length))
  const images = []

  for (let i = 0; i < maxLength; i++) {
    for (let j = 0; j < columns.value.length; j++) {
      if (columns.value[j][i]) {
        images.push(columns.value[j][i])
      }
    }
  }

  return images
})

/**
 * Tính toán chiều cao ước lượng cho ảnh dựa trên tỉ lệ khung hình
 * @param {Object} image - Đối tượng ảnh với thuộc tính height và width
 * @param {Number} targetWidth - Chiều rộng mục tiêu để tính toán
 * @returns {Number} Chiều cao ước tính
 */
function calculateEstimatedHeight(image, targetWidth = 500) {
  const aspectRatio = image.height / image.width
  return Math.round(targetWidth * aspectRatio)
}

/**
 * Phân phối ảnh vào các cột theo thuật toán masonry
 * Đưa ảnh vào cột có tổng chiều cao thấp nhất
 * @param {Array} newImages - Mảng các ảnh mới cần phân phối
 */
function distributeImagesToColumns(newImages) {
  // Lưu tất cả ảnh vào mảng phẳng theo thứ tự tải về
  allImagesFlat.value.push(...newImages)

  newImages.forEach((image) => {
    // Tìm cột có chiều cao nhỏ nhất để thêm ảnh
    const shortestColumnIndex = columns.value.reduce((minIndex, column, index, arr) =>
      column.reduce((sum, img) => sum + img.estimatedHeight, 0)
      < arr[minIndex].reduce((sum, img) => sum + img.estimatedHeight, 0)
        ? index
        : minIndex, 0)

    columns.value[shortestColumnIndex].push({
      ...image,
      estimatedHeight: calculateEstimatedHeight(image),
      columnIndex: shortestColumnIndex, // Lưu lại thông tin cột để debug nếu cần
    })
  })
}

/**
 * Tải ảnh từ API Unsplash theo topic và phân phối vào các cột
 * Tự động tăng số trang khi hoàn thành
 */
async function fetchImages() {
  // Nếu đang tải hoặc không còn ảnh để tải thì dừng
  if (loading.value || !hasMore.value)
    return

  loading.value = true

  try {
    // Gọi API để lấy dữ liệu ảnh theo topic
    const images = await getTopicPhotos(topicId.value, page.value, perPage)

    // Nếu không còn ảnh nào, đánh dấu không còn dữ liệu để tải
    if (images.length === 0) {
      hasMore.value = false
      return
    }

    // Phân phối ảnh mới vào các cột
    distributeImagesToColumns(images)

    // Tăng số trang lên để lần sau tải trang tiếp theo
    page.value++
  }
  catch (error) {
    console.error('Lỗi khi tải ảnh từ topic:', error)
    hasMore.value = false
  }
  finally {
    loading.value = false
  }
}

/**
 * Thiết lập Intersection Observer để cuộn vô hạn
 * Tự động tải thêm ảnh khi người dùng cuộn đến cuối trang
 */
function setupInfiniteScroll() {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading.value && hasMore.value) {
      fetchImages()
    }
  }, { threshold: 0.1 })

  const sentinel = document.getElementById('scroll-sentinel')
  if (sentinel)
    observer.observe(sentinel)
}

/**
 * Xử lý khi người dùng nhấn nút quay lại
 * Chuyển hướng về trang chủ
 */
function handleCancel() {
  uni.reLaunch({ url: '/' })
}

/**
 * Xử lý khi người dùng click vào ảnh để xem chi tiết
 * @param {Object} image - Đối tượng ảnh được click
 */
function handleImageClick(image) {
  // Lưu vị trí cuộn hiện tại trước khi chuyển sang xem chi tiết
  scrollPosition.value = window.scrollY || window.pageYOffset

  // Tìm chỉ số của ảnh trong mảng allImages mới (mảng đan xen)
  const index = allImages.value.findIndex(img => img.id === image.id)
  if (index !== -1) {
    selectedImageIndex.value = index
    selectedImage.value = allImages.value[index]
    showDetail.value = true
    document.body.style.overflow = 'hidden' // Ngăn cuộn trang khi đang xem chi tiết
  }
}

/**
 * Quay lại từ chế độ xem chi tiết về gallery
 * Khôi phục vị trí cuộn trước đó
 */
function backToGallery() {
  showDetail.value = false
  selectedImage.value = null
  selectedImageIndex.value = -1
  document.body.style.overflow = '' // Cho phép cuộn lại

  // Sử dụng nextTick để đảm bảo DOM đã được cập nhật trước khi cuộn
  nextTick(() => {
    // Khôi phục vị trí cuộn về vị trí trước khi xem chi tiết
    window.scrollTo({
      top: scrollPosition.value,
      behavior: 'auto', // Sử dụng 'auto' thay vì 'smooth' để tránh hiệu ứng cuộn
    })
  })
}

/**
 * Chuyển đến ảnh tiếp theo trong chế độ xem chi tiết
 * Tự động tải thêm ảnh nếu đang ở ảnh cuối cùng
 */
function nextImage() {
  if (selectedImageIndex.value < allImages.value.length - 1) {
    // Nếu còn ảnh tiếp theo, tăng chỉ số lên
    selectedImageIndex.value++
    selectedImage.value = allImages.value[selectedImageIndex.value]
  }
  else if (hasMore.value) {
    // Nếu đang ở ảnh cuối cùng và còn ảnh để tải, tải thêm ảnh
    fetchImages().then(() => {
      // Sau khi tải thêm ảnh, kiểm tra lại allImages.value và chỉ số
      // do allImages là computed nên sẽ tự cập nhật khi columns thay đổi
      if (allImages.value.length > selectedImageIndex.value + 1) {
        selectedImageIndex.value++
        selectedImage.value = allImages.value[selectedImageIndex.value]
      }
    })
  }
}

/**
 * Chuyển đến ảnh trước đó trong chế độ xem chi tiết
 */
function previousImage() {
  if (selectedImageIndex.value > 0) {
    selectedImageIndex.value--
    selectedImage.value = allImages.value[selectedImageIndex.value]
  }
}

// Biến lưu vị trí bắt đầu và kết thúc của cử chỉ vuốt
let touchStartX = 0
let touchEndX = 0

/**
 * Ghi nhận vị trí bắt đầu khi người dùng chạm vào màn hình
 * @param {TouchEvent} event - Sự kiện chạm màn hình
 */
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX
}

/**
 * Cập nhật vị trí khi người dùng di chuyển ngón tay
 * @param {TouchEvent} event - Sự kiện di chuyển ngón tay
 */
function handleTouchMove(event) {
  touchEndX = event.touches[0].clientX
}

/**
 * Xử lý khi người dùng kết thúc cử chỉ vuốt
 * Xác định hướng vuốt và chuyển ảnh tương ứng
 */
function handleTouchEnd() {
  // Tính khoảng cách vuốt
  const swipeDistance = touchEndX - touchStartX
  // Đặt ngưỡng (threshold) để xác định có phải là vuốt hay chỉ là chạm nhẹ
  const threshold = 75

  if (swipeDistance > threshold) {
    // Vuốt sang phải => xem ảnh trước
    previousImage()
  }
  else if (swipeDistance < -threshold) {
    // Vuốt sang trái => xem ảnh tiếp theo
    nextImage()
  }

  // Reset giá trị để chuẩn bị cho lần vuốt tiếp theo
  touchStartX = 0
  touchEndX = 0
}

/**
 * Khởi tạo component khi được mounted
 */
onMounted(() => {
  // Tải ảnh đầu tiên
  fetchImages()

  // Thiết lập cuộn vô hạn
  setupInfiniteScroll()

  // Lấy ID menu từ lịch sử duyệt web
  const menuId = history.state?.menuId
  if (menuId) {
    nextTick(() => {
      const targetElement = document.getElementById(menuId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }
})
</script>

<template>
  <!-- Header tabbar - Ẩn khi đang ở chế độ xem chi tiết -->
  <view v-if="!showDetail" class="fixed top-0 left-0 w-full h-12 bg-[#111111] flex items-center px-4 z-100">
    <div @click="handleCancel">
      <svg width="27" height="27" viewBox="0 0 32 32">
        <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="white"></path>
      </svg>
    </div>
    <text class="text-lg font-bold mx-auto text-white">
      {{ topicTitle }}
    </text>
  </view>

  <!-- Chế độ xem chi tiết - Hiển thị khi người dùng click vào ảnh -->
  <div
    v-if="showDetail"
    class="fixed inset-0 bg-[#111111] z-50 flex flex-col"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Header của chế độ xem chi tiết -->
    <div class="fixed top-0 left-0 w-full h-12 flex items-center px-4 bg-black text-white z-50">
      <div class="cursor-pointer" @click="backToGallery">
        <svg width="27" height="27" viewBox="0 0 32 32">
          <path d="M21.781 7.844l-9.063 8.594 9.063 8.594q0.25 0.25 0.25 0.609t-0.25 0.578q-0.25 0.25-0.578 0.25t-0.578-0.25l-9.625-9.125q-0.156-0.125-0.203-0.297t-0.047-0.359q0-0.156 0.047-0.328t0.203-0.297l9.625-9.125q0.25-0.25 0.578-0.25t0.578 0.25q0.25 0.219 0.25 0.578t-0.25 0.578z" fill="#ffffff"></path>
        </svg>
      </div>
      <text class="text-lg font-bold mx-auto text-white">
        {{ selectedImage?.user?.name || '' }}
      </text>
    </div>

    <!-- Phần hiển thị ảnh chi tiết -->
    <div class="flex-1 flex items-center justify-center relative">
      <img
        v-if="selectedImage"
        :src="selectedImage.urls.regular || selectedImage.urls.small"
        :alt="selectedImage.alt_description"
        class="max-w-full max-h-full object-contain"
      />

      <!-- Hiển thị nút điều hướng (tùy chọn) -->
    </div>
  </div>

  <!-- Phần gallery chính - Ẩn khi đang ở chế độ xem chi tiết -->
  <div v-if="!showDetail" class="pt-12">
    <!-- Grid masonry cho gallery -->
    <div class="grid grid-cols-2 gap-[1px] bg-[#111111]">
      <!-- Render từng cột -->
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="flex flex-col gap-[1px]"
      >
        <!-- Render từng ảnh trong cột -->
        <div
          v-for="image in column"
          :key="image.id"
          class="relative overflow-hidden"
          @click="handleImageClick(image)"
        >
          <img
            :src="image.urls.small"
            :alt="image.alt_description"
            class="w-full h-auto object-contain cursor-pointer"
            style="max-height: 500px;"
          />
          <!-- Hiển thị tên tác giả phía dưới ảnh với nền gradient -->
          <div class="absolute bottom-0 left-0 w-full text-white p-2 bg-gradient-to-t from-black/50 to-transparent">
            <a class="font-semibold block">
              {{ image.user.name }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Phần tử để theo dõi cuộn và tải thêm ảnh -->
    <div
      id="scroll-sentinel"
      class="h-10 w-full text-center text-gray-500"
    >
      <span v-if="loading" class="animate-pulse"></span>
      <span v-else-if="!hasMore && columns[0].length > 0">
        No more images to load
      </span>
    </div>
  </div>
</template>
