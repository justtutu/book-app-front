<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { httpGet } from '@/utils/http'

const appStore = useAppStore()
const categories = computed(() => appStore.state.categories)

const searchQuery = ref('')
const showFilters = ref(false)
const selectedCategoryIdx = ref(0)
const sortByIdx = ref(0)

const categoryOptions = computed(() => ['全部分类', ...categories.value.map(c => c.name)])
const sortOptions = ['按书名排序', '按作者排序', '按出版日期排序', '按评分排序', '按借阅次数排序']

const selectedCategory = computed(() => {
  if (selectedCategoryIdx.value === 0)
    return ''
  return categories.value[selectedCategoryIdx.value - 1]?.id || ''
})
const sortBy = computed(() => {
  switch (sortByIdx.value) {
    case 0: return 'title'
    case 1: return 'author'
    case 2: return 'publishDate'
    case 3: return 'rating'
    case 4: return 'borrowCount'
    default: return 'title'
  }
})

// 分页相关
const books = ref<any[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const refreshing = ref(false)
const loading = ref(false)
const loadStatus = ref<'loading' | 'error' | 'finished'>('loading')

// useRequest 封装分页接口
const { data, run, error } = useRequest<{ data: any[], total: number }>(
  () => httpGet('/books', {
    title: searchQuery.value,
    category: selectedCategory.value,
    sortBy: sortBy.value,
    page: page.value,
    pageSize: pageSize.value,
  }),
  { immediate: false },
)

// 监听 data 变化，更新 books
watch(data, (val) => {
  if (page.value === 1) {
    books.value = val?.data || []
  }
  else {
    books.value = books.value.concat(val?.data || [])
  }
  total.value = val?.total || 0
  loadStatus.value = books.value.length >= total.value ? 'finished' : 'loading'
  refreshing.value = false
  loading.value = false
})

// 下拉刷新
function onRefresh() {
  console.log('1')
  page.value = 1
  refreshing.value = true
  loading.value = true
  run().finally(() => {
    refreshing.value = false
  })
}

// 上拉加载
function onLoadMore() {
  console.log('loadmore', loadStatus.value, loading.value, books.value.length, total.value)
  if (loadStatus.value !== 'loading' || loading.value)
    return
  page.value += 1
  loadStatus.value = 'loading'
  loading.value = true
  run()
}

// 搜索/筛选/排序变化时，重置分页并请求
watch([searchQuery, selectedCategoryIdx, sortByIdx], () => {
  page.value = 1
  loading.value = true
  run()
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

function onBookClick(book: any) {
  uni.navigateTo({ url: `/pages/book-detail/index?id=${book.id}` })
}
function toggleFilters() {
  showFilters.value = !showFilters.value
}
function clearFilters() {
  selectedCategoryIdx.value = 0
  sortByIdx.value = 0
  searchQuery.value = ''
}
function onCategoryChange(e: any) {
  selectedCategoryIdx.value = e.detail.value
}
function onSortChange(e: any) {
  sortByIdx.value = e.detail.value
}
onRefresh()
</script>

<template>
  <view class="relative h-screen flex flex-col bg-gray-50">
    <!-- Header: 固定顶部 -->
    <view class="fixed left-0 top-0 z-20 w-full bg-white shadow-sm">
      <view class="flex items-center px-4 py-3">
        <view class="mx-4 flex-1">
          <view class="relative">
            <view class="i-carbon-search absolute left-3 top-1/2 h-5 w-5 text-gray-400 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              class="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4"
              placeholder="搜索图书、作者或ISBN"
              focus
            >
          </view>
        </view>
        <button class="z-20 p-2" @click="toggleFilters">
          <view class="i-carbon-filter h-5 w-5" />
        </button>
      </view>
    </view>
    <!-- Filters: 悬浮在 header 下方 -->
    <view v-if="showFilters" class="fixed left-0 z-30 w-full border-b border-t border-gray-200 bg-gray-50 p-4" :style="{ top: '60px' }">
      <view class="space-y-4">
        <!-- Category Filter -->
        <view>
          <text class="mb-2 block text-sm text-gray-700 font-medium">
            分类
          </text>
          <picker :range="categoryOptions" :value="selectedCategoryIdx" @change="onCategoryChange">
            <view class="w-full border border-gray-300 rounded-lg p-2">
              {{ categoryOptions[selectedCategoryIdx] }}
            </view>
          </picker>
        </view>
        <!-- Sort Options -->
        <view>
          <text class="mb-2 block text-sm text-gray-700 font-medium">
            排序方式
          </text>
          <picker :range="sortOptions" :value="sortByIdx" @change="onSortChange">
            <view class="w-full border border-gray-300 rounded-lg p-2">
              {{ sortOptions[sortByIdx] }}
            </view>
          </picker>
        </view>
        <!-- Clear Filters -->
        <view class="h-10 flex items-center bg-gray-100 text-blue-600 font-medium" @click="clearFilters">
          <view class="i-carbon-close mr-1 h-4 w-4" />清除筛选
        </view>
      </view>
    </view>
    <!-- Results: scroll-view 占满剩余空间，内容区下移 -->
    <scroll-view
      :enable-flex="true"
      scroll-y
      refresher-enabled
      :refresher-triggered="refreshing"
      class="flex-1 pt-[60px]"
      :style="showFilters ? 'padding-top: 220px;' : ''"
      @refresherrefresh="onRefresh"
      @scrolltolower="onLoadMore"
    >
      <view v-if="searchQuery" class="mb-4 px-4 pt-4">
        <text class="text-gray-600">
          找到 <text class="text-blue-600 font-semibold">
            {{ total }}
          </text> 本相关图书
        </text>
      </view>
      <view class="px-4 space-y-4">
        <view
          v-for="book in books"
          :key="book.id"
          class="cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          @click="onBookClick(book)"
        >
          <view class="flex space-x-4">
            <view class="h-20 w-16 flex-shrink-0 rounded-lg bg-gray-100">
              <image :src="book.coverUrl" :alt="book.title" class="h-full w-full rounded-lg object-cover" />
            </view>
            <view class="min-w-0 flex-1">
              <text class="line-clamp-2 mb-1 block text-gray-900 font-medium">
                {{ book.title }}
              </text>
              <text class="mb-1 block text-sm text-gray-600">
                {{ book.author }}
              </text>
              <text class="mb-2 block text-sm text-gray-500">
                {{ book.publisher }} • {{ book.publishDate }}
              </text>
              <view class="flex items-center justify-between">
                <view class="flex items-center text-sm text-gray-600">
                  <text>评分 {{ book.rating }}</text>
                  <text class="mx-2">
                    •
                  </text>
                  <text>已借 {{ book.borrowCount }} 次</text>
                </view>
                <text :class="getBorrowStatusColor(book.availableStock, book.totalStock)">
                  {{ getBorrowStatusText(book.availableStock) }}
                </text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="books.length === 0 && searchQuery && !loading" class="px-4 py-12 text-center">
        <view class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-gray-100">
          <view class="i-carbon-search h-8 w-8 text-gray-400" />
        </view>
        <text class="mb-2 block text-lg text-gray-900 font-medium">
          未找到相关图书
        </text>
        <text class="block text-gray-600">
          请尝试其他关键词或调整筛选条件
        </text>
      </view>
      <wd-loadmore :state="loadStatus" />
    </scroll-view>
  </view>
</template>

<style scoped>
/**** 头部高度 60px，筛选区高度 160px（可根据实际调整） ****/
.scroll-view-content {
  min-height: 100%;
}
</style>

<route lang="json5">
{
  style: {
    navigationBarTitleText: '搜索',
  },
}
</route>
