import { createSSRApp } from 'vue'

import 'virtual:uno.css'

import App from './App.vue'

import store from './store/index.js'

import router from './router/index.js'
import routerGuards from './router/guards/index.js'

import api from './api/index.js'
import plugins from './plugins/index.js'
import mixins from './mixins/index.js'

import ViaIcon from './icons/components/ViaIcon/index.vue'
import { useDialog, useLoading, useToast } from './utils/modals/index.js'
import _showDictLabel from './utils/showDictLabel.js'

// Use remote static resources when it is remote. Commonly used in mini-programs
// Use local static resources when it is local
// import { useAssets } from './utils/assets/remote.js'
import { useAssets } from './utils/assets/local.js'

export function createApp() {
  const app = createSSRApp(App)

  app.use(store)

  app.use(router)
  app.use(routerGuards, router)

  app.use(api)
  app.use(plugins)
  app.use(mixins)
  app.component('ViaIcon', ViaIcon)

  app.config.globalProperties.$dialog = useDialog
  app.config.globalProperties.$toast = useToast
  app.config.globalProperties.$loading = useLoading

  app.config.globalProperties.$showDictLabel = _showDictLabel

  // Static resource loading tool
  app.config.globalProperties.$assets = useAssets

  return {
    app,
    Pinia: store.Pinia,
  }
}
