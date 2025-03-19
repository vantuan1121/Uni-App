import { isH5 } from '@uni-helper/uni-env'

const isProduction = process.env.NODE_ENV === 'production'

export const appName = 'vite-uniapp-template'

// Project theme color
export const primaryColor = '#1CAB4E'

// Project base path
export const appBasePath = isProduction ? './' : './'
// Request address
export const requestURL = () => process.env.VITE_APP_API_URL
export const requestPath = '/api'
export const requestFilePath = '/file'
// Whether to enable proxy
export const useProxy = isH5
// Proxy Path
export const proxyPath = '/proxy'
// Proxy port number
export const proxyPort = 1996
// Whether to enable encryption
export const useEncrypt = false
// Whether to use remote navigation menu
export const useRemoteMenu = true

// Company Information
export const enterpriseInfo = {
  name: 'vbot-dev-team',
  address: 'https://github.com/VBotDevTeam',
}

// Home page path
export const homePage = 'pages/index/home/index'
