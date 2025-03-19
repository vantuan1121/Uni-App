<template>
  <view class="h-full px-4 flex flex-col">
    <view class="font-bold pt-8 pb-4 flex-none">
      Personally Identifiable Information
    </view>
    <view class="flex-1 h-0">
      <uv-form
        ref="uForm"
        :model="formData"
        :label-width="90"
        :border-bottom="true"
        label-position="left"
      >
        <uv-form-item label="Name" prop="realName" :border-bottom="true">
          <uv-input
            v-model="formData.realName"
            placeholder="Please enter your name"
            border="none"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="ID number" prop="idcardNo" :border-bottom="true">
          <uv-input
            v-model="formData.idcardNo"
            placeholder="Please enter your ID number"
            border="none"
          ></uv-input>
        </uv-form-item>
      </uv-form>
      <view class="text-red-500 text-xs pt-4">
        Note: This is just for demonstration, the name and ID card do not need to be real, but the format must be correct
      </view>
    </view>
    <view class="flex-none pb-4">
      <uv-button
        type="primary"
        text="Accept"
        shape="circle"
        size="large"
        @click="handleSubmit"
      ></uv-button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    handler: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      formData: {
        realName: '',
        idcardNo: '',
      },
      formRules: {
        realName: {
          type: 'string',
          required: true,
          message: 'Name cannot be empty',
          trigger: ['blur'],
        },
        idcardNo: [
          {
            type: 'string',
            required: true,
            message: 'ID number cannot be empty',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => uni.$u.test.idCard(value),
            message: 'ID number format is incorrect',
            trigger: ['blur'],
          },
        ],
      },
    }
  },
  computed: {
    userInfo() {
      return this.$store.user.userInfo
    },
  },
  created() {
    this.formData = {
      ...this.formData,
      realName: this.userInfo.realName,
      idcardNo: this.userInfo.idcardNo,
    }
  },
  mounted() {
    this.$refs.uForm.setRules(this.formRules)
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$refs.uForm.validate()
      }
      catch (error) {
        console.warn('error', error)
        return
      }

      const params = {
        ...this.formData,
      }
      this.$loading(true)
      const res = await this.$api.checkUserinfo(params)
      this.$loading(false)
      if (res.success) {
        const imported = res.data
        if (imported) {
          this.handleBind()
          return
        }

        this.handler({
          active: 1,
          params: this.formData,
        })
      }
    },
    async handleBind() {
      const params = {
        ...this.formData,
      }
      this.$loading(true)
      const res = await this.$api.bindUserinfo(params)
      this.$loading(false)
      if (res.success) {
        const binded = res.data
        if (binded) {
          await this.$toast('The user information already exists, automatic binding is successful')
          this.handler({
            active: 3,
            params: {
              ...this.formData,
              binded,
            },
          })
          return
        }

        this.$toast('Binding failed, please contact customer service')
      }
    },
  },
}
</script>

<style></style>
