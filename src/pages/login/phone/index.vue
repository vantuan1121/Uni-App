<template>
  <view class="bg-white h-full overflow-hidden pt-24">
    <view class="mt-8">
      <image src="/static/logo.png" alt="" class="w-20 h-20 block mx-auto" />
      <view class="text-2xl text-center mt-4 font-bold">
        {{ appName }}
      </view>
    </view>
    <view class="px-4 mt-18">
      <uv-button type="primary" shape="circle" ripple @click="handleLogin">
        Login
      </uv-button>
      <view class="text-start mt-4 flex items-start justify-center gap-1">
        <checkbox :checked="agreed" class="">
        </checkbox>
        <text>
          I have read and agreed
          <text
            class="text-primary active:text-primary-700"
            @click.stop="handleAgree"
          >
            Product Service Agreement
          </text>
        </text>
      </view>
    </view>
    <view
      class="absolute inset-x-0 bottom-0 text-center mb-4 text-gray-400 text-sm"
    >
      <view>
        Supported by
        <text
          class="text-primary-500 underline active:text-primary-700"
          @click="handleInfo"
        >
          {{ enterpriseInfo.name }}
        </text>
        v{{ version }}
      </view>
    </view>
  </view>
</template>

<script>
import { version } from '/package.json'
import { appName, enterpriseInfo } from '@/configs/index'
import coderJSON from '@/utils/coderJSON.js'

export default {
  data() {
    return {
      appName,
      enterpriseInfo,
      version,
      agreed: false,
    }
  },
  onShow() {},
  methods: {
    handleInfo() {
      this.$Router.push({
        path: '/webview',
        query: {
          title: 'vbot-dev-team',
          src: 'https://github.com/VBotDevTeam/',
        },
      })
    },
    handleAgree() {
      this.$Router.push({ path: '/pages/statement/index' })
    },
    async handleLogin() {
      if (!this.agreed) {
        try {
          await this.$dialog('Have you read and agreed to the Product Service Agreement?', {
            showCancelButton: true,
            confirmButtonText: 'Agree',
            cancelButtonText: 'Cancel',
          })

          this.agreed = true
        }
        catch (error) {
          console.log('error', error)
          return
        }
      }

      const params = {}

      await this.$store.user.login(params)
      await this.$toast('Login successful', { type: 'success' })
      this.handleSuccess()
    },
    async handleSuccess() {
      const user = this.$store.user

      try {
        await user.getUserInfo()

        if (this.$Route.query.redirect) {
          const redirect = coderJSON.parse(this.$Route.query.redirect)
          // console.log('redirect', redirect)

          this.$Router.replaceAll(redirect)
        }
        else {
          this.$Router.replaceAll('/')
        }
      }
      catch (error) {
        console.warn('error', error)
      }
    },
  },
}
</script>

<style></style>
