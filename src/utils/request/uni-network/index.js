import qs from 'query-string'
import uniNetwork from './core/index'
import { baseURL, timeout } from '@/configs/request'

export default ({
  onRequest,
  onRequestError,
  onResponse,
  onResponseError,
} = {}) => {
  // Create Request Service
  const service = uniNetwork.create({
    baseURL,
    headers: {
      'content-type': 'application/json;charset=utf-8',
    },
    timeout,
    xsrfHeaderName: 'token',
    paramsSerializer: (params) => {
      return Object.prototype.toString.call(params).includes('URLSearchParams')
        ? params.toString()
        : qs.stringify(params)
    },
  })

  // Request interception
  service.onRequest = (config) => {
    // Solve the content-type case coverage problem
    if (config.headers['content-type']) {
      config.headers['Content-Type'] = config.headers['content-type']
      delete config.headers['content-type']
    }
    // Solve the problem that query cannot pass array
    config.paramsSerializer = params =>
      qs.stringify(params, {
        arrayFormat: 'bracket',
      })

    return onRequest({
      url: config.url,
      configs: config,
      headers: config.headers,
      bodyKey: 'data',
      queryKey: 'params',
    })
  }

  // Request failure interception
  service.onRequestError = (error) => {
    const { config } = error
    return onRequestError({
      url: config.url,
      configs: config,
      headers: Object.fromEntries(config.headers.entries()),
      bodyKey: 'body',
      queryKey: 'query',
      error,
    })
  }

  // Response Interception
  service.onResponse = async (response) => {
    // console.log('response', response)
    const { config } = response
    response = await onResponse({
      url: config.url,
      configs: config,
      response,
      dataKey: 'data',
    })

    return response.data
  }

  // Response failure interception
  service.onResponseError = error =>
    onResponseError({
      dataKey: 'data',
      response: {
        status: 500,
        statusText: error.message,
      },
      error,
    })

  service.interceptors.request.use(service.onRequest, service.onRequestError)
  service.interceptors.response.use(service.onResponse, service.onResponseError)

  /**
   * Submitting data in a form
   * @param  url
   * @param  params Parameters to submit (data)
   * @param  useFormData Whether to automatically convert data to FormData format
   * @returns {Promise}
   */
  service.form = (
    url,
    params,
    { useFormData = true, paramsKey = 'data', ...options } = {},
  ) => {
    if (useFormData) {
      const formParams = new FormData()
      Object.entries(params).forEach(([key, value]) => {
        formParams.append(key, value)
      })
      params = formParams
    }

    return service({
      url,
      [paramsKey]: params,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...options,
    })
  }

  /**
   * Submit data in the form address bar query
   * @param  url
   * @param  params Parameters to submit (data)
   * @param  useQuery Whether to automatically convert data to FormData format
   * @returns {Promise}
   */
  service.query = (
    url,
    params,
    { useQuery = true, paramsKey = 'data', ...options } = {},
  ) => {
    if (useQuery) {
      const queryParams = qs.stringify(params)
      params = queryParams
    }

    return service({
      url,
      [paramsKey]: params,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...options,
    })
  }

  /**
   * Rewrite the get alias to implement the second parameter can be passed directly
   * @param  url
   * @param  params Parameters to submit (data)
   * @param  useQuery Whether to automatically convert data to FormData format
   * @returns {Promise}
   */
  service.get = (url, params, { paramsKey = 'params', ...options } = {}) =>
    service({
      url,
      method: 'GET',
      [paramsKey]: params,
      ...options,
    })
  return service
}
