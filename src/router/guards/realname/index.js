import store from '@/store/index.js'
import { useDialog, useToast } from '@/utils/modals'

export default (router) => {
  const userStore = store.useUserStore()

  router.beforeEach((to, from, next) => {
    // console.log('realname.beforeEach.to', to)
    // console.log('realname.beforeEach.from', from)

    const realStatus = userStore.userInfo.realStatus

    switch (realStatus) {
      case 3:
        next()
        break
      case 2:
        useToast('Real-name verification in progress, please try again later').then(() => {
          next(false)
        })
        break
      case 4:
        useDialog(`${userStore.userInfo.auditResult || 'The real-name information submitted does not match'}`, {
          title: 'Real-name failure',
          showCancelButton: true,
          confirmText: 'Recertification',
        })
          .then(() => {
            next({ path: '/pages/realname/index' })
          })
          .catch(() => {
            next(false)
          })
        break
      default:
        useDialog('Please complete real-name authentication first', { showCancelButton: true })
          .then(() => {
            next({ path: '/pages/realname/index' })
          })
          .catch(() => {
            next(false)
          })
        break
    }
  })
  // router.afterEach(() => {})
}
