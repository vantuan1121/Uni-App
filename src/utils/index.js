import _get from 'lodash/get'

/**
 * @desc Use async await to perform delayed operations
 * @param {*} time
 */
export function sleep(time = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), time)
  })
}

/**
 * Use the indexof method to implement fuzzy query
 * @param {Array} list Array to query
 * @param {string} keyWord Keyword to query
 * @return {Array} Query results
 */
export function fuzzyQuery(list, keyWord, { keyName = '' } = {}) {
  const arr = []
  for (let i = 0; i < list.length; i++) {
    const str = keyName ? list[i][keyName] : list[i]
    if (str.includes(keyWord)) {
      arr.push(list[i])
    }
  }
  return arr
}

/**
 * Deconstructing object properties into responsive computed properties
 * @param  values When it is an object, the value of the object is used as the replacement key name of the calculated property
 * @param {string} sourcePath The default value is '$Route.query'
 * @returns {object} Computed List
 */
export function mapComputed(keys = [], sourcePath = '$Route.query') {
  const arr = Array.isArray(keys)
    ? keys.map(name => [name, name])
    : Object.entries(keys)
  const computedList = arr.reduce((obj, [name, replaceName]) => {
    if (!replaceName)
      replaceName = name
    const formatPath = [...sourcePath.split('.'), name].join('.')
    obj[replaceName] = function () {
      return _get(this, formatPath)
    }
    return obj
  }, {})
  return computedList
}

/**
 * @description Inherited component method
 * @param {*} refName ref name
 * @param {*} methodNames List of method names to be inherited
 * @returns
 */
export function inheritComponentMethods(refName, methodNames) {
  const methods = {}
  methodNames.forEach((name) => {
    methods[name] = function (...params) {
      return this.$refs[refName][name](...params)
    }
  })
  return methods
}

// Dictionary Mapping
export const mapDict = function (
  data,
  {
    childrenName = 'children',
    keyName = 'value',
    valueName = 'label',
    mapValue,
  } = {},
) {
  return data.reduce((obj, item) => {
    const key = item[keyName]
    const value = mapValue ? mapValue(item) : item[valueName]
    obj[key] = value
    if (Array.isArray(item[childrenName])) {
      obj = {
        ...obj,
        ...mapDict(item[childrenName], {
          childrenName,
          keyName,
          valueName,
          mapValue,
        }),
      }
    }
    return obj
  }, {})
}

/**
 * Remove rich text tags
 * @param {*} value Rich Text
 * @returns
 */
export function removeTag(value) {
  return value
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, '')
    .replace(/&ldquo;/g, '')
    .replace(/&rdquo;/g, '')
}

/**
 * Judging gender by ID number
 */
export function getSexText(idCardNo) {
  const gender = idCardNo.substr(-2, 1)
  if (gender % 2 === 1) {
    return 'Male'
  }
  return 'Female'
}
