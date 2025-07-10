<route lang="json5">
{
  style: {
    navigationBarTitleText: '意见反馈',
  },
}
</route>

<script lang="ts" setup>
import { reactive } from 'vue'
import { toast } from '@/utils/toast'

const model = reactive({
  content: '',
  contact: '',
})

function onSubmit() {
  if (!model.content) {
    toast.warning('请填写反馈内容')
    return
  }
  // 实际应提交到后端，这里仅本地演示
  toast.success('反馈已提交，感谢您的建议！')
  model.content = ''
  model.contact = ''
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen bg-white px-4 pt-4">
    <wd-form :model="model">
      <wd-cell-group border>
        <wd-textarea
          v-model="model.content"
          label="反馈内容"
          prop="content"
          placeholder="请描述您的问题或建议"
          rows="5"
        />
        <wd-input
          v-model="model.contact"
          label="联系方式"
          prop="contact"
          placeholder="选填，便于我们联系您"
        />
      </wd-cell-group>
      <view class="mt-8">
        <wd-button type="primary" block @click="onSubmit">
          提交反馈
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>
