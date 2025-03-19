/**
 * General storage store
 * @method set Set permanent cache
 * @method get Get permanent cache
 * @method remove Remove permanent cache
 * @method clear Remove all permanent caches
 */
export default {
  // Setting up a persistent cache
  set(key, value) {
    uni.setStorageSync(key, value)
  },
  // Get a permanent cache
  get(key) {
    return uni.getStorageSync(key)
  },
  // Remove persistent cache
  remove(key) {
    uni.removeStorageSync(key)
  },
  // Remove all persistent caches
  clear() {
    uni.clearStorageSync()
  },
}
