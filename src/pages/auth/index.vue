<script setup lang="ts">
import { reactive, ref } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { httpPost } from '@/utils/http'

const appStore = useAppStore()
const isLogin = ref(true)

// 登录表单
const loginFormRef = ref()
const loginFormData = reactive({
  phone: '',
  password: '',
})
const loginRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { required: true, pattern: /^1\d{10}$/, message: '手机号格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { required: true, min: 6, message: '密码长度至少6位', trigger: 'blur' },
  ],
}

// 注册表单
const registerFormRef = ref()
const registerFormData = reactive({
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
})
const registerRules = {
  phone: loginRules.phone,
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: loginRules.password,
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { required: true, message: '', validator: (value: string) => {
      if (value !== registerFormData.password) {
        return Promise.reject('两次输入的密码不一致')
      }
      return Promise.resolve()
    }, trigger: 'blur' },
  ],
}

const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// 注册接口调用，已符合front-rule
const { loading: regLoading, error: regError, data: regData, run: regRun } = useRequest<{ id: string }>(
  () => httpPost<{ id: string }>('/user/register', {
    phone: registerFormData.phone,
    password: registerFormData.password,
    username: registerFormData.username,
  }),
  { immediate: false },
)

// 登录接口调用，严格参照front-rule
const { loading: loginLoading, error: loginError, data: loginData, run: loginRun } = useRequest<any>(
  () => httpPost('/user/login', {
    phone: loginFormData.phone, // 修正为 phone 字段
    password: loginFormData.password,
  }),
  { immediate: false },
)

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
  // 清空表单数据
  loginFormData.phone = ''
  loginFormData.password = ''
  registerFormData.phone = ''
  registerFormData.username = ''
  registerFormData.password = ''
  registerFormData.confirmPassword = ''
}

async function onLogin() {
  error.value = ''
  loading.value = true
  loginFormRef.value
    .validate()
    .then(async ({ valid }) => {
      if (!valid) {
        loading.value = false
        return
      }
      try {
        await loginRun()
        console.log(loginData)
        if (loginData.value) {
          // 存储token
          wx.setStorageSync('token', loginData.value.token)
          // 存储用户信息到全局store
          appStore.state.user = loginData.value.userInfo
          appStore.state.isAuthenticated = true
          wx.setStorageSync('library_user', JSON.stringify(loginData.value.userInfo))
          uni.showToast({ title: loginData.value.msg, icon: 'success' })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/home/index' })
          }, 500)
        }
        else {
          error.value = loginData.value?.msg || '登录失败'
          uni.showToast({ title: error.value, icon: 'error' })
        }
      }
      catch (e: any) {
        // loginError.value 可能为undefined或对象，需类型判断
        if (loginError.value && typeof loginError.value === 'object') {
          error.value = (loginError.value as any)?.data?.msg || (loginError.value as any)?.message || '登录失败，请稍后重试'
        }
        else {
          error.value = '登录失败，请稍后重试'
        }
        uni.showToast({ title: error.value, icon: 'error' })
      }
      finally {
        loading.value = false
      }
    })
    .catch((error) => {
      loading.value = false
      console.log(error, 'error')
    })
}

async function onRegister() {
  error.value = ''
  registerFormRef.value
    .validate()
    .then(async ({ valid }) => {
      if (!valid) {
        return
      }
      try {
        await regRun()
        if (regData.value?.id) {
          uni.showToast({ title: '注册成功', icon: 'success' })
          setTimeout(() => {
            isLogin.value = true
            error.value = ''
            loginFormData.phone = ''
            loginFormData.password = ''
            registerFormData.phone = ''
            registerFormData.username = ''
            registerFormData.password = ''
            registerFormData.confirmPassword = ''
          }, 500)
        }
        else {
          error.value = regData.value && (regData.value as any).msg
            ? (regData.value as any).msg
            : '注册失败，请稍后重试'
        }
      }
      catch (e: any) {
        error.value = e?.msg || e?.message || '注册失败，请稍后重试'
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}
</script>

<template>
  <view class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <view class="relative bg-white px-6 pb-8 pt-12 text-center">
      <view class="bg-green-gradient-br mx-auto mb-6 h-20 w-20 flex items-center justify-center rounded-2xl shadow-lg">
        <view class="i-carbon-book text-4xl text-white" />
      </view>
      <text class="mb-2 block text-2xl text-gray-900 font-bold">
        {{ isLogin ? '欢迎使用' : '创建账户' }}
      </text>
      <text class="block text-gray-600">
        智能图书管理系统
      </text>
    </view>
    <!-- Form Container -->
    <view class="flex-1 px-6 py-8">
      <view class="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <!-- 登录表单 -->
        <wd-form v-if="isLogin" ref="loginFormRef" :model="loginFormData" :rules="loginRules">
          <wd-cell-group border>
            <wd-input
              v-model="loginFormData.phone"
              label="手机号"
              prop="phone"
              placeholder="请输入手机号"
              type="number"
              clearable
            />
            <wd-input
              v-model="loginFormData.password"
              type="text"
              :password="!showPassword"
              label="密码"
              prop="password"
              placeholder="请输入密码"
              clearable
              :right-icon="showPassword ? 'view-off' : 'view'"
              @right-icon-click="showPassword = !showPassword"
            />
          </wd-cell-group>
          <view v-if="error" class="mt-4 border border-red-100 rounded-xl bg-red-50 p-4">
            <text class="block text-center text-sm text-red-700">
              {{ error }}
            </text>
          </view>
          <view class="mt-6">
            <wd-button
              type="primary"
              block
              :loading="loading"
              :disabled="loading"
              @click="onLogin"
            >
              登录
            </wd-button>
          </view>
        </wd-form>
        <!-- 注册表单 -->
        <wd-form v-else ref="registerFormRef" :model="registerFormData" :rules="registerRules">
          <wd-cell-group border>
            <wd-input
              v-model="registerFormData.phone"
              label="手机号"
              prop="phone"
              placeholder="请输入手机号"
              type="number"
              clearable
            />
            <wd-input
              v-model="registerFormData.username"
              label="用户名"
              prop="username"
              placeholder="请输入用户名"
              clearable
            />
            <wd-input
              v-model="registerFormData.password"
              type="text"
              :password="!showPassword"
              label="密码"
              prop="password"
              placeholder="请输入密码"
              clearable
              :right-icon="showPassword ? 'view-off' : 'view'"
              @right-icon-click="showPassword = !showPassword"
            />
            <wd-input
              v-model="registerFormData.confirmPassword"
              type="text"
              :password="true"
              label="确认密码"
              prop="confirmPassword"
              placeholder="请再次输入密码"
              clearable
            />
          </wd-cell-group>
          <view v-if="error" class="mt-4 border border-red-100 rounded-xl bg-red-50 p-4">
            <text class="block text-center text-sm text-red-700">
              {{ error }}
            </text>
          </view>
          <view class="mt-6">
            <wd-button
              type="primary"
              block
              :loading="regLoading"
              :disabled="regLoading"
              @click="onRegister"
            >
              注册
            </wd-button>
          </view>
        </wd-form>
      </view>
      <!-- Switch -->
      <view class="text-center">
        <text class="mb-4 block text-gray-600">
          {{ isLogin ? '还没有账户？' : '已有账户？' }}
        </text>
        <wd-button type="text" class="text-lg text-green-600 font-medium" @click="toggleMode">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </wd-button>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 可根据 uno.css/tailwind 适配样式 */
</style>

<route lang="json5">
{
  style: {
    navigationBarTitleText: '登录/注册',
  },
}
</route>
