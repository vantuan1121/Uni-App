<template>
  <view class="flex gap-1  ">
    <!-- Cột 1 -->
    <view class="flex-1 flex flex-col ">
      <view
        v-for="image in column1"
        :key="image.id"
        class="relative cursor-pointer"
        @click="openUnsplash(image.links.html)"
      >
        <image
          :src="image.urls.small"
          class="w-full"
          mode="widthFix"
        />
        <view class="absolute bottom-2 left-2 text-white p-1 rounded">
          {{ image.user.name }}
        </view>
      </view>
    </view>

    <!-- Cột 2 -->
    <view class="flex-1 flex flex-col">
      <view
        v-for="image in column2"
        :key="image.id"
        class="relative cursor-pointer"
        @click="openUnsplash(image.links.html)"
      >
        <image
          :src="image.urls.small"
          class="w-full"
          mode="widthFix"
        />
        <view class="absolute bottom-2 left-2 text-white p-1 rounded">
          {{ image.user.name }}
        </view>
      </view>
    </view>
  </view>

  <!-- Hiển thị trạng thái loading -->
  <view v-if="loading" class="text-center text-gray-500 text-lg p-4">
    Đang tải...
  </view>

  <!-- Hiển thị thông báo nếu không tìm thấy ảnh -->
  <view v-if="!loading && noMoreImages && images.length === 0" class="text-center text-gray-500 text-lg p-4">
    Không tìm thấy ảnh nào cho "{{ searchQuery }}".
  </view>
</template>

<script>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { fetchUnsplashImages, searchUnsplashImages } from '@/api/unsplash/unsplashAPI'

export default {
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const images = ref([])
    const page = ref(1)
    const loading = ref(false)
    const noMoreImages = ref(false) // 🔹 Biến kiểm soát khi hết ảnh

    const loadMoreImages = async () => {
      if (loading.value || noMoreImages.value)
        return
      loading.value = true

      let newImages = []
      if (props.searchQuery) {
        newImages = await searchUnsplashImages(props.searchQuery, page.value, 10)
      }
      else {
        newImages = await fetchUnsplashImages(page.value, 10)
      }

      if (newImages.length === 0) {
        noMoreImages.value = true // 🔹 Đánh dấu không còn ảnh để tải
      }
      else {
        images.value = [...images.value, ...newImages]
        page.value += 1
      }
      loading.value = false
    }

    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && !loading.value && !noMoreImages.value) {
        loadMoreImages()
      }
    }

    onMounted(() => {
      loadMoreImages()
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    watch(() => props.searchQuery, async () => {
      images.value = []
      page.value = 1
      noMoreImages.value = false // 🔹 Reset trạng thái khi đổi từ khóa
      await loadMoreImages()
    })

    const column1 = computed(() => images.value.filter((_, index) => index % 2 === 0))
    const column2 = computed(() => images.value.filter((_, index) => index % 2 !== 0))

    const openUnsplash = (url) => {
      window.open(url, '_blank')
    }

    return {
      images,
      column1,
      column2,
      loading,
      noMoreImages, // 🔹 Thêm biến để kiểm soát hết ảnh
      openUnsplash,
    }
  },
}
</script>
