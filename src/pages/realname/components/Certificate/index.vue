<template>
  <view class="h-full pt-8 px-4 flex flex-col overflow-hidden">
    <view class="overflow-auto flex-1 h-0">
      <view
        v-for="(item, index) of formModel"
        :key="index"
        class="pb-6"
      >
        <view class="font-bold">
          {{ item.stepText }}：Please take a photo/Upload your ID card {{ item.keyword }}
        </view>
        <view class="text-gray-500 text-sm pt-2">
          Please keep your ID card intact and clear
        </view>
        <view
          class="relative mt-4 overflow-hidden h-[177px]"
          @click="handleChooseImage(item.prop)"
        >
          <view
            v-if="formData[item.prop]"
            class="flex items-center justify-center absolute inset-0 h-full"
          >
            <image
              :src="formData[item.prop]"
              class="h-full"
              mode="heightFix"
            />
          </view>
          <view
            v-else
            class="h-full"
          >
            <image
              :src="item.imgURL"
              mode="widthFix"
              class="w-full"
            />

            <view class="position-center text-center">
              <image
                :src="$assets('/images/realname/icon-camera.png')"
                class="h-14"
                mode="heightFix"
              />
              <view class="pt-2">
                Photograph/Upload ID card {{ item.keyword }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="flex-none pb-4">
      <uv-button
        type="primary"
        size="large"
        shape="circle"
        text="Accept"
        @click="handleSubmit"
      >
      </uv-button>
    </view>
  </view>
</template>

<script>
import { chooseImage } from '@uni-helper/uni-promises'
import { getFileBaseURL } from '@/configs/request'

export default {
  props: {
    handler: {
      type: Function,
      default: () => () => {},
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {
        idCardFontUrl: '',
        idCardBackUrl: '',
      },
    }
  },
  computed: {
    formModel() {
      return [
        {
          stepText: 'First step',
          keyword: 'Portrait',
          imgURL: this.$assets('/images/realname/bg-certificate-portrait.png'),
          prop: 'idCardFontUrl',
        },
        {
          stepText: 'Step 2',
          keyword: 'National Emblem',
          imgURL: this.$assets('/images/realname/bg-certificate-badge.png'),
          prop: 'idCardBackUrl',
        },
      ]
    },
    userInfo() {
      return this.$store.user.userInfo
    },
  },
  created() {
    this.formData = {
      ...this.formData,
      idCardFontUrl: this.userInfo.idCardFontUrl,
      idCardBackUrl: this.userInfo.idCardBackUrl,
    }
  },
  methods: {
    async handleSubmit() {
      console.log('this.formData', this.formData)
      const verifyed = Object.values(this.formData).every(value => !!value)

      if (!verifyed) {
        this.$toast('Please upload a photo of your ID card first')
        return
      }
      const params = {
        ...this.params,
        ...this.formData,
      }

      this.$loading(true)
      const res = await this.$api.wxrealnameAuth(params)
      this.$loading(false)

      if (res.success) {
        this.handler({
          active: 3,
          params: this.formData,
        })
        return
      }

      this.$toast('Real-name authentication failed, please contact customer service')
    },
    async handleChooseImage(prop) {
      let filePath = ''
      try {
        const ret = await chooseImage({
          count: 1,
        })

        filePath = ret.tempFilePaths[0]
        console.log('chooseImage.ret', ret)
      }
      catch (error) {
        console.warn('handleChooseImage.error', error)
        return
      }

      if (!filePath) {
        return
      }

      const res = await this.$api.uploadFile({
        name: 'file',
        filePath,
      })

      if (res.success) {
        const data = `${getFileBaseURL()}/${res.data}`
        // console.log('data', data)
        this.formData[prop] = data
      }
    },
  },
}
</script>

<style></style>
