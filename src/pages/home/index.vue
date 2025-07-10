<script setup lang="ts">
import { computed, ref } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { http } from '@/utils/http'

const appStore = useAppStore()
const selectedCategory = ref('all')

// 统一请求首页数据
const { loading: homeLoading, error: homeError, data: homeData, run: fetchHomeData } = useRequest<any>(
  () => http.get<any>('/books/home'),
  { immediate: true },
)

// 适配变量
const hotBooksList = computed(() => homeData.value?.hotBooks || [])
const recentBooks = computed(() => homeData.value?.latestBooks || [])
const booksCount = computed(() => homeData.value?.booksCount || 0)
const categoriesCount = computed(() => homeData.value?.categoriesCount || 0)

const books = computed(() => appStore.state.books)
const categories = computed(() => appStore.state.categories)
const user = computed(() => appStore.state.user)
console.log('books', books)

const filteredBooks = computed(() => {
  if (selectedCategory.value === 'all')
    return books.value
  return books.value.filter(book => book.categoryId === selectedCategory.value)
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
function goSearch() {
  uni.switchTab({ url: '/pages/search/index' })
}
function goBookDetail(book: any) {
  uni.navigateTo({ url: `/pages/book-detail/index?id=${book.id}` })
}
function setSelectedCategory(id: string) {
  selectedCategory.value = id
}
function goToLogin() {
  uni.navigateTo({ url: '/pages/auth/index' })
}
function goToProfile() {
  uni.switchTab({ url: '/pages/profile/index' })
}
</script>

<template>
  <view class="flex-1 bg-gray-50 pb-20">
    <!-- User Welcome -->
    <view v-if="user" class="border-b border-gray-100 bg-white px-4 py-3">
      <view class="flex items-center justify-between">
        <view class="flex items-center space-x-3">
          <view class="h-10 w-10 flex items-center justify-center rounded-full bg-green-100">
            <view class="i-carbon-user h-5 w-5 text-green-600" />
          </view>
          <view>
            <text class="block text-gray-900 font-medium">
              欢迎回来，{{ user.username }}
            </text>
            <text class="block text-sm text-gray-500">
              {{ user.role === 'admin' ? '管理员' : '普通用户' }}
            </text>
          </view>
        </view>
        <button class="text-sm text-green-600" @click="goToProfile">
          <view class="i-carbon-chevron-right h-4 w-4" />
        </button>
      </view>
    </view>

    <!-- Login Prompt -->
    <view v-else class="bg-green-gradient-r px-4 py-3">
      <view class="flex items-center justify-between">
        <view class="flex items-center space-x-3">
          <view class="h-10 w-10 flex items-center justify-center rounded-full bg-white bg-opacity-20">
            <view class="i-carbon-user h-5 w-5 text-white" />
          </view>
          <view>
            <text class="block text-white font-medium">
              欢迎使用图书管理系统
            </text>
            <text class="block text-sm text-green-100">
              登录后享受更多功能
            </text>
          </view>
        </view>
        <button class="rounded-lg bg-white px-4 py-2 text-sm text-green-600 font-medium" @click="goToLogin">
          立即登录
        </button>
      </view>
    </view>

    <!-- Search Bar -->
    <view class="bg-white px-4 py-4">
      <view
        class="w-full flex items-center rounded-2xl bg-gray-50 px-4 py-3 text-gray-500"
        style="cursor:pointer;"
        @tap="goSearch"
      >
        <view class="i-carbon-search mr-3 h-5 w-5" />
        <text>搜索图书、作者或ISBN</text>
      </view>
    </view>

    <!-- Hero Banner -->
    <view class="px-4 py-4">
      <view
        class="bg-green-gradient-br rounded-3xl px-6 py-8 text-white shadow-lg"
      >
        <view class="mb-2 block text-2xl font-bold">
          探索知识的海洋
        </view>
        <view class="mb-6 block text-green-100 opacity-90">
          发现你的下一本好书
        </view>
        <view class="flex space-x-6">
          <view class="flex items-center">
            <view class="mr-3 h-10 w-10 flex items-center justify-center rounded-2xl bg-white bg-opacity-20">
              <view class="text-lg font-bold">
                {{ booksCount }}
              </view>
            </view>
            <text class="text-green-100">
              本图书
            </text>
          </view>
          <view class="flex items-center">
            <view class="mr-3 h-10 w-10 flex items-center justify-center rounded-2xl bg-white bg-opacity-20">
              <view class="text-lg font-bold">
                {{ categoriesCount }}
              </view>
            </view>
            <text class="text-green-100">
              个分类
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- Hot Books -->
    <view class="mb-6 px-4">
      <view class="mb-4 flex items-center justify-between">
        <view class="flex items-center">
          <view class="mr-3 h-8 w-8 flex items-center justify-center rounded-xl bg-red-100">
            <view class="i-carbon-trending h-5 w-5 text-red-500" />
          </view>
          <view class="text-lg text-gray-900 font-semibold">
            热门图书
          </view>
        </view>
        <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
      </view>
      <scroll-view scroll-x :enable-flex="true" class="min-h70 flex pb-2 space-x-4">
        <view
          v-for="book in hotBooksList"
          :key="book.id"
          class="mr-3 w-32 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md"
          @tap="goBookDetail(book)"
        >
          <view class="aspect-[3/4] bg-gray-100">
            <image :src="book.coverUrl" :alt="book.title" class="h-full w-full object-cover" />
          </view>
          <view class="p-3">
            <view class="line-clamp-2 mb-2 text-sm text-gray-900 font-medium leading-tight">
              {{ book.title }}
            </view>
            <view class="mb-2 truncate text-xs text-gray-600">
              {{ book.author }}
            </view>
            <view class="flex items-center justify-between text-xs">
              <view class="flex items-center">
                <view class="i-carbon-star mr-1 h-3 w-3 text-yellow-400" />
                <text class="text-gray-600">
                  {{ book.rating }}
                </text>
              </view>
              <text :class="getBorrowStatusColor(book.availableStock, book.totalStock)">
                可借{{ book.availableStock }}
              </text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Recent Books -->
    <view class="mb-6 px-4">
      <view class="mb-4 flex items-center justify-between">
        <view class="flex items-center">
          <view class="mr-3 h-8 w-8 flex items-center justify-center rounded-xl bg-blue-100">
            <view class="i-carbon-timer h-5 w-5 text-blue-500" />
          </view>
          <view class="text-lg text-gray-900 font-semibold">
            最新上架
          </view>
        </view>
        <view class="i-carbon-chevron-right h-5 w-5 text-gray-400" />
      </view>
      <view class="space-y-3">
        <view
          v-for="book in recentBooks"
          :key="book.id"
          class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
          @tap="goBookDetail(book)"
        >
          <view class="flex space-x-4">
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
              <view class="flex items-center justify-between">
                <view class="flex items-center text-sm">
                  <view class="i-carbon-star mr-1 h-4 w-4 text-yellow-400" />
                  <text class="mr-3 text-gray-600">
                    {{ book.rating }}
                  </text>
                  <text class="text-gray-500">
                    已借 {{ book.borrowCount }} 次
                  </text>
                </view>
                <text class="rounded-lg px-2 py-1 text-sm font-medium" :class="[book.availableStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                  {{ getBorrowStatusText(book.availableStock) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- Categories -->
    <view class="mb-6 px-4">
      <view class="mb-4 flex items-center justify-between">
        <view class="flex items-center">
          <view class="mr-3 h-8 w-8 flex items-center justify-center rounded-xl bg-purple-100">
            <view class="i-carbon-filter h-5 w-5 text-purple-500" />
          </view>
          <view class="text-lg text-gray-900 font-semibold">
            分类浏览
          </view>
        </view>
      </view>
      <scroll-view scroll-x :enable-flex="true" class="mb-4 flex pb-2 space-x-3">
        <view
          class="mr-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all" :class="[selectedCategory === 'all' ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm']"
          @tap="setSelectedCategory('all')"
        >
          全部
        </view>
        <view
          v-for="category in categories"
          :key="category.id"
          class="mr-2 whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-medium transition-all" :class="[selectedCategory === category.id ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm']"
          @tap="setSelectedCategory(category.id)"
        >
          {{ category.name }}
        </view>
      </scroll-view>
      <view class="grid grid-cols-1 gap-3">
        <view
          v-for="book in filteredBooks.slice(0, 4)"
          :key="book.id"
          class="cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
          @tap="goBookDetail(book)"
        >
          <view class="flex space-x-4">
            <view class="h-20 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <image :src="book.coverUrl" :alt="book.title" class="h-full w-full object-cover" />
            </view>
            <view class="min-w-0 flex-1">
              <view class="line-clamp-2 mb-1 text-gray-900 font-medium leading-tight">
                {{ book.title }}
              </view>
              <view class="mb-2 text-sm text-gray-600">
                {{ book.author }} • {{ book.publisher }}
              </view>
              <view class="flex items-center justify-between">
                <view class="flex items-center text-sm">
                  <view class="i-carbon-star mr-1 h-4 w-4 text-yellow-400" />
                  <text class="mr-3 text-gray-600">
                    {{ book.rating }}
                  </text>
                  <text class="text-gray-500">
                    ￥{{ book.price }}
                  </text>
                </view>
                <text class="rounded-lg px-2 py-1 text-sm font-medium" :class="[book.availableStock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                  {{ getBorrowStatusText(book.availableStock) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped>
</style>

<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '首页',
  },
}
</route>
