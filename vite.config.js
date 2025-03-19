import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import useUni from '@dcloudio/vite-plugin-uni'
import useUnoCSS from 'unocss/vite'
import useUniPages from '@uni-helper/vite-plugin-uni-pages'
import useRemoveConsole from 'vite-plugin-remove-console'
import postcssConfig from './postcss.config.js'

import {
  proxyPath,
  proxyPort,
  requestFilePath,
  requestPath,
  useProxy,
} from './src/configs/server.js'

import { homePage } from './src/configs/index.js'

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const proxyURL = env.VITE_APP_API_URL

  const viteEnvKeys = Object.keys(env).filter(key => key.startsWith('VITE_'))

  const define = {
    ...viteEnvKeys.reduce((config, variable) => {
      config[`process.env.${variable}`] = JSON.stringify(env[variable])
      return config
    }, {}),
  }

  return {
    plugins: [
      useUnoCSS(),
      useUniPages({
        mergePages: false,
        homePage,
      }),
      useUni(),
      ...(isProduction ? [useRemoveConsole()] : []),
    ],
    server: {
      cors: true,
      host: true,
      port: proxyPort,
      proxy: {
        ...(useProxy && proxyURL
          ? {
              [`^${proxyPath}`]: {
                target: `${proxyURL}${requestPath}`,
                changeOrigin: true,
                rewrite: path =>
                  path.replace(new RegExp(`^${proxyPath}`), ''),
              },
              // Solve the problem that uploaded images in the development environment cannot be displayed directly
              [`^${requestFilePath}`]: {
                target: `${proxyURL}${requestFilePath}`,
                changeOrigin: true,
                rewrite: path =>
                  path.replace(new RegExp(`^${requestFilePath}`), ''),
              },
            }
          : {}),
      },
    },
    resolve: {
      alias: {
        '^@': path.resolve(__dirname, './src/'),
        '$uni-router': path.resolve(__dirname, './src/utils/uni-router/'),
      },
    },
    css: {
      /** Solve the problem that external postcss.config.js is not parsed */
      postcss: postcssConfig,
    },
    build: {
      /** Solve the problem of console prompt crash in development mode under Windows */
      ...(isDevelopment
        ? {
            watch: {
              exclude: ['node_modules/**', '/__uno.css'],
            },
          }
        : {}),
      // minify: false,
    },
    define,
  }
})
