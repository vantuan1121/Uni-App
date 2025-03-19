/**
 * window.localStorage
 * @method set Set
 * @method get Get
 * @method remove Remove
 * @method clear Remove all
 */
export default {
  // Set
  set(key, val) {
    window.localStorage.setItem(key, JSON.stringify(val))
  },
  // Get
  get(key) {
    const json = window.localStorage.getItem(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // Remove
  remove(key) {
    window.localStorage.removeItem(key)
  },
  // Remove All
  clear() {
    window.localStorage.clear()
  },
}
