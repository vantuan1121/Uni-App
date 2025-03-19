import request from '@/utils/request/index.js'
import { baseURL, responseSuccessCode } from '@/configs/request.js'

/**
 * @descripting simulation interface
 * @param Mockdata The simulation data you want to return
 */

export function mock({ mockData = {}, delay = 500 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: responseSuccessCode,
        success: true,
        data: mockData,
      })
    }, delay)
  })
}

/**
 * @desc Get the basic url
 */
export const getBaseURL = () => baseURL

/**
 * Get the dictionary data
 */
export function getDictList(dictType) {
  return mock({
    dictType,
    mockData: [],
  })
}

/**
 * @desc Get the upload address
 */
export const getUploadURL = () => `${baseURL}/file/upload`

/**
 * @desc download file
 */
export function downloadFile(id) {
  return window.open(`${baseURL}/downloadFile?id=${id}`)
}

/**
 * @desc Get site configuration
 */
export const getSiteConfig = () => mock({ mockData: {} })

/**
 * @desc Upload file
 */
export function uploadFile(params) {
  return request.upload({
    url: '/file/upload',
    dataType: 'json',
    headers: {
      'content-type': 'multipart/form-data',
    },
    ...(params || {}),
  })
}
