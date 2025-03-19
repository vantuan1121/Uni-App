<template>
  <view class="h-full flex flex-col px-4 py-3 bg-gray-50">
    <view class="p-4 bg-white mt-4 shadow-md rounded-md">
      <uv-form label-width="200" :border-bottom="false">
        <uv-form-item label="Name">
          <view class="" @click="handleCopy(enterpriseInfo.name)">
            {{ enterpriseInfo.name }}
            <via-icon name="fuzhi" class="text-gray-400"></via-icon>
          </view>
        </uv-form-item>
        <uv-form-item label="Website">
          <view class="" @click="handleCopy(enterpriseInfo.address)">
            {{ enterpriseInfo.address }}
            <via-icon name="fuzhi" class="text-gray-400"></via-icon>
          </view>
        </uv-form-item>
      </uv-form>
    </view>
  </view>
</template>

<script>
import { enterpriseInfo } from '@/configs/index.js'

export default {
  data() {
    return {
      enterpriseInfo,
    }
  },
  computed: {},
  methods: {},
}
</script>

<style></style>
