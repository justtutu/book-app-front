<route lang="json5">
{
  style: {
    navigationBarTitleText: '图书管理',
  },
}
</route>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import useRequest from '@/hooks/useRequest'
import { useAppStore } from '@/store'
import { getPageMarginTop } from '@/utils'
import { httpGet, httpPost } from '@/utils/http'
import { toast } from '@/utils/toast'

const appStore = useAppStore()

// 搜索表单
const searchForm = ref({
  title: '',
  author: '',
  category: '',
  page: 1,
  pageSize: 10,
})

// 图书列表请求
const { loading, error, data, run: fetchBooks } = useRequest<any>(
  () => httpGet('/books', searchForm.value),
  { immediate: true },
)
console.log('data', data)

const books = computed(() => data.value?.data || [])
const total = computed(() => data.value?.total || 0)

function onSearch() {
  searchForm.value.page = 1
  fetchBooks()
}
function onPageChange(page: number) {
  searchForm.value.page = page
  fetchBooks()
}
function onAddBook() {
  uni.navigateTo({ url: '/pages-sub/page-admin/book-edit' })
}
function onEditBook(id: string) {
  uni.navigateTo({ url: `/pages-sub/page-admin/book-edit?id=${id}` })
}
function onDeleteBook(id: string) {
  uni.showModal({
    title: '提示',
    content: '确定要删除该图书吗？',
    confirmText: '删除',
    confirmColor: '#e53e3e',
    success: (res) => {
      if (res.confirm) {
        httpPost(`/books/delete`, { id }).then(() => {
          toast.success('删除成功')
          fetchBooks()
        })
      }
    },
  })
}

function onGotoStatistics() {
  uni.navigateTo({ url: '/pages-sub/page-admin/statistics' })
}

onMounted(() => {
  uni.$on('refreshBookList', fetchBooks)
})
</script>

<template>
  <view class="bg-white px-4 pt-2" :style="{ marginTop: getPageMarginTop() }">
    <!-- 搜索栏 -->
    <wd-form :model="searchForm" class="mb-4">
      <wd-input v-model="searchForm.title" clearable label="书名" placeholder="请输入书名" />
      <wd-input v-model="searchForm.author" clearable label="作者" placeholder="请输入作者" />
      <wd-input v-model="searchForm.category" clearable label="分类" placeholder="请输入分类" />
      <wd-button type="primary" block @click="onSearch">
        搜索
      </wd-button>
    </wd-form>
    <!-- 新增按钮 -->
    <view class="mb-2 mt-2 flex justify-end space-x-2">
      <wd-button type="primary" @click="onAddBook">
        新增图书
      </wd-button>
      <wd-button type="default" @click="onGotoStatistics">
        统计分析
      </wd-button>
    </view>
    <!-- 表格部分 -->
    <wd-table :data="books" :border="true" :stripe="true" :height="400">
      <wd-table-col prop="title" label="书名" />
      <wd-table-col prop="author" label="作者" />
      <wd-table-col prop="category" label="分类" />
      <wd-table-col prop="isbn" label="ISBN" />
      <wd-table-col prop="status" label="状态" />
      <wd-table-col prop="action" label="操作" width="200" fixed>
        <template #value="{ row }">
          <wd-button size="small" class="mr-2" @click="onEditBook(row.id)">
            编辑
          </wd-button>
          <wd-button size="small" type="error" @click="onDeleteBook(row.id)">
            删除
          </wd-button>
        </template>
      </wd-table-col>
    </wd-table>
    <!-- 分页 -->
    <view class="mt-4 flex justify-center">
      <wd-pagination v-model="searchForm.page" :total="total" :page-size="searchForm.pageSize" @change="onPageChange" />
    </view>
  </view>
</template>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
