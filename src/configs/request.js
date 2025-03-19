import {
  proxyPath,
  requestFilePath,
  requestPath,
  requestURL,
  useProxy,
} from './index'

const isDevelopment = process.env.NODE_ENV === 'development'

// Request base domain name
export function getBaseURL() {
  let tempURL = ''
  if (useProxy) {
    tempURL = isDevelopment ? proxyPath : window.location.origin + requestPath
  }
  else {
    tempURL = requestURL() + requestPath
  }
  return tempURL
}

// File base domain
export function getFileBaseURL() {
  let tempURL = ''
  if (useProxy) {
    tempURL = isDevelopment
      ? requestFilePath
      : window.location.origin + requestFilePath
  }
  else {
    tempURL = requestURL() + requestFilePath
  }
  return tempURL
}

// Request domain name
export const baseURL = getBaseURL()
// Response success code value
export const responseSuccessCode = '20000'
// Timeout
export const timeout = 60 * 1000
// Whether to enable encryption
export { useEncrypt } from './index'
