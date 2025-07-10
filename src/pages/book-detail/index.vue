<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { httpGet, httpPost } from '@/utils/http'

const props = defineProps<{ id: string }>()
const bookId = props.id

const appStore = useAppStore()
const user = computed(() => appStore.state.user)
const categories = computed(() => appStore.state.categories)

const book = ref<any>(null)
const categoryName = computed(() => {
  if (!book.value)
    return '未分类'
  const cat = categories.value.find(c => c.id === book.value.categoryId)
  return cat ? cat.name : '未分类'
})

const borrowing = ref(false)
const borrowed = ref(false)
const isFavorite = ref(false)

const { loading: detailLoading, error: detailError, data: detailData, run: fetchBookDetail } = useRequest<any>(
  () => httpGet(`/books/${bookId}`),
  { immediate: false },
)

onMounted(async () => {
  if (bookId) {
    try {
      await fetchBookDetail()
      if (detailData.value) {
        book.value = detailData.value
        // 初始化收藏状态
        if ('isFavorite' in detailData.value) {
          isFavorite.value = !!detailData.value.isFavorite
        }
        else {
          isFavorite.value = false
        }
        // 检查用户是否已借阅此书
        if (user.value) {
          const userBorrows = appStore.state.borrowRecords.filter(
            record => record.userId === user.value.id
              && record.bookId === bookId
              && record.status === 'borrowed',
          )
          borrowed.value = userBorrows.length > 0
        }
      }
      else {
        uni.showToast({ title: '图书不存在', icon: 'none' })
        setTimeout(() => uni.navigateBack(), 1500)
      }
    }
    catch (e) {
      uni.showToast({ title: '加载失败', icon: 'none' })
      setTimeout(() => uni.navigateBack(), 1500)
    }
  }
  else {
    uni.showToast({ title: '参数错误', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1500)
  }
})

function getBorrowStatusColor(availableStock: number, totalStock: number) {
  const ratio = availableStock / totalStock
  if (ratio === 0)
    return 'text-red-500'
  if (ratio < 0.3)
    return 'text-orange-500'
  return 'text-green-500'
}
function getBorrowStatusText(availableStock: number) {
  return availableStock > 0 ? `可借${availableStock}本` : '暂无库存'
}

function onBack() {
  uni.navigateBack()
}
async function toggleLike() {
  if (!user.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  if (!book.value) {
    uni.showToast({ title: '图书信息错误', icon: 'none' })
    return
  }
  try {
    if (!isFavorite.value) {
      // 调用收藏接口
      const res = await httpPost('/books/favorite', { bookId: book.value.id })
      if (res && res.success) {
        isFavorite.value = true
        uni.showToast({ title: '已添加到收藏', icon: 'none' })
      }
      else {
        uni.showToast({ title: res?.msg || '收藏失败', icon: 'none' })
      }
    }
    else {
      // 调用取消收藏接口
      const res = await httpPost('/books/unfavorite', { bookId: book.value.id })
      if (res && res.success) {
        isFavorite.value = false
        uni.showToast({ title: '已取消收藏', icon: 'none' })
      }
      else {
        uni.showToast({ title: res?.msg || '取消收藏失败', icon: 'none' })
      }
    }
  }
  catch (e) {
    uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' })
  }
}

async function handleBorrow() {
  if (!user.value) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  if (!book.value) {
    uni.showToast({ title: '图书信息错误', icon: 'none' })
    return
  }

  borrowing.value = true
  try {
    const res = await httpPost('/books/borrow', {
      userId: user.value.id,
      bookId: book.value.id,
    })
    if (res && res.success) {
      borrowed.value = true
      book.value.availableStock -= 1
      book.value.borrowCount += 1
      uni.showToast({ title: '借阅成功！', icon: 'success' })
    }
    else {
      uni.showToast({ title: res?.msg || '借阅失败，图书可能已无库存', icon: 'none' })
    }
  }
  catch (e) {
    uni.showToast({ title: '借阅失败，请稍后重试', icon: 'none' })
  }
  finally {
    borrowing.value = false
  }
}
</script>

<template>
  <view class="flex-1 bg-gray-50">
    <!-- Header -->

    <scroll-view scroll-y class="flex-1 overflow-y-auto pb-24">
      <!-- Book Cover and Basic Info -->
      <view class="bg-white p-6">
        <view class="flex space-x-6">
          <view class="h-40 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 shadow-lg">
            <image :src="book?.coverUrl" :alt="book?.title" class="h-full w-full object-cover" />
          </view>
          <view class="min-w-0 flex-1">
            <text class="line-clamp-3 mb-3 block text-2xl text-gray-900 font-bold leading-tight">
              {{ book?.title }}
            </text>
            <text class="mb-3 block text-lg text-gray-700">
              {{ book?.author }}
            </text>
            <view class="mb-3 flex items-center">
              <view class="i-carbon-star mr-1 h-5 w-5 text-yellow-400" />
              <text class="text-gray-900 font-semibold">
                {{ book?.rating }}
              </text>
              <text class="ml-1 text-gray-600">
                评分
              </text>
            </view>
            <view class="mb-3 flex items-center">
              <view class="i-carbon-book mr-1 h-5 w-5 text-blue-500" />
              <text class="text-gray-700">
                {{ book?.borrowCount }} 次借阅
              </text>
            </view>
            <view class="inline-flex items-center rounded-2xl px-3 py-1 text-sm font-medium" :class="[book?.availableStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
              <view class="i-carbon-timer mr-1 h-4 w-4" />
              {{ getBorrowStatusText(book?.availableStock || 0) }}
            </view>
          </view>
        </view>
        <view class="flex items-center justify-center border-b border-gray-100 bg-white px-4 py-3">
          <view class="flex space-x-2">
            <button class="p-2" @click="toggleLike">
              <view :class="isFavorite ? 'i-carbon-favorite-filled text-red-500' : 'i-carbon-favorite-filled text-gray-600'" />
            </button>
            <button class="p-2">
              <view class="i-carbon-share text-gray-600" />
            </button>
          </view>
        </view>
      </view>

      <!-- Book Details -->
      <view class="mt-2 bg-white p-6">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          图书信息
        </text>
        <view class="space-y-4">
          <view class="flex items-start space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <view class="i-carbon-hash h-4 w-4 text-gray-500" />
            </view>
            <view class="flex-1">
              <text class="mb-1 block text-sm text-gray-600">
                ISBN
              </text>
              <text class="block text-gray-900 font-medium">
                {{ book?.isbn }}
              </text>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <view class="i-carbon-building h-4 w-4 text-gray-500" />
            </view>
            <view class="flex-1">
              <text class="mb-1 block text-sm text-gray-600">
                出版社
              </text>
              <text class="block text-gray-900 font-medium">
                {{ book?.publisher }}
              </text>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <view class="i-carbon-calendar h-4 w-4 text-gray-500" />
            </view>
            <view class="flex-1">
              <text class="mb-1 block text-sm text-gray-600">
                出版日期
              </text>
              <text class="block text-gray-900 font-medium">
                {{ book?.publishDate }}
              </text>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <view class="i-carbon-book h-4 w-4 text-gray-500" />
            </view>
            <view class="flex-1">
              <text class="mb-1 block text-sm text-gray-600">
                分类
              </text>
              <text class="block text-gray-900 font-medium">
                {{ categoryName }}
              </text>
            </view>
          </view>
          <view class="flex items-start space-x-3">
            <view class="h-8 w-8 flex flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <view class="i-carbon-currency-dollar h-4 w-4 text-gray-500" />
            </view>
            <view class="flex-1">
              <text class="mb-1 block text-sm text-gray-600">
                价格
              </text>
              <text class="block text-gray-900 font-medium">
                ￥{{ book?.price }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- Description -->
      <view class="mt-2 bg-white p-6">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          内容简介
        </text>
        <text class="block text-gray-700 leading-relaxed">
          {{ book?.description }}
        </text>
      </view>

      <!-- Stock Information -->
      <view class="mt-2 bg-white p-6">
        <text class="mb-4 block text-lg text-gray-900 font-semibold">
          库存信息
        </text>
        <view class="rounded-2xl bg-gray-50 p-4">
          <view class="grid grid-cols-3 gap-4 text-center">
            <view>
              <text class="mb-1 block text-2xl text-gray-900 font-bold">
                {{ book?.totalStock }}
              </text>
              <text class="block text-sm text-gray-600">
                总库存
              </text>
            </view>
            <view>
              <text class="mb-1 block text-2xl font-bold" :class="[getBorrowStatusColor(book?.availableStock || 0, book?.totalStock || 1)]">
                {{ book?.availableStock }}
              </text>
              <text class="block text-sm text-gray-600">
                可借数量
              </text>
            </view>
            <view>
              <text class="mb-1 block text-2xl text-gray-900 font-bold">
                {{ (book?.totalStock || 0) - (book?.availableStock || 0) }}
              </text>
              <text class="block text-sm text-gray-600">
                已借出
              </text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- Action Button -->
    <view class="safe-area-pb fixed bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-4">
      <button
        class="bg-green-gradient-br w-full rounded-2xl px-6 py-4 text-lg text-white font-semibold shadow-lg transition-all"
        :disabled="borrowing || borrowed || (book?.availableStock || 0) <= 0 || !user"
        @click="handleBorrow"
      >
        <template v-if="!user">
          请先登录
        </template>
        <template v-else-if="borrowed">
          已借阅
        </template>
        <template v-else-if="borrowing">
          借阅中...
        </template>
        <template v-else-if="(book?.availableStock || 0) <= 0">
          暂无库存
        </template>
        <template v-else>
          立即借阅
        </template>
      </button>
    </view>
  </view>
</template>

<style scoped>
/* 可根据 uno.css/tailwind 适配样式 */
</style>

<route lang="json5">
{
  style: {
    navigationBarTitleText: '图书详情',
  },
}
</route>
