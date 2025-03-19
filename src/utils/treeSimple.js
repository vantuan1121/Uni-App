import { omit } from 'lodash-es'

const defaultOptions = {
  key: 'id', // Primary Key
  parentKey: 'parentId', // Parent node primary key
  children: 'children', // Child Nodes
  isTree: false, // Is the source data a tree structure?
}

/**
 * Convert tree structure data into a one-dimensional array
 * @param treeData
 */
export function tree2List(treeData, options = {}) {
  const props = {
    ...defaultOptions,
    ...options,
  }
  let listData = []
  treeData.forEach((item) => {
    listData.push(item)
    const children = item[props.children]
    if (children && children.length > 0) {
      listData = [...listData, ...tree2List(children, props)]
    }
  })
  return listData
}

/**
 * Convert one-dimensional array data into a tree structure
 * @param listData
 */
export function list2Tree(listData, options = {}) {
  const props = {
    ...defaultOptions,
    ...options,
  }

  const obj = {}
  // The key of the obj object is the id of each object in listData, and the value is
  listData.forEach((item) => {
    obj[item[props.key]] = item
  })

  // The tree array to be returned
  const treeData = []

  // Traverse the original one-dimensional array
  for (let i = 0; i < listData.length; i++) {
    const item = listData[i] // Each item in the original one-dimensional array
    const parent = obj[item[props.parentKey]] // Get the parent of the current item from the previously saved object
    if (parent) {
      if (parent[props.children]) {
        parent[props.children].push(item) // The children of the parent item are added to the child item
      }
      else {
        parent[props.children] = []
        parent[props.children].push(item)
      }
    }
    else {
      treeData.push(item) // Otherwise, directly add the current item to the final tree array as the root (because this item has no parent item)
    }
  }
  return treeData
}

/**
 * Find the specified child node
 * @param {number|string} key
 * @param treeData
 * @param props
 */
export function getNodeByKey(key, treeData, options = {}) {
  const props = {
    ...defaultOptions,
    ...options,
  }

  if (!treeData || treeData.length === 0) {
    return null
  }

  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i]
    if (node[props.key] === key) {
      return node
    }
    const children = node[props.children]
    if (children && children.length > 0) {
      const targetNode = getNodeByKey(key, children, props)
      if (targetNode) {
        return targetNode
      }
    }
  }
  return null
}

/**
 * Get all child nodes under a node
 * @param {number|string} key
 * @param treeData
 * @param props
 */
export function getChildrenByKey(key, treeData, options = {}) {
  const props = {
    ...defaultOptions,
    ...options,
  }
  const targetNode = getNodeByKey(key, treeData, props)
  if (!targetNode) {
    return []
  }
  const children = targetNode[props.children]
  if (children && children.length > 0) {
    return tree2List(children, props)
  }
  return []
}

/**
 * Traverse each tree node
 * @param treeData
 * @param callback
 * @param props
 */
export function forEachNode(treeData, callback, options = {}) {
  if (!treeData)
    return []

  const props = {
    ...defaultOptions,
    ...options,
  }

  treeData.forEach((item) => {
    callback(item, treeData)
    const children = item[props.children]
    forEachNode(children, callback, props)
  })
}

/**
 * map Each tree node
 * @param treeData
 * @param callback
 * @param props
 */
export function mapNode(treeData, callback, options = {}) {
  if (!treeData)
    return []

  const props = {
    ...defaultOptions,
    ...options,
  }

  return treeData.map(item => ({
    ...callback(item, treeData),
    children: mapNode(item[props.children], callback, props),
  }))
}

/**
 * filter Each tree node
 * @param treeData
 * @param callback
 * @param props
 */
export function filterTree(treeData, callback, options = {}) {
  if (!treeData)
    return []

  const props = {
    ...defaultOptions,
    ...options,
  }

  const selectedNodes = []
  forEachNode(
    treeData,
    (item) => {
      if (callback(item, treeData)) {
        selectedNodes.push(omit(item, props.children))
      }
    },
    props,
  )

  const value = list2Tree(selectedNodes, props)

  return value
}

/**
 * Get all parent nodes
 * @param {number|string} key
 * @param data Can be listData or treeData
 * @param props
 */
export function getParentNodes(key, data, options = {}) {
  if (!key && key !== 0) {
    return []
  }

  const props = {
    ...defaultOptions,
    immediate: false, // Get only the immediate parent
    ...options,
  }

  const listData = props.isTree ? tree2List(data, props) : data

  const targetNode = listData.find(item => item[props.key] === key)

  if (!targetNode) {
    return []
  }

  const parentNodeIndex = listData.findIndex(
    item => item[props.key] === targetNode[props.parentKey],
  )

  if (parentNodeIndex === -1) {
    return []
  }

  const parentNode = listData[parentNodeIndex]

  if (props.immediate) {
    return [parentNode]
  }

  return [
    ...getParentNodes(parentNode[props.key], listData, {
      ...props,
      isTree: false,
    }),
    parentNode,
  ]
}
