<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const user = computed(() => appStore.state.user)
const borrowRecords = computed(() => appStore.state.borrowRecords)

const currentBorrows = computed(() => {
  if (!user.value)
    return 0
  return borrowRecords.value.filter(
    record => record.userId === user.value.id && record.status === 'borrowed',
  ).length
})
const totalBorrows = computed(() => {
  if (!user.value)
    return 0
  return borrowRecords.value.filter(
    record => record.userId === user.value.id,
  ).length
})

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        appStore.logout()
      }
    },
  })
}
function goToBorrowRecords() {
  uni.switchTab({ url: '/pages/borrow/index' })
}
function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/index' })
}
function goToAdmin() {
  uni.navigateTo({ url: '/pages/admin/index' })
}
function goToFavorites() {
  uni.navigateTo({ url: '/pages/favorites/index' })
}
function goToSettings() {
  uni.switchTab({ url: '/pages/settings/index' })
}
function goToFeedback() {
  uni.navigateTo({ url: '/pages/feedback/index' })
}
function goToEditProfile() {
  uni.navigateTo({ url: '/pages/profile/edit' })
}
</script>

<template>
  <view class="min-h-screen flex flex-col items-center bg-gray-100 pt-12">
    <view v-if="!user" class="w-11/12">
      <view class="flex flex-col items-center rounded-xl bg-white p-8 shadow-lg">
        <view class="i-carbon-user mb-4 text-7xl text-gray-400" />
        <wd-button type="success" @tap="goToLogin">
          请先登录
        </wd-button>
        <text class="text-sm text-gray-400">
          登录后可查看和管理个人信息
        </text>
      </view>
    </view>
    <view v-else>
      <!-- User Info Header -->
      <view class="bg-green-gradient-br px-6 py-8 text-white">
        <view class="mb-6 flex items-center space-x-4">
          <view class="h-16 w-16 flex items-center justify-center rounded-2xl bg-white bg-opacity-20">
            <view class="i-carbon-user h-8 w-8" />
          </view>
          <view class="flex-1">
            <text class="mb-1 block text-xl font-semibold">
              {{ user.username }}
            </text>
            <text class="block text-green-100 opacity-90">
              {{ user.phone }}
            </text>
          </view>
        </view>
        <view class="flex items-center justify-between">
          <view class="flex items-center">
            <view class="mr-2 h-8 w-8 flex items-center justify-center rounded-xl bg-white bg-opacity-20">
              <view class="i-carbon-gift h-4 w-4" />
            </view>
            <text class="text-green-100">
              {{ user.points }} 积分
            </text>
          </view>
          <view class="flex items-center">
            <view class="i-carbon-award mr-2 h-4 w-4" />
            <text class="text-green-100">
              {{ user.role === 'admin' ? '管理员' : '普通用户' }}
            </text>
          </view>
        </view>
      </view>
      <!-- Stats Cards -->
      <view class="px-4 py-6">
        <view class="grid grid-cols-2 mb-6 gap-4">
          <view class="rounded-2xl bg-white p-4 shadow-sm">
            <view class="flex items-center justify-between">
              <view>
                <text class="mb-1 block text-sm text-gray-600">
                  当前借阅
                </text>
                <text class="block text-2xl text-blue-600 font-bold">
                  {{ currentBorrows }}
                </text>
                <text class="block text-xs text-gray-500">
                  本图书
                </text>
              </view>
              <view class="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-100">
                <view class="i-carbon-book h-6 w-6 text-blue-600" />
              </view>
            </view>
          </view>
          <view class="rounded-2xl bg-white p-4 shadow-sm">
            <view class="flex items-center justify-between">
              <view>
                <text class="mb-1 block text-sm text-gray-600">
                  历史借阅
                </text>
                <text class="block text-2xl text-green-600 font-bold">
                  {{ totalBorrows }}
                </text>
                <text class="block text-xs text-gray-500">
                  本图书
                </text>
              </view>
              <view class="h-12 w-12 flex items-center justify-center rounded-2xl bg-green-100">
                <view class="i-carbon-timer h-6 w-6 text-green-600" />
              </view>
            </view>
          </view>
        </view>
        <!-- Menu Items -->
        <view class="space-y-3">
          <view class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button class="w-full flex items-center justify-between px-6 py-4" @click="goToBorrowRecords">
              <view class="flex items-center space-x-4">
                <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-blue-100">
                  <view class="i-carbon-book h-5 w-5 text-blue-600" />
                </view>
                <view class="text-left">
                  <text class="block text-gray-900 font-medium">
                    借阅记录
                  </text>
                  <text class="block text-sm text-gray-600">
                    查看借阅历史和当前状态
                  </text>
                </view>
              </view>
              <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
            </button>
          </view>

          <!-- 管理员入口 -->
          <view v-if="user.role === 'admin'" class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button class="w-full flex items-center justify-between px-6 py-4" @click="goToAdmin">
              <view class="flex items-center space-x-4">
                <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-100">
                  <view class="i-carbon-settings h-5 w-5 text-red-600" />
                </view>
                <view class="text-left">
                  <text class="block text-gray-900 font-medium">
                    管理后台
                  </text>
                  <text class="block text-sm text-gray-600">
                    图书和用户管理
                  </text>
                </view>
              </view>
              <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
            </button>
          </view>

          <view class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button class="w-full flex items-center justify-between px-6 py-4" @click="goToFavorites">
              <view class="flex items-center space-x-4">
                <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-yellow-100">
                  <view class="i-carbon-star h-5 w-5 text-yellow-600" />
                </view>
                <view class="text-left">
                  <text class="block text-gray-900 font-medium">
                    我的收藏
                  </text>
                  <text class="block text-sm text-gray-600">
                    管理收藏的图书
                  </text>
                </view>
              </view>
              <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
            </button>
          </view>
          <view class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button class="w-full flex items-center justify-between px-6 py-4" @click="goToFeedback">
              <view class="flex items-center space-x-4">
                <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-purple-100">
                  <view class="i-carbon-chat h-5 w-5 text-purple-600" />
                </view>
                <view class="text-left">
                  <text class="block text-gray-900 font-medium">
                    意见反馈
                  </text>
                  <text class="block text-sm text-gray-600">
                    提出建议和问题反馈
                  </text>
                </view>
              </view>
              <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
            </button>
          </view>
          <view class="overflow-hidden rounded-2xl bg-white shadow-sm">
            <button class="w-full flex items-center justify-between px-6 py-4" @click="goToEditProfile">
              <view class="flex items-center space-x-4">
                <view class="h-10 w-10 flex items-center justify-center rounded-2xl bg-green-100">
                  <view class="i-carbon-user-edit h-5 w-5 text-green-600" />
                </view>
                <view class="text-left">
                  <text class="block text-gray-900 font-medium">
                    编辑个人信息
                  </text>
                  <text class="block text-sm text-gray-600">
                    修改头像、昵称、联系方式
                  </text>
                </view>
              </view>
              <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
            </button>
          </view>
        </view>
        <!-- Logout Button -->
        <view class="mt-6">
          <button class="w-full flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-red-600 shadow-sm" @click="handleLogout">
            <view class="i-carbon-logout mr-2 h-5 w-5" />
            <text class="font-medium">
              退出登录
            </text>
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 可根据 uno.css/tailwind 适配样式 */
</style>

<route lang="json5">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '个人中心',
  },
}
</route>
