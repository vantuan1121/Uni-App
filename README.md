# vite-uniapp-template

🚀 Uniapp best practice integration template based on vitejs driver

## Features

- 💪 Assets: A global static resource loading tool is provided, which can seamlessly switch between loading local static resources and remote static resources, solving the problem of package size limitation in the mini program environment.
- 📦 SubPackages: The sub-packaging style that conforms to the mental model, the reasonable pages directory structure, and the sub-packaging configuration make it easy to implement functional sub-packaging.
- 🛣 Router: Use [uniapp-router-next](https://gitee.com/wen-jason/uni-router/tree/main/packages/uniapp-router-next), and through optimized encapsulation, the API is similar to VueRouter, and the interceptor, middleware, and routing alias functions are extended.
- 📊 Store: Use [Pinia](https://pinia.vuejs.org/zh/) Powerful driver, easy to manage application status.
- ⚡️ Request: Request library usage [uni-network](https://github.com/uni-helper/uni-network) A high-performance request library written entirely based on the uniapp API, with the same API as axios.
- 👇 Z-paging: It has a built-in high-performance and easy-to-use business-common drop-down paging component module, which can easily implement functions such as pull-down refresh and pull-up load.
- 💅 Unocss: Using the atomic CSS engine, the atomic class naming writing rules are still perfectly supported in the mini-program environment.
- 🎨 UI-libs: Preset [uv-ui](https://www.uvui.cn/) and [uni-ui](https://uniapp.dcloud.net.cn/component/uniui/uni-ui.html) The two complement each other, easily meeting the vast majority of business scenarios and supporting theme color customization.
- 📝 NoTs: Only use JavaScript, TypeScript will not improve the development experience in regular business scenarios or when there is a huge gap in the level of personnel.

## How to use

### Clone the project

```shell
git clone https://github.com/VBotDevTeam/uni-app-template.git
```

### Install project dependencies

> Open and enter the cloned project root directory and execute the following command
> The following commands are recommended to use pnpm, but you can still use npm/yarn

```shell
pnpm install
```

### Run the project

#### Run this project directly with any editor

```shell
# h5
pnpm dev:h5

# Android
pnpm dev:app-android
#... For more information, see package.json/script
```

#### Run this project in HBuilder

1. Drag the project into HBuilder
2. Use pnpm install to install dependencies
3. Click any file in the project /src directory
4. Click Run above the editor and select the environment you want to run

### Functional Example

#### Static resource processing

```js
// Using remote static resources
// import { useAssets } from './utils/assets/remote'

// Using local static resources
import { useAssets } from './utils/assets/local'

// Global Mount
app.config.globalProperties.$assets = useAssets

// Use in template
//  <img :src="$assets('/temp.png')" />
```

#### Global theme color customization

> Depend on [unocss-preset-shades](https://github.com/viarotel-org/packages/tree/main/packages/unocss-preset-shades#readme) providing support

```html
<!-- Set the text color to the theme color 500 -->
<div class="text-primary-500"></div>
<!-- Set the background color to the theme color 500 -->
<div class="bg-primary-500"></div>
<!-- Set the border color to the theme color 500 -->
<div class="border border-primary-500"></div>
<!-- For more usage, please refer to https://tailwindcss.com/docs -->
```

#### Request backend data

> For detailed usage, please refer to [uni-network](https://github.com/uni-helper/uni-network)

```js
import request from '@/utils/request/index.js'

// GET
request.get(
  '/mock',
  { id: 'mock-id' },
  {
    /* More option */
  }
)

// POST
request.post(
  '/mock',
  { id: 'mock-id' },
  {
    /* More option */
  }
)

// Upload
request.upload({
  url: '/mock',
  dataType: 'json',
  headers: {
    'content-type': 'multipart/form-data',
  },
})

// Common
request({
  method: 'post',
  url: '/mock',
  data: {
    id: 'mock-id',
  },
  headers: {
    'content-type': 'application/json',
  },
})

// Extension Methods

// Inherited from request.post, the request header adds 'Content-Type': 'multipart/form-data' by default
request.form(
  '/mock',
  { id: 'mock-id' },
  {
    /* More option */
  }
)

// Inherited from request.post, the request header adds 'Content-Type': 'application/x-www-form-urlencoded' by default
request.query(
  '/mock',
  { id: 'mock-id' },
  {
    /* More option */
  }
)
```

#### Function jump between routes

```js
// Jump to page
const methods = {
  routerDemo() {
    this.$Router.push({
      path: '/login',
      query: {
        id: 'id',
      },
    })
    // Get page parameters
    this.$Route.query.id

    // Close the current page and jump to a certain page
    this.$Router.replace('/login')
    // Close all open pages and jump to a certain page
    this.$Router.replaceAll('/login')
  },
}

// Setting an alias for a route
// In pages.config.js
const aliasConfig = {
  path: 'pages/login/index',
  // By adding the aliasPath field
  aliasPath: '/login',
}
```

#### Using route guards

> Located in router/guards

```js
import store from '@/store/index.js'

const homePath = '/pages/index/index'
const loginPath = '/pages/login/index'

const whiteList = [loginPath]

export default (router) => {
  const userStore = store.useUserStore()

  const loginRoute = to => ({
    path: loginPath,
    navType: 'reLaunch',
    force: true,
    query: {
      redirect: {
        path: to.path,
        query: to.query,
      },
    },
  })

  router.beforeEach((to, from, next) => {
    // console.log('permission.beforeEach.to', to)
    // console.log('permission.beforeEach.from', from)

    const token = userStore.token
    const userId = userStore.userId

    console.log('token', token)
    console.log('userId', userId)

    if (token) {
      if (to.path === loginPath) {
        next(homePath)
      }
      else if (userId) {
        next()
      }
      else {
        userStore
          .getUserInfo()
          .then(() => {
            next()
          })
          .catch((error) => {
            console.warn(error)
            userStore.logout({ silenced: true })
            next(loginRoute(to))
          })
      }
    }
    else if (whiteList.includes(to.path)) {
      next()
    }
    else {
      next(loginRoute(to))
    }
  })

  router.afterEach(() => {})
}
```

#### Using route-based middleware

> pages.config.js

```js
// Use the middleware named realname
const pageConfig = {
  path: '/pages/user/index',
  aliasPath: '/user',
  meta: {
    middleware: ['realname'],
  },
}
```

Defining middleware

> router/guards/index.js

```js
// Use defineMiddleware to define and package as middleware
import realname from './realname/index.js'
import { defineMiddleware } from '$uni-router/middleware'

export default (app, router) => {
  // Use defineMiddleware to define the routing middleware
  defineMiddleware(realname, { router, app })
}
```

Writing routing middleware code

> router/guards/realname/index.js

```js
import store from '@/store/index.js'
import { useDialog, useToast } from '@/utils/modals'

export default (router) => {
  const userStore = store.useUserStore()

  router.beforeEach((to, from, next) => {
    console.log('realname.beforeEach.to', to)
    console.log('realname.beforeEach.from', from)

    const realStatus = userStore.userInfo.realStatus

    switch (realStatus) {
      case 3:
        next()
        break
      case 2:
        useToast('Real-name verification in progress, please try again later').then(() => {
          next(false)
        })
        break
      case 4:
        useDialog(`${userStore.userInfo.auditResult || 'The real-name information submitted does not match'}`, {
          title: 'Real-name failure',
          showCancelButton: true,
          confirmText: 'Recertification',
        })
          .then(() => {
            next({ path: '/pages/realname/index' })
          })
          .catch(() => {
            next(false)
          })
        break
      default:
        useDialog('Please complete real-name authentication first', { showCancelButton: true })
          .then(() => {
            next({ path: '/pages/realname/index' })
          })
          .catch(() => {
            next(false)
          })
        break
    }
  })
  // router.afterEach(() => {})
}
```

### Mainly used packages

- vitejs
- uniapp
- pinia
- uview-plus
- uni-ui
- @uni-helper/uni-network
- uniapp-router-next
- z-paging
- unocss
- unocss-applet

### Frequently asked questions

#### Unable to install dependencies/unable to start

Delete the pnpm-lock.yaml / yarn.lock / package-lock.json file and reinstall the dependencies

### Get Help

> Because it is an open source project, it is all powered by love, so support is limited and the update rhythm is not fixed
>
> Note: For non-bug or unplanned needs, we will charge for handling them. As for the amount, it depends on the difficulty of the problem and how much you think you have helped. (Maintaining these projects has already consumed a lot of energy, and it would be unreasonable to spend time answering questions for free...so those who ask for free will not be accepted.)

- issues: [issues](https://github.com/VBotDevTeam/uni-app-template/issues)
