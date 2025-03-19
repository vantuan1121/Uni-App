import { cloneDeep, isArray, isString, omit } from 'lodash-es'
import qs from 'query-string'
import pages from '@/pages.json'

/**
 * Routing model
 * @param {string} methodName Routing jump method name
 * @param {object} options Routing configuration
 * @returns
 */
export function routerModel(
  methodName,
  { pathKey = 'path', params, router, pathMap = {} } = {},
) {
  // console.log('params', params)

  let options
  if (isString(params)) {
    const [path, rawQuery] = params.split('?')
    const query = qs.parse(rawQuery) || {}
    options = { path, query }
  }
  else {
    options = { ...params }
  }
  // console.log('options', options)

  const path = pathMap[options.path || '/']

  if (!path) {
    console.error(`The route was not found, please check whether it is configured correctly "${options.path}"`)
    return
  }

  methodName = hasTabBar(pages, path) ? 'switchTab' : methodName

  // console.log('pathMap', pathMap)
  // console.log('path', path)
  // console.log('methodName', methodName)

  return router[methodName]({
    ...omit(options, 'path'),
    [pathKey]: path,
    query: options.query || {},
  })
}

/**
 * Check if the specified page path is of tabbar type
 * @param {*} pages page configuration
 * @param {*} path page path
 */
export function hasTabBar(pages, path) {
  const list = pages?.tabBar?.list || []
  const listMap = list.reduce((obj, item) => {
    obj[`/${item.pagePath}`] = true
    return obj
  }, {})

  return !!listMap[path]
}

/**
 * Convert uniapp routing to VueRouter
 * @param {object} router
 * @returns {object}
 */
export function aliasTransformer(router, { addRoot = false } = {}) {
  const routes = router.options.routes || []
  const pathMap = resolvePagePath(routes, { addRoot })
  return {
    push: params =>
      routerModel('navigateTo', {
        params,
        router,
        pathMap,
        addRoot,
      }),
    replace: params =>
      routerModel('redirectTo', {
        params,
        router,
        pathMap,
        addRoot,
      }),
    replaceAll: params =>
      routerModel('reLaunch', {
        params,
        router,
        pathMap,
        addRoot,
      }),
    back: (delta = 1, params) =>
      router.navigateBack({
        params,
        delta,
      }),
  }
}

/**
 * Sort the page configuration data to adapt to the sub-packaging strategy
 * @param {*} pages page configuration
 * @returns
 */
export function resolvePages(pages, { addRoot = false } = {}) {
  pages = cloneDeep(pages)
  const value = pages?.pages || []

  const subPackages = (pages.subPackages || []).reduce((arr, item) => {
    const root = item.root
    arr.push(
      ...item.pages.map(item_1 => ({
        ...item_1,
        path: `${root}/${item_1.path}`,
      })),
    )
    return arr
  }, [])
  // console.log('subPackages', subPackages)
  value.push(...subPackages)

  if (addRoot) {
    value.forEach((item) => {
      item.path = `/${item.path}`
    })
  }

  // console.log('resolvePages.value', value)

  return value
}

/**
 * Get the root route page path value
 * @param {*} pages page configuration
 * @returns
 */
export function getRootPagePath(pages) {
  pages = isArray(pages) ? pages : pages?.pages || []
  const value = pages.find(item => item.type === 'home')?.path || ''
  return value
}

/**
 * Convert and map page paths
 * @param {*} pages page configuration
 * @returns
 */
export function resolvePagePath(
  pages,
  { shortcutName = 'aliasPath', addRoot = false } = {},
) {
  const pathList = isArray(pages) ? pages : resolvePages(pages, { addRoot })
  const pathMap = pathList.reduce((obj, item) => {
    const path = item.path

    if (item[shortcutName])
      obj[item[shortcutName]] = path

    obj[path] = path

    return obj
  }, {})

  const value = {
    ...pathMap,
    '/': getRootPagePath(pages),
  }

  // console.log('resolvePagePath.value', value)

  return value
}
