import jsCookie from 'js-cookie'

/**
 * Operate Cookies
 * @method set Set
 * @method get Get
 * @method remove Remove
 * @method clear Remove all
 */
export default {
  // Set
  set(key, val) {
    jsCookie.set(key, JSON.stringify(val))
  },
  // 获取
  get(key) {
    const json = jsCookie.get(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // Remove
  remove(key) {
    jsCookie.remove(key)
  },
}
