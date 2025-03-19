import { mock } from '../base/index.js'

/**
 * @description User login
 */
export function userLogin(data) {
  return mock({ ...data, mockData: { token: 'mock-token' } })
}

/**
 * @description Get the current logged-in user information
 * @param realStatus 1-Not verified 2-Verifying 3-Verified 4-Verifying failed
 */
export function getUserInfo(data) {
  return mock({
    ...data,
    mockData: {
      id: 'mock-id',
      username: 'vbot-dev-team',
      realStatus: '1',
    },
  })
}

/**
 * @description Get the currently logged in user menu
 */
export const getUserMenus = data => mock({ ...data, mockData: [] })

/**
 * @description User changes password
 */
export const updatePassword = data => mock(data)

/**
 * @description Upload user avatar
 */
export const userHeadimg = data => mock(data)

/**
 * @description Log out
 */
export const logout = () => mock()
