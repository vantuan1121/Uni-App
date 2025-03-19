// import request from '@/utils/request/index.js'
import { mock } from '../base/index.js'

/**
 * Get mobile phone number
 */
export const phoneNumber = data => mock(data)

/**
 * Get the available registered areas
 */
export const wxdepartTree = data => mock(data)

/**
 * Verify whether the user information already exists in the database
 */
export const checkUserinfo = data => mock({ ...data, mockData: true })

/**
 * The database already exists. Bind this user directly
 */
export const bindUserinfo = data => mock({ ...data, mockData: true })

/**
 * Submit real-name authentication information that does not exist in the database
 */
export const wxrealnameAuth = data => mock(data)
