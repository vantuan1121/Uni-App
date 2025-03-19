<template>
  <view class="h-full px-4 flex flex-col">
    <view class="font-bold pt-8 pb-4 flex-none">
      Basic personal information
    </view>
    <view class="flex-1 h-0">
      <uv-form
        ref="uForm"
        label-position="left"
        :model="formData"
        :label-width="90"
      >
        <uv-form-item label="Gender" prop="userSex" border-bottom>
          <uv-radio-group
            v-model="formData.userSex"
            placement="row"
            v-bind="{
              activeColor: 'rgba(var(--color-primary), 1)',
            }"
            disabled
          >
            <view>
              <uv-radio label="Male" :name="1"></uv-radio>
            </view>
            <view class="pl-4">
              <uv-radio label="Female" :name="2"></uv-radio>
            </view>
          </uv-radio-group>
        </uv-form-item>
        <uv-form-item label="Household registration information" prop="nativePlace" border-bottom>
          <AreaPickerTrigger v-model="formData.nativePlace">
            <template #default="{ value }">
              <view class="flex items-center w-full">
                <view class="flex-1 w-0">
                  <uv-input
                    :model-value="value"
                    placeholder="Please select household registration information"
                    border="none"
                    readonly
                  ></uv-input>
                </view>
                <view class="flex-none">
                  <uv-icon name="arrow-right"></uv-icon>
                </view>
              </view>
            </template>
          </AreaPickerTrigger>
        </uv-form-item>
        <uv-form-item label="Head of household" prop="realName" border-bottom>
          <uv-input
            v-model="formData.realName"
            placeholder="Please enter the name of the householder"
            border="none"
          ></uv-input>
        </uv-form-item>
        <uv-form-item label="Phone number" prop="userPhone" border-bottom>
          <view class="flex">
            <uv-input
              v-model="formData.userPhone"
              placeholder="Please enter your phone number"
              border="none"
            ></uv-input>
            <view class="flex-none pl-1">
              <uv-button
                type="primary"
                size="small"
                open-type="getPhoneNumber"
                readonly
                @getphonenumber="getPhoneNumber"
              >
                Get mobile phone number
              </uv-button>
            </view>
          </view>
        </uv-form-item>
      </uv-form>
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
import AreaPickerTrigger from './AreaPicker/trigger.vue'
import { getSexText, sleep } from '@/utils'

export default {
  components: {
    AreaPickerTrigger,
  },
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
        userSex: 1,
        nativePlace: [],
        realName: '',
        userPhone: '',
      },
      formRules: {
        nativePlace: {
          validator: (rule, value, callback) => !!value.length,
          message: 'Household registration information cannot be empty',
          trigger: ['blur'],
        },
        realName: {
          required: true,
          message: 'Householder name cannot be empty',
          trigger: ['blur'],
        },
        userPhone: [
          {
            required: true,
            message: 'Mobile phone number cannot be empty',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => uni.$u.test.mobile(value),
            message: 'The phone number format is incorrect',
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
      realName: this.params.realName || this.userInfo.realName,
      userSex: this.getUserSex(),
      nativePlace: this.userInfo.nativePlace
        ? [
            this.userInfo.countyId,
            this.userInfo.townId,
            this.userInfo.villageId,
          ]
        : [],
      userPhone: this.userInfo.userPhone,
    }
  },
  mounted() {
    this.$refs.uForm.setRules(this.formRules)
  },
  methods: {
    getUserSex() {
      const idcardNo = this.params.idcardNo || this.userInfo.idcardNo
      const value = getSexText(idcardNo) === '男' ? 1 : 2
      return value
    },
    async getPhoneNumber(event) {
      console.log('getPhoneNumber.event', event)

      const params = {
        wxCode: event.detail.code,
      }

      const res = await this.$api.phoneNumber(params)
      if (res.success) {
        this.formData.userPhone = res.data.phoneNumber
      }
    },

    async handleSubmit() {
      try {
        await this.$refs.uForm.validate()
      }
      catch (error) {
        console.warn('error', error)
        return
      }

      const [county, town, village] = this.formData.nativePlace
      const params = {
        ...this.formData,
        nativePlace: this.formData.nativePlace
          .map(item => item.deptName)
          .join(''),
        countyId: county.qywechatDeptId,
        townId: town.qywechatDeptId,
        villageId: village.qywechatDeptId,
      }

      console.log('params', params)

      this.$loading(true)
      await sleep()
      this.$loading(false)

      this.handler({
        active: 2,
        params,
      })
    },
  },
}
</script>

<style></style>
