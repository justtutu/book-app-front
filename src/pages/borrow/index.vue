<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { http, httpPost } from '@/utils/http'

const appStore = useAppStore()
const user = computed(() => appStore.state.user)
const books = computed(() => appStore.state.books)
const borrowRecords = computed(() => appStore.state.borrowRecords)

const activeTab = ref<'current' | 'history'>('current')
const processing = ref<string | null>(null)

const userBorrowRecords = computed(() => {
  if (!user.value)
    return []
  return borrowRecords.value.filter(record => record.userId === user.value.id)
})
const currentBorrows = ref<any[]>([])
const borrowHistory = ref<any[]>([])

const { loading: borrowLoading, error: borrowError, data: borrowData, run: fetchBorrowRecords } = useRequest<any>(
  () => http.get('/books/borrow/records'),
  { immediate: true },
)
watchEffect(() => {
  if (borrowData.value) {
    currentBorrows.value = borrowData.value.current || []
    borrowHistory.value = borrowData.value.history || []
  }
})

function setActiveTab(tab: 'current' | 'history') {
  activeTab.value = tab
}
function getBook(bookId: string) {
  return (
    currentBorrows.value.find(b => b.bookId === bookId)
    || borrowHistory.value.find(b => b.bookId === bookId)
    || books.value.find(book => book.id === bookId)
  )
}
function formatDate(dateString: string) {
  if (!dateString)
    return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}
function getDaysRemaining(dueDate: string) {
  if (!dueDate)
    return 0
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}
function getStatusColor(record: any) {
  if (record.status === 'returned')
    return 'text-green-600'
  const daysRemaining = getDaysRemaining(record.dueDate)
  if (daysRemaining < 0)
    return 'text-red-600'
  if (daysRemaining <= 3)
    return 'text-orange-600'
  return 'text-blue-600'
}
function getStatusText(record: any) {
  if (record.status === 'returned')
    return '已归还'
  const daysRemaining = getDaysRemaining(record.dueDate)
  if (daysRemaining < 0)
    return `逾期${Math.abs(daysRemaining)}天`
  if (daysRemaining === 0)
    return '今日到期'
  return `${daysRemaining}天后到期`
}
async function handleReturn(recordId: string) {
  processing.value = recordId
  try {
    const res = await httpPost('/books/return', { recordId })
    const isSuccess = (res as any).success
    const msg = (res as any).data?.msg || (res as any).msg
    if (isSuccess) {
      uni.showToast({ title: '归还成功！', icon: 'success' })
      await fetchBorrowRecords()
    }
    else {
      uni.showToast({ title: msg || '归还失败，请稍后重试', icon: 'none' })
    }
  }
  catch (e) {
    uni.showToast({ title: '归还失败，请稍后重试', icon: 'none' })
  }
  finally {
    processing.value = null
  }
}
async function handleRenew(recordId: string) {
  processing.value = recordId
  try {
    const success = await appStore.renewBook(recordId)
    if (success) {
      uni.showToast({ title: '续借成功！已延长30天', icon: 'success' })
      await fetchBorrowRecords()
    }
    else {
      uni.showToast({ title: '续借失败，请稍后重试', icon: 'none' })
    }
  }
  catch (e) {
    uni.showToast({ title: '续借失败，请稍后重试', icon: 'none' })
  }
  finally {
    processing.value = null
  }
}
function onBookClick(bookId: string) {
  uni.navigateTo({ url: `/pages/book-detail/index?id=${bookId}` })
}
</script>

