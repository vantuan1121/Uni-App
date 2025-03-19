import { binaryParser } from './helper.js'
import request from './uni-network/index.js'
import store from '@/store/index.js'
import { responseSuccessCode } from '@/configs/request.js'
import { useDialog, useToast } from '@/utils/modals/index.js'

async function logout(message) {
  try {
    // console.log('logout', message)
    await useDialog(message, {
      title: 'Hint',
      showCancelButton: true,
      confirmButtonText: 'Re-login',
      cancelButtonText: 'Quit',
    })
    const userStore = store.useUserStore()
    userStore.logout()
  }
  catch (error) {
    wx.exitMiniProgram()
  }
}

export default request({
  onRequest({ url, configs, bodyKey = 'body', queryKey = 'query' } = {}) {
    // Solve the problem that some interfaces will report errors if nothing is transmitted
    if (!configs[bodyKey]) {
      configs[bodyKey] = {}
    }

    // const body = configs[bodyKey]

    // Converts a Headers type object to a normal object
    const headers
      = configs.headers.toString() === '[object Headers]'
        ? Object.fromEntries(configs.headers.entries())
        : configs.headers

    // Add the token to the request header
    const userStore = store.useUserStore()
    const token = userStore.token
    if (token) {
      headers.token = token
    }

    // Initialize data encryption
    // configs.aes = aesHelper({ headers, params: body })
    // const ret = configs.aes.encrypt()
    // configs[bodyKey] = ret.params
    // configs.headers = {
    //   ...headers,
    //   ...ret.headers,
    // }

    // console.log('onRequest.url', url)
    // console.log('onRequest.headers', configs.headers)
    // console.log('onRequest.body', body)
    // console.log('onRequest.query', configs[queryKey])
    // console.log('onRequest.configs', configs)
    return configs
  },
  onRequestError(error) {
    // console.log('onRequestError.error', error)
    return Promise.reject(error)
  },
  async onResponse({ url, configs, response, dataKey = 'data' } = {}) {
    // console.log('onResponse.response', response)

    // File binary stream responds to all data (Tips: the file name is in the request header)
    if (configs.responseType === 'blob') {
      response[dataKey] = await binaryParser(response, { dataKey })
    }

    // Data Decryption
    // response[dataKey] = configs.aes.decrypt({ data: response[dataKey] })

    const data = response[dataKey] || {}

    // Terminate if request fails
    if (!data?.code) {
      return response
    }

    // console.log('onResponse.data', response[dataKey])

    // Verification code
    const { code } = data
    const message = data.message || data.msg

    if (code === '10002' || code === '10001') {
      await logout(message)
    }
    else if (code != responseSuccessCode && message) {
      useToast(message, {
        type: 'warning',
        duration: 5 * 1000,
      })
    }

    response.data = {
      ...data,
      success: data.code == responseSuccessCode,
    }

    return response
  },
  async onResponseError({ response, dataKey = 'data' } = {}) {
    const data = response[dataKey]
    const status = response.status
    const statusText = response.statusText

    // console.log('onResponseError.response', response)
    // console.log('onResponseError.data', response[dataKey])
    // console.log('onResponseError.status', response.status)
    // console.log('onResponseError.statusText', response.statusText)

    if (status === 401 || status === 403) {
      await logout(statusText)
    }
    else {
      const message = statusText || data
      useToast(message, {
        type: 'error',
        duration: 5 * 1000,
      })

      return Promise.reject(response)
    }
  },
})
