import { un } from '@uni-helper/uni-network'

const UNSPLASH_ACCESS_KEY = 'V9O0YDnneiSTnvtdkxH9YSHr-ObO-4PKCxxh0UU4Epw'

const BASE_URL = 'https://api.unsplash.com'

// Ảnh mới
async function getLatestPhotos(page = 1, perpage = 30) {
  try {
    const response = await un.get(`${BASE_URL}/photos`, {
      params: {
        client_id: UNSPLASH_ACCESS_KEY,
        page,
        per_page: perpage,
        order_by: 'latest',
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
async function getUserSearch(query, page = 1, perPage = 10) {
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

// Lấy thông tin chi tiết người dùng
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
    console.error('Lỗi khi lấy thông tin người dùng:', error.message || error)
    throw error
  }
}

export {
  getLatestPhotos,
  getImageSearch,
  getCollectionSearch,
  getCollectionPhotos,
  getUserSearch,
  getUserProfile,
}