<template>
  <view class="min-h-screen flex flex-col items-center bg-gray-100 pt-12">
    <view v-if="!user" class="w-11/12">
      <view class="flex flex-col items-center rounded-xl bg-white p-8 shadow-lg">
        <view class="i-carbon-book mb-4 text-7xl text-gray-400" />
        <text class="mb-1 text-lg font-bold">
          请先登录
        </text>
        <text class="text-sm text-gray-400">
          登录后查看您的借阅记录
        </text>
      </view>
    </view>
    <view v-else>
      <!-- Tab Navigation -->
      <view class="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <view class="flex">
          <button
            class="flex-1 px-4 py-4 text-center font-medium"
            :class="activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'"
            @click="() => setActiveTab('current')"
          >
            <view class="flex items-center justify-center space-x-2">
              <view class="i-carbon-book h-5 w-5" />
              <text>当前借阅 ({{ currentBorrows.length }})</text>
            </view>
          </button>
          <button
            class="flex-1 px-4 py-4 text-center font-medium"
            :class="activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-600'"
            @click="() => setActiveTab('history')"
          >
            <view class="flex items-center justify-center space-x-2">
              <view class="i-carbon-timer h-5 w-5" />
              <text>借阅历史 ({{ borrowHistory.length }})</text>
            </view>
          </button>
        </view>
      </view>
      <view class="p-4">
        <view v-if="activeTab === 'current'">
          <view v-if="currentBorrows.length === 0" class="py-12 text-center">
            <view class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
              <view class="i-carbon-book h-8 w-8 text-gray-400" />
            </view>
            <text class="mb-2 block text-lg text-gray-900 font-medium">
              暂无借阅图书
            </text>
            <text class="block text-gray-600">
              去首页找找你喜欢的图书吧
            </text>
          </view>
          <view v-else class="space-y-4">
            <view v-for="record in currentBorrows" :key="record.id" class="overflow-hidden rounded-lg bg-white shadow-sm">
              <view class="cursor-pointer p-4" @click="onBookClick(record.bookId)">
                <view class="flex space-x-4">
                  <view class="h-20 w-16 flex-shrink-0 rounded-lg bg-gray-100">
                    <image :src="getBook(record.bookId)?.coverUrl" :alt="getBook(record.bookId)?.title" class="h-full w-full rounded-lg object-cover" />
                  </view>
                  <view class="min-w-0 flex-1">
                    <text class="line-clamp-2 mb-1 block text-gray-900 font-medium">
                      {{ getBook(record.bookId)?.title }}
                    </text>
                    <text class="mb-2 block text-sm text-gray-600">
                      {{ getBook(record.bookId)?.author }}
                    </text>
                    <view class="space-y-2">
                      <view class="flex items-center text-sm">
                        <view class="i-carbon-calendar mr-2 h-4 w-4 text-gray-400" />
                        <text class="text-gray-600">
                          借阅时间：{{ formatDate(record.borrowDate) }}
                        </text>
                      </view>
                      <view class="flex items-center text-sm">
                        <view class="i-carbon-timer mr-2 h-4 w-4 text-gray-400" />
                        <text class="text-gray-600">
                          应还时间：{{ formatDate(record.dueDate) }}
                        </text>
                      </view>
                    </view>
                    <view class="mt-2 flex items-center" :class="[getStatusColor(record)]">
                      <view v-if="getDaysRemaining(record.dueDate) < 0 || (getDaysRemaining(record.dueDate) <= 3 && getDaysRemaining(record.dueDate) >= 0)" class="i-carbon-warning mr-1 h-4 w-4" />
                      <view v-else class="i-carbon-checkmark mr-1 h-4 w-4" />
                      <text class="text-sm font-medium">
                        {{ getStatusText(record) }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
              <view class="flex border-t border-gray-100 bg-gray-50 px-4 py-3 space-x-3">
                <button
                  class="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white font-medium"
                  :disabled="processing === record.id"
                  @click="handleReturn(record.id)"
                >
                  {{ processing === record.id ? '处理中...' : '归还图书' }}
                </button>
                <button
                  class="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-2"
                  :disabled="processing === record.id || getDaysRemaining(record.dueDate) < 0"
                  @click="handleRenew(record.id)"
                >
                  <view class="i-carbon-renew h-4 w-4" />
                </button>
              </view>
            </view>
          </view>
        </view>
        <view v-if="activeTab === 'history'">
          <view v-if="borrowHistory.length === 0" class="py-12 text-center">
            <view class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
              <view class="i-carbon-timer h-8 w-8 text-gray-400" />
            </view>
            <text class="mb-2 block text-lg text-gray-900 font-medium">
              暂无借阅历史
            </text>
            <text class="block text-gray-600">
              您还没有归还过任何图书
            </text>
          </view>
          <view v-else class="space-y-4">
            <view v-for="record in borrowHistory" :key="record.id" class="rounded-lg bg-white p-4 shadow-sm">
              <view class="cursor-pointer rounded-lg p-4 -m-4" @click="onBookClick(record.bookId)">
                <view class="flex space-x-4">
                  <view class="h-20 w-16 flex-shrink-0 rounded-lg bg-gray-100">
                    <image :src="getBook(record.bookId)?.coverUrl" :alt="getBook(record.bookId)?.title" class="h-full w-full rounded-lg object-cover" />
                  </view>
                  <view class="min-w-0 flex-1">
                    <text class="line-clamp-2 mb-1 block text-gray-900 font-medium">
                      {{ getBook(record.bookId)?.title }}
                    </text>
                    <text class="mb-2 block text-sm text-gray-600">
                      {{ getBook(record.bookId)?.author }}
                    </text>
                    <view class="text-sm text-gray-600 space-y-1">
                      <view class="flex items-center">
                        <view class="i-carbon-calendar mr-2 h-4 w-4" />
                        <text>借阅：{{ formatDate(record.borrowDate) }}</text>
                      </view>
                      <view class="flex items-center">
                        <view class="i-carbon-checkmark mr-2 h-4 w-4" />
                        <text>归还：{{ record.returnDate ? formatDate(record.returnDate) : '-' }}</text>
                      </view>
                    </view>
                    <view class="mt-2 flex items-center text-green-600">
                      <view class="i-carbon-checkmark mr-1 h-4 w-4" />
                      <text class="text-sm font-medium">
                        已归还
                      </text>
                    </view>
                  </view>
                </view>
              </view>
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
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '借阅',
  },
}
</route>
