<script setup lang="ts">
import { computed } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { getPageMarginTop } from '@/utils'
import { httpPost } from '@/utils/http'

const appStore = useAppStore()

// 管理后台数据请求
const { loading: overviewLoading, error: overviewError, data: overviewData, run: fetchOverview } = useRequest<any>(
  () => httpPost('/books/admin/overview'),
  { immediate: true },
)

// 统计数据
const stats = computed(() => overviewData.value?.stats || {
  totalBooks: 0,
  availableBooks: 0,
  borrowedBooks: 0,
  todayBorrows: 0,
})
// 最近借阅
const recentBorrows = computed(() => overviewData.value?.recentBorrows || [])
// 热门图书
const hotBooks = computed(() => overviewData.value?.hotBooks || [])

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function onAddBook() {
  uni.navigateTo({ url: '/pages-sub/page-admin/book-manage' })
}
function onManageBooks() {
  uni.showToast({ title: '图书管理功能开发中', icon: 'none' })
}
function onManageBorrows() {
  uni.navigateTo({ url: '/pages/borrow/index' })
}
function onManageUsers() {
  uni.showToast({ title: '用户管理功能开发中', icon: 'none' })
}
function onStatistics() {
  uni.navigateTo({ url: '/pages-sub/page-admin/statistics' })
}
function toAddBook() {
}
</script>

