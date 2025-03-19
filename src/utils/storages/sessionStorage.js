/**
 * window.sessionStorage
 * @method set set
 * @method get get
 * @method remove remove
 * @method clear remove all
 */
export default {
  // Set
  set(key, val) {
    window.sessionStorage.setItem(key, JSON.stringify(val))
  },
  // Get
  get(key) {
    const json = window.sessionStorage.getItem(key)
    try {
      return JSON.parse(json)
    }
    catch (error) {
      return json
    }
  },
  // Remove
  remove(key) {
    window.sessionStorage.removeItem(key)
  },
  // Remove All
  clear() {
    window.sessionStorage.clear()
  },
}
