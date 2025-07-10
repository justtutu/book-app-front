<route lang="json5">
{
  style: {
    navigationBarTitleText: '编辑个人信息',
  },
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import { useAppStore } from '@/store'
import { toast } from '@/utils/toast'

const appStore = useAppStore()
const user = ref({ ...appStore.state.user })
const fileList = ref(user.value.avatar ? [{ url: user.value.avatar }] : [])

function onAvatarChange(file) {
  // file.url 为本地临时路径
  fileList.value = [file]
  user.value.avatar = file.url
}
function onSave() {
  appStore.state.user.username = user.value.username
  appStore.state.user.phone = user.value.phone
  appStore.state.user.avatar = user.value.avatar
  toast.success('保存成功')
  uni.navigateBack()
}
</script>

<template>
  <view class="min-h-screen bg-white px-4 pt-4">
    <wd-form :model="user">
      <wd-cell-group border>
        <wd-upload
          label="头像"
          prop="avatar"
          :file-list="fileList"
          :max-count="1"
          @after-read="onAvatarChange"
        />
        <wd-input
          v-model="user.username"
          label="昵称"
          prop="username"
          placeholder="请输入昵称"
        />
        <wd-input
          v-model="user.phone"
          label="手机号"
          prop="phone"
          placeholder="请输入手机号"
          type="number"
        />
      </wd-cell-group>
      <view class="mt-8">
        <wd-button type="primary" block @click="onSave">
          保存
        </wd-button>
      </view>
    </wd-form>
  </view>
</template>
