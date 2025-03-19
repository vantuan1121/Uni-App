import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from '@/utils/token.js'
import { getUserInfo, userLogin } from '@/api/user/index.js'
import defaultAvatar from '@/static/avatar.png'
import router from '@/router'

// import storage from '@/utils/storages'

export const useUserStore = defineStore('app-user', {
  state() {
    return {
      userInfo: {},
      token: getToken(),
    }
  },
  getters: {
    userId: state => state.userInfo?.userId,
    avatar: state => state.userInfo?.avatar,
    username: state => state.userInfo?.username,
    resumed: state => !!state.resumeInfo.id,
  },
  actions: {
    async login() {
      // const { code } = await uniLogin({
      //   provider: 'weixin',
      // })
      // console.log('code', code)
      const code = 'mock-code'

      const res = await userLogin({ jsCode: code })
      console.log('login.res', res)

      if (!res.success) {
        throw new Error('Automatic login failed')
      }

      if (!res?.data || !res?.data?.token) {
        throw new Error('Automatic login failed, no user credentials were obtained')
      }

      this.setToken(res.data.token)
    },
    removeToken() {
      this.token = ''
      removeToken()
    },
    setToken(token) {
      this.token = token
      setToken(token)
    },
    // Get user details
    async getUserInfo({ params = {}, ...options } = {}) {
      const res = await getUserInfo(params, options)

      if (!res?.success) {
        throw new Error('Failed to obtain user information')
      }

      if (!res?.data) {
        throw new Error('Failed to obtain user information, no data was obtained')
      }

      const data = res.data
      this.userInfo = {
        ...data,
        userId: data.id,
        avatar: data.avatar || defaultAvatar,
        username: data.username,
      }

      return this.userInfo
    },
    logout({ silenced = false, redirect = null } = {}) {
      this.removeToken()
      this.userInfo = {}
      this.resumeInfo = {}

      if (!silenced) {
        router.replaceAll({
          force: true,
          path: '/login',
          query: {
            redirect,
          },
        })
      }
    },
  },
})