<template>
  <view :style="{ marginTop: getPageMarginTop() }" class="flex-1 bg-gray-50 pb-20">
    <!-- Header -->
    <view class="bg-white px-4 py-6 shadow-sm">
      <view class="flex items-center justify-between">
        <view>
          <text class="block text-2xl text-gray-900 font-bold">
            管理后台
          </text>
          <text class="block text-gray-600">
            图书管理系统数据概览
          </text>
        </view>
        <button class="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white space-x-2" @click="onAddBook">
          <view class="i-carbon-add h-5 w-5" />
          <text>
            添加图书
          </text>
        </button>
      </view>
    </view>
    <view class="p-4">
      <!-- Stats Grid -->
      <view class="grid grid-cols-2 mb-6 gap-4 lg:grid-cols-4">
        <view class="rounded-lg bg-white p-4 shadow-sm">
          <view class="flex items-center justify-between">
            <view>
              <text class="block text-sm text-gray-600">
                图书总数
              </text>
              <text class="block text-2xl text-blue-600 font-bold">
                {{ stats.totalBooks }}
              </text>
            </view>
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <view class="i-carbon-book h-6 w-6 text-blue-600" />
            </view>
          </view>
        </view>
        <view class="rounded-lg bg-white p-4 shadow-sm">
          <view class="flex items-center justify-between">
            <view>
              <text class="block text-sm text-gray-600">
                可借图书
              </text>
              <text class="block text-2xl text-green-600 font-bold">
                {{ stats.availableBooks }}
              </text>
            </view>
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
              <view class="i-carbon-book h-6 w-6 text-green-600" />
            </view>
          </view>
        </view>
        <view class="rounded-lg bg-white p-4 shadow-sm">
          <view class="flex items-center justify-between">
            <view>
              <text class="block text-sm text-gray-600">
                借出图书
              </text>
              <text class="block text-2xl text-orange-600 font-bold">
                {{ stats.borrowedBooks }}
              </text>
            </view>
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-orange-100">
              <view class="i-carbon-timer h-6 w-6 text-orange-600" />
            </view>
          </view>
        </view>
        <view class="rounded-lg bg-white p-4 shadow-sm">
          <view class="flex items-center justify-between">
            <view>
              <text class="block text-sm text-gray-600">
                今日借阅
              </text>
              <text class="block text-2xl text-purple-600 font-bold">
                {{ stats.todayBorrows }}
              </text>
            </view>
            <view class="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100">
              <view class="i-carbon-calendar h-6 w-6 text-purple-600" />
            </view>
          </view>
        </view>
      </view>
      <!-- Quick Actions -->
      <view class="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          快速操作
        </text>
        <view class="grid grid-cols-2 gap-4">
          <button class="flex items-center justify-center border border-gray-200 rounded-lg p-4" @click="onManageBooks">
            <view class="i-carbon-book mr-3 h-6 w-6 text-blue-600" />
            <view class="text-left">
              <text class="block text-gray-900 font-medium">
                图书管理
              </text>
              <text class="block text-sm text-gray-600">
                管理图书信息
              </text>
            </view>
          </button>
          <button class="flex items-center justify-center border border-gray-200 rounded-lg p-4" @click="onManageBorrows">
            <view class="i-carbon-user-multiple mr-3 h-6 w-6 text-green-600" />
            <view class="text-left">
              <text class="block text-gray-900 font-medium">
                借阅管理
              </text>
              <text class="block text-sm text-gray-600">
                管理借阅记录
              </text>
            </view>
          </button>
          <button class="flex items-center justify-center border border-gray-200 rounded-lg p-4" @click="onManageUsers">
            <view class="i-carbon-user mr-3 h-6 w-6 text-purple-600" />
            <view class="text-left">
              <text class="block text-gray-900 font-medium">
                用户管理
              </text>
              <text class="block text-sm text-gray-600">
                管理用户账户
              </text>
            </view>
          </button>
          <button class="flex items-center justify-center border border-gray-200 rounded-lg p-4" @click="onStatistics">
            <view class="i-carbon-chart-line mr-3 h-6 w-6 text-orange-600" />
            <view class="text-left">
              <text class="block text-gray-900 font-medium">
                统计分析
              </text>
              <text class="block text-sm text-gray-600">
                数据统计报告
              </text>
            </view>
          </button>
        </view>
      </view>
      <!-- Recent Borrows -->
      <view class="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          最近借阅
        </text>
        <view class="space-y-3">
          <view v-for="record in recentBorrows" :key="record.id" class="flex items-center rounded-lg bg-gray-50 p-3 space-x-3">
            <view class="h-16 w-12 flex-shrink-0 rounded bg-gray-200">
              <image :src="record.coverUrl" :alt="record.bookName" class="h-full w-full rounded object-cover" />
            </view>
            <view class="min-w-0 flex-1">
              <text class="block truncate text-gray-900 font-medium">
                {{ record.bookName }}
              </text>
              <text class="block text-sm text-gray-600">
                {{ record.author }}
              </text>
              <text class="block text-xs text-gray-500">
                {{ formatDate(record.borrowTime) }}
              </text>
            </view>
            <text :class="record.status === 'borrowed' ? 'text-orange-600' : 'text-green-600'" class="text-sm font-medium">
              {{ record.status === 'borrowed' ? '借阅中' : '已归还' }}
            </text>
          </view>
        </view>
      </view>
      <!-- Hot Books -->
      <view class="rounded-lg bg-white p-4 shadow-sm">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          热门图书
        </text>
        <view class="space-y-3">
          <view v-for="(book, index) in hotBooks" :key="book.id" class="flex items-center rounded-lg bg-gray-50 p-3 space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <text class="text-sm text-blue-600 font-semibold">
                {{ index + 1 }}
              </text>
            </view>
            <view class="h-16 w-12 flex-shrink-0 rounded bg-gray-200">
              <image :src="book.coverUrl" :alt="book.title" class="h-full w-full rounded object-cover" />
            </view>
            <view class="min-w-0 flex-1">
              <text class="block truncate text-gray-900 font-medium">
                {{ book.title }}
              </text>
              <text class="block text-sm text-gray-600">
                {{ book.author }}
              </text>
            </view>
            <view class="text-right">
              <text class="block text-sm text-blue-600 font-medium">
                {{ book.borrowCount }}
              </text>
              <text class="block text-xs text-gray-500">
                借阅次数
              </text>
            </view>
          </view>
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
  style: {
    navigationBarTitleText: '后台管理',
  },
}
</route>
