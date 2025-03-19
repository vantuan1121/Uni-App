/**
 * Functions related to tree processing
 */
import { cloneDeep, find } from 'lodash-es'

// Sort an array by a function
function sortData(data, sortFun) {
  data.sort(sortFun)
}

/**
 * Generate sort function
 * @param {string}  sortField  Sort Field
 * @param {boolean} asc       Is it in positive order?
 * @returns {Function}  Sorting Function
 */
function generateSortFn(sortField, asc) {
  return (a, b) => {
    const valueA = a[sortField]
    const valueB = b[sortField]
    if (valueA > valueB) {
      if (asc) {
        return 1
      }
      return -1
    }
    if (asc) {
      return -1
    }
    return 1
  }
}

/**
 * Array structure converted to tree structure
 * @returns {Array}
 */
export const arrayToTree = function (
  data = [],
  invalId = [],
  id = 'id',
  parentId = 'parentId',
) {
  // result
  const result = []
  // Copy data
  const dataTemp = cloneDeep(data)

  dataTemp.forEach((item) => {
    // Adding children
    if (!item.children) {
      item.children = []
    }

    // Remove invalid nodes
    if (invalId.includes(item[id]))
      return

    // parentUuid value
    const parentIdValue = item[parentId]

    // No parent value exists
    if (!parentIdValue) {
      item._level = 1
      result.push(item)
    }
    else {
      // Parent Object
      const parent = find(dataTemp, node => node[id] === parentIdValue)
      // No parent object exists
      if (!parent) {
        item._level = 1
        result.push(item)
        return
      }
      if (!parent.children) {
        parent._level = parent._level ? parent._level : 1
        parent.children = []
      }
      // Add to parent object children
      item._level = parent._level + 1
      parent.children.push(item)
    }
  })
  return result
}

/**
 * Query problem classification path data
 * @param {*} id
 * @param {*} data
 */
export function arrayTreePathData(id, data) {
  const item = {
    problemCategoryLevelId: [],
    problemCategoryLevelIds: [],
  }
  data.forEach((itema) => {
    itema.children.forEach((itemb) => {
      itemb.children.forEach((itemc) => {
        itemc.children.forEach((itemd) => {
          if (itemd.id === id) {
            item.problemCategoryLevelIds = [itema.id, itemb.id, itemc.id]
            item.problemCategoryLevelId = [itema.name, itemb.name, itemc.name]
          }
        })
      })
    })
  })
  return item
}

/**
 * Sort the tree (via a custom function)
 * @param {Array}  treeData  Tree
 * @param {Function}  sortFun  Sorting Function
 */
export const sortTreeByFunction = function (treeData, sortFun) {
  sortData(treeData, sortFun)
  treeData.forEach((item) => {
    const children = item.children
    if (children && children.length > 0) {
      sortData(children, sortFun)
      sortTreeByFunction(children, sortFun)
    }
  })
  return treeData
}

/**
 * Sort the tree (by field)
 * @param {Array}  treeData  Tree
 * @param {string}  sortField  Sort Field
 * @param {boolean} asc       Is it in positive order?
 * @returns {Array} Sorting Tree
 */
export const sortTreeByField = function (treeData, sortField, asc = true) {
  return sortTreeByFunction(treeData, generateSortFn(sortField, asc))
}

/**
 * The last level of the tree is converted into an array
 * @param {Array}  treeData  Tree
 * @returns {Array} Arrays
 */
export const treeFinalToArray = function (treeData) {
  let result = []
  Array.from(treeData).forEach((record) => {
    if (record.childNodes && record.childNodes.length > 0) {
      const children = treeFinalToArray(record.childNodes)
      result = result.concat(children)
    }
    else {
      result.push(record.data)
    }
  })
  return result
}

/**
 * Tree conversion array
 * @param {Array}  treeData
 * @param {string}  childsKey
 * @returns {Array}
 */
export const treeToArray = function (treeData = [], childsKey = 'children') {
  let result = []
  Array.from(treeData).forEach((record) => {
    result.push(record)
    if (record[childsKey] && record[childsKey].length > 0) {
      const children = treeToArray(record[childsKey], childsKey)
      result = result.concat(children)
    }
  })
  return result
}

/**
 * Tree object conversion array
 * @param {object}  treeObject
 * @param {string}  childKey
 * @returns {Array}
 */
export const treeObjToArray = function (
  treeObject = {},
  childKey = 'children',
) {
  let result = []
  result.push(treeObject)
  if (treeObject[childKey]) {
    const children = treeObjToArray(treeObject[childKey], childKey)
    result = result.concat(children)
  }
  return result
}
