<!-- src/components/PhotoActions.vue -->
<script setup>
import { usePhotoActions } from '@/composables/PhotoActions' // Sửa đường dẫn import

defineProps({
  photo: { type: Object, required: true },
})

const { likedPhotos, collectedPhotos, downloadMessage, toggleLike, toggleCollection, downloadPhoto } = usePhotoActions()
</script>

<template>
  <div class="space-y-4">
    <!-- Nút thích ảnh -->
    <div
      class="w-13 h-13 bg-black rounded-full flex items-center justify-center cursor-pointer"
      @click.stop="toggleLike(photo.id)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        :fill="likedPhotos.has(photo.id) ? '#ff0000' : 'white'"
        class="bi bi-heart-fill"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
        />
      </svg>
    </div>

    <!-- Nút thêm vào bộ sưu tập -->
    <div
      class="w-13 h-13 bg-black rounded-full flex items-center justify-center cursor-pointer"
      @click.stop="toggleCollection(photo.id)"
    >
      <svg
        v-if="!collectedPhotos.has(photo.id)"
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        fill="white"
        class="bi bi-plus-lg"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        fill="#00FF00"
        class="bi bi-check-lg"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
        />
      </svg>
    </div>

    <!-- Nút tải ảnh -->
    <div
      class="w-13 h-13 bg-white rounded-full flex items-center justify-center cursor-pointer"
      @click.stop="downloadPhoto(photo)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23"
        height="23"
        fill="black"
        class="bi bi-download"
        viewBox="0 0 16 16"
      >
        <path
          d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"
        />
        <path
          d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"
        />
      </svg>
    </div>

    <!-- Thông báo tải ảnh -->
    <div
      v-if="downloadMessage"
      class="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white p-2 rounded"
    >
      {{ downloadMessage }}
    </div>
  </div>
</template>
