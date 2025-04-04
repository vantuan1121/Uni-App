import { un } from '@uni-helper/uni-network'

const UNSPLASH_ACCESS_KEY = '6uB1nyR-MMfETsIdxhAJz5O2K7UgKTB3WLUsXMCHOMs'

const BASE_URL = 'https://api.unsplash.com'

// Ảnh mới
async function getLatestPhotos(page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perpage,
        // order_by: 'latest',
      },
    })
    return response.data
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Tìm kiếm
async function getImageSearch(query, page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/search/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        query,
        page,
        per_page: perpage,
      },
    })
    return response.data.results || []
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy ảnh theo topic
async function getTopicPhotos(topicId, page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/topics/${topicId}/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perpage,
      },
    })
    return response.data || []
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy danh sách các topics
async function getTopics(page = 1, perpage = 30, orderBy = 'position') {
  try {
    const response = await un.get(`${BASE_URL}/topics`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perpage,
        order_by: orderBy,
      },
    })
    return response.data || []
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Tìm kiếm bộ sưu tập ảnh
async function getCollectionSearch(query, page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/search/collections`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        query,
        page,
        per_page: perpage,
      },
    })
    return response.data.results || []
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy ảnh từ bộ sưu tập
async function getCollectionPhotos(collectionId, page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/collections/${collectionId}/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perpage,
      },
    })
    return response.data || []
  }
  catch (error) {
    console.error('Lỗi khi lấy ảnh từ bộ sưu tập:', error.message || error)
    return []
  }
}

// Tìm kiếm user
async function getUserSearch(query, page = 1, perPage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/search/users`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        query,
        page,
        per_page: perPage,
      },
    })
    return response.data.results || []
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy thông tin chi tiết user
async function getUserProfile(username) {
  try {
    const response = await un.get(`${BASE_URL}/users/${username}`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
      },
    })
    return response.data
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy ảnh user
async function getUserPhotos(username, page = 1, perPage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/users/${username}/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perPage,
      },
    })
    return response.data
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy ảnh đã thích của user
async function getUserLikes(username, page = 1, perPage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/users/${username}/likes`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perPage,
      },
    })
    return response.data
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

// Lấy bộ sưu tập của user
async function getUserCollections(username, page = 1, perPage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/users/${username}/collections`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perPage,
      },
    })
    return response.data
  }
  catch (error) {
    console.error('Lỗi:', error.message || error)
    return []
  }
}

export {
  getLatestPhotos,
  getImageSearch,
  getTopicPhotos,
  getTopics,
  getCollectionSearch,
  getCollectionPhotos,
  getUserSearch,
  getUserProfile,
  getUserPhotos,
  getUserLikes,
  getUserCollections,
}
