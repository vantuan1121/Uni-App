import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  easycom: {
    autoscan: true,
    custom: {
      // '^u-(.*)': 'uview-plus/components/u-$1/u-$1.vue',
      '^uni-(.*)': '@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue',
      '^uv-(.*)': '@climblee/uv-ui/components/uv-$1/uv-$1.vue',
      '^(?!z-paging-refresh|z-paging-load-more)z-paging(.*)':
        'z-paging/components/z-paging$1/z-paging$1.vue',
    },
  },
  pages: [
    {
      path: 'pages/index/home/index',
      aliasPath: '/',
    },
    {
      path: 'pages/index/search/search-header/ImageSearch',
      aliasPath: '/ImageSearch',
    },
    {
      path: 'pages/index/search/Tab/TabBar',
      aliasPath: '/TabBar',
    },
    {
      path: 'pages/index/search/search-header/UserDetail',
      aliasPath: '/UserDetail',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Nature',
      aliasPath: '/Nature',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Textures',
      aliasPath: '/Textures',
    },
    {
      path: 'pages/index/search/browse/browse-menu/BlackandWhite',
      aliasPath: '/BlackandWhite',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Abstract',
      aliasPath: '/Abstract',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Space',
      aliasPath: '/Space',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Minimal',
      aliasPath: '/Minimal',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Animals',
      aliasPath: '/Animals',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Sky',
      aliasPath: '/Sky',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Flowers',
      aliasPath: '/Flowers',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Travel',
      aliasPath: '/Travel',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Underwater',
      aliasPath: '/Underwater',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Drones',
      aliasPath: '/Drones',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Architecture',
      aliasPath: '/Architecture',
    },
    {
      path: 'pages/index/search/browse/browse-menu/Gradients',
      aliasPath: '/Gradients',
    },
    {
      path: 'pages/index/user/index',
      aliasPath: '/user',
    },
    {
      path: 'pages/login/phone/index',
      aliasPath: '/login',
      style: {
        navigationStyle: 'custom',
      },
    },
    {
      path: 'pages/errors/404/index',
      aliasPath: '/404',
      style: {
        navigationBarTitleText: '404',
      },
    },
  ],
  subPackages: [
    {
      root: 'pages/webview',
      pages: [
        {
          path: 'index',
          aliasPath: '/webview',
          style: {
            navigationBarTitleText: 'webview',
          },
        },
      ],
    },
    {
      root: 'pages/middleware',
      pages: [
        {
          path: 'index',
          aliasPath: '/middleware',
          meta: {
            middleware: ['realname'],
          },
          style: {
            navigationBarTitleText: 'Routing middleware',
          },
        },
      ],
    },
    {
      root: 'pages/statement',
      pages: [
        {
          path: 'index',
          aliasPath: '/statement',
          style: {
            navigationBarTitleText: 'Product Service Agreement',
          },
        },
      ],
    },
    {
      root: 'pages/realname',
      pages: [
        {
          path: 'index',
          aliasPath: '/realname',
          style: {
            navigationBarTitleText: 'Real-name authentication',
          },
        },
      ],
    },
    {
      root: 'pages/contact',
      pages: [
        {
          path: 'index',
          aliasPath: '/contact',
          style: {
            navigationBarTitleText: 'Contact Us',
          },
        },
      ],
    },
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#018d71',
    backgroundColor: '#F8F8F8',
    list: [
    ],
  },
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarBackgroundColor: '#ffffff',
    backgroundColor: '#f8f8f8',
  },
  // condition: {
  //   current: 0,
  //   list: [
  //     {
  //       name: 'pages/contact/index',
  //       path: 'pages/contact/index',
  //     },
  //   ],
  // },
})
