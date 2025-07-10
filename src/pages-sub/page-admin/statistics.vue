<!-- eslint-disable -->
<route lang="json5">
{
  style: {
    navigationBarTitleText: '统计分析',
  },
}
</route>

<script lang="ts" setup>
import uCharts from '@qiun/ucharts'
import { onMounted, ref } from 'vue'

const windowWidth = ref(375)
const chartHeight = ref(uni.upx2px(300))
const cardPaddingPx = 16 // 与样式保持一致
const chartInstance = ref<any>(null)

// mock数据，实际应从后端接口获取
const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - (6 - i))
  return `${d.getMonth() + 1}/${d.getDate()}`
})
const borrowCounts = [12, 18, 9, 22, 15, 27, 19]

// 热门图书排行 mock
const hotBooks = [
  { title: '三体', count: 32 },
  { title: '活着', count: 28 },
  { title: '百年孤独', count: 25 },
  { title: '解忧杂货店', count: 20 },
  { title: '小王子', count: 18 },
]

// 图书分类借阅分布 mock
const categoryData = [
  { name: '科幻', value: 40 },
  { name: '文学', value: 30 },
  { name: '历史', value: 15 },
  { name: '心理', value: 10 },
  { name: '其他', value: 5 },
]

// 图书库存状态 mock
const stockStatus = [
  { name: '可借', value: 120 },
  { name: '已借出', value: 60 },
  { name: '下架', value: 20 },
]

// 推荐色板
const chartColors = [
  '#5470C6', // 蓝
  '#91CC75', // 绿
  '#FAC858', // 黄
  '#EE6666', // 红
  '#73C0DE', // 青
  '#3BA272', // 深绿
  '#FC8452', // 橙
  '#9A60B4', // 紫
  '#EA7CCC', // 粉
]

const chartData = {
  categories: days,
  series: [
    {
      name: '借阅量',
      data: borrowCounts,
    },
  ],
}

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  windowWidth.value = sys.windowWidth
  chartHeight.value = uni.upx2px(400)
  drawChart()
  drawHotBooksChart()
  drawCategoryChart()
  drawStockChart()
})

function drawChart() {
  const ctx = uni.createCanvasContext('borrow-trend')
  chartInstance.value = new uCharts({
    type: 'line',
    context: ctx,
    width: windowWidth.value - cardPaddingPx * 2,
    height: chartHeight.value,
    categories: chartData.categories,
    series: chartData.series,
    animation: true,
    background: '#fff',
    color: ['#5470C6'],
    padding: [15, 10, 0, 10],
    dataLabel: true,
    legend: {
      show: true,
    },
    xAxis: {
      disableGrid: false,
    },
    yAxis: {
      min: 0,
    },
    extra: {
      line: {
        type: 'curve',
        width: 2,
        activeType: 'hollow',
      },
    },
  })
}

function drawHotBooksChart() {
  const ctx = uni.createCanvasContext('hot-books')
  new uCharts({
    type: 'bar',
    context: ctx,
    width: windowWidth.value - cardPaddingPx * 2,
    height: chartHeight.value,
    categories: hotBooks.map(b => b.title),
    series: [{ name: '借阅次数', data: hotBooks.map(b => b.count) }],
    animation: true,
    background: '#fff',
    color: chartColors,
    padding: [15, 10, 0, 10],
    dataLabel: true,
    legend: { show: false },
    xAxis: { disableGrid: false },
    yAxis: { min: 0 },
    extra: { bar: { type: 'group', width: 20 } },
  })
}

function drawCategoryChart() {
  const ctx = uni.createCanvasContext('category-pie')
  new uCharts({
    type: 'pie',
    context: ctx,
    width: windowWidth.value - cardPaddingPx * 2,
    height: chartHeight.value,
    series: categoryData.map(c => ({ name: c.name, data: c.value })),
    animation: true,
    background: '#fff',
    color: chartColors,
    padding: [15, 10, 0, 10],
    legend: { show: true },
    extra: { pie: { ringWidth: 30, labelWidth: 15, border: false } },
  })
}

function drawStockChart() {
  const ctx = uni.createCanvasContext('stock-ring')
  new uCharts({
    type: 'ring',
    context: ctx,
    width: windowWidth.value - cardPaddingPx * 2,
    height: chartHeight.value,
    series: stockStatus.map(s => ({ name: s.name, data: s.value })),
    animation: true,
    background: '#fff',
    color: chartColors,
    padding: [15, 10, 0, 10],
    legend: { show: true },
    extra: { ring: { ringWidth: 30, activeRadius: 10 } },
  })
}

function tap(e: any) {
  chartInstance.value?.touchLegend(e)
  chartInstance.value?.showToolTip(e)
}
</script>

<template>
  <view class="min-h-screen bg-gray-50 pb-6">
    <view class="mb-4 px-4 pt-4 text-2xl text-gray-900 font-bold">
      统计分析
    </view>
    <view class="card">
      <view class="mb-2 text-lg text-gray-800 font-bold">
        近7天图书借阅趋势
      </view>
      <canvas
        id="borrow-trend"
        canvas-id="borrow-trend"
        class="charts mx-auto"
        @touchend="tap"
      />
    </view>
    <view class="card">
      <view class="mb-2 text-lg text-gray-800 font-bold">
        热门图书排行
      </view>
      <canvas
        id="hot-books"
        canvas-id="hot-books"
        class="charts mx-auto"
      />
    </view>
    <view class="card">
      <view class="mb-2 text-lg text-gray-800 font-bold">
        图书分类借阅分布
      </view>
      <canvas
        id="category-pie"
        canvas-id="category-pie"
        class="charts mx-auto"
      />
    </view>
    <view class="card">
      <view class="mb-2 text-lg text-gray-800 font-bold">
        图书库存状态
      </view>
      <canvas
        id="stock-ring"
        canvas-id="stock-ring"
        class="charts mx-auto"
      />
    </view>
    <!-- 后续可扩展更多统计图表 -->
  </view>
</template>

<style scoped>
.charts {
  width: 100%;
  height: 400rpx;
  display: block;
}
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(31, 56, 88, 0.06);
  padding: 20rpx 16px 32rpx 16px;
  margin: 0 0 32rpx 0;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
</style>
