const ACCESS_KEY = 'V9O0YDnneiSTnvtdkxH9YSHr-ObO-4PKCxxh0UU4Epw' // API Key cố định

// Hàm gọi API chung
async function unsplashRequest(endpoint, params = {}) {
  try {
    const response = await new Promise((resolve, reject) => {
      uni.request({
        url: `https://api.unsplash.com/${endpoint}`,
        method: 'GET',
        header: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
        data: params,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          }
          else {
            console.error(`Lỗi API Unsplash: ${res.statusCode}`, res)
            resolve([])
          }
        },
        fail: (err) => {
          console.error('Lỗi mạng:', err)
          reject(err)
        },
      })
    })

    return response
  }
  catch (error) {
    console.error('Lỗi khi gọi API:', error)
    return []
  }
}

// Hàm lấy ảnh ngẫu nhiên
export async function fetchUnsplashImages(page = 1, perPage = 10) {
  return await unsplashRequest('photos', { page, per_page: perPage })
}

// Hàm tìm kiếm ảnh theo từ khóa
export async function searchUnsplashImages(query, page = 1, perPage = 10) {
  const data = await unsplashRequest('search/photos', { query, page, per_page: perPage })
  return data.results || []
}
