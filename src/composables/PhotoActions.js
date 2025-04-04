import { ref } from 'vue'

export function usePhotoActions() {
  const likedPhotos = ref(new Set())
  const collectedPhotos = ref(new Set())
  const downloadMessage = ref('')

  const toggleLike = (photoId) => {
    likedPhotos.value[likedPhotos.value.has(photoId) ? 'delete' : 'add'](photoId)
  }

  const toggleCollection = (photoId) => {
    collectedPhotos.value[collectedPhotos.value.has(photoId) ? 'delete' : 'add'](photoId)
  }

  const downloadPhoto = async (photo) => {
    if (!photo)
      return

    downloadMessage.value = ''

    try {
      const response = await fetch(photo.urls.full)
      if (!response.ok)
        throw new Error('Không thể tải ảnh')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      Object.assign(link, {
        href: url,
        download: `photo_${photo.id}.jpg`,
      })

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      downloadMessage.value = ''
      setTimeout(() => (downloadMessage.value = ''), 2000)
    }
    catch (error) {
      console.error('Error loading image:', error)
      downloadMessage.value = 'Error: Unable to load image'
      setTimeout(() => (downloadMessage.value = ''), 3000)
    }
  }

  return {
    likedPhotos,
    collectedPhotos,
    downloadMessage,
    toggleLike,
    toggleCollection,
    downloadPhoto,
  }
}
