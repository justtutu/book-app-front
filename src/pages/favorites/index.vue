<route lang="json5">
{
  style: {
    navigationBarTitleText: '我的收藏',
  },
}
</route>

<script setup lang="ts">
import useRequest from '@/hooks/useRequest'
import { httpGet } from '@/utils/http'

// 请求收藏列表
const { loading, error, data, run } = useRequest<{ msg: string, data: any[] }>(
  () => httpGet('/books/favorites'),
  { immediate: true },
)
console.log('data', data)

// 跳转到图书详情
function goBookDetail(book: any) {
  uni.navigateTo({ url: `/pages/book-detail/index?id=${book.id}` })
}
</script>

<template>
  <view class="flex-1 bg-gray-50 pb-20">
    <view v-if="loading" class="flex flex-1 items-center justify-center">
      <wd-loading :size="32" />
    </view>
    <view v-else-if="error" class="flex flex-1 items-center justify-center">
      <view class="text-center text-red-400">
        加载失败，请重试
      </view>
    </view>
    <view v-else-if="!data || data.data.length === 0" class="flex flex-1 items-center justify-center">
      <view class="text-center">
        <view class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-200">
          <view class="i-carbon-star h-8 w-8 text-yellow-400" />
        </view>
        <view class="mt-4 rounded-xl bg-green-500 px-6 py-2 text-white">
          暂无收藏，快去添加喜欢的图书吧！
        </view>
      </view>
    </view>
    <view v-else class="px-4 pt-4 space-y-4">
      <view
        v-for="book in data.data"
        :key="book.id"
        class="flex items-center rounded-2xl bg-white p-4 shadow-sm space-x-4"
        style="cursor:pointer;"
        @click="goBookDetail(book)"
      >
        <view class="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <image :src="book.coverUrl" :alt="book.title" class="h-full w-full object-cover" />
        </view>
        <view class="min-w-0 flex-1">
          <view class="line-clamp-2 mb-1 text-gray-900 font-medium leading-tight">
            {{ book.title }}
          </view>
          <view class="mb-2 text-sm text-gray-600">
            {{ book.author }}
          </view>
          <view class="flex items-center text-sm">
            <view class="i-carbon-star mr-1 h-4 w-4 text-yellow-400" />
            <text class="mr-3 text-gray-600">
              {{ book.rating }}
            </text>
            <text class="text-gray-500">
              已借 {{ book.borrowCount }} 次
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
/* 可根据 uno.css/tailwind 适配样式 */
</style>
