<route lang="json5">
{
  style: {
    navigationBarTitleText: '图书编辑',
  },
}
</route>

<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app'
import { computed, onMounted, ref, watch } from 'vue'
import useRequest from '@/hooks/useRequest'
import { uploadFile } from '@/hooks/useUpload'
import { useAppStore } from '@/store'
import { httpGet, httpPost } from '@/utils/http'
import { toast } from '@/utils/toast'

const appStore = useAppStore()
const categories = computed(() => appStore.state.categories)

const formRef = ref()
const formData = ref({
  title: '',
  author: '',
  category: '',
  isbn: '',
  publisher: '',
  publishDate: '',
  description: '',
  coverUrl: '',
  status: '',
})

const rules = {
  title: [{ required: true, message: '请输入书名' }],
  author: [{ required: true, message: '请输入作者' }],
  category: [{ required: true, message: '请选择分类' }],
  isbn: [{ required: true, message: '请输入ISBN' }],
  publisher: [{ required: true, message: '请输入出版社' }],
  publishDate: [{ required: true, message: '请输入出版日期' }],
  description: [{ required: true, message: '请输入简介' }],
  coverUrl: [{ required: true, message: '请输入封面图片URL' }],
  status: [{ required: true, message: '请选择状态' }],
}

const categoryOptions = ref([])
const statusOptions = ref([])

const { data: catData, run: runCat } = useRequest<any>(() => httpPost('/dict/list', { type: 'category' }), { immediate: false })
const { data: statusData, run: runStatus } = useRequest<any>(() => httpPost('/dict/list', { type: 'book_status' }), { immediate: false })

onMounted(() => {
  runCat()
  runStatus()
})

watch(catData, (val) => {
  categoryOptions.value = Array.isArray(val?.data) ? val.data.map((item: any) => ({ label: item.name, value: item.code })) : []
})

watch(statusData, (val) => {
  statusOptions.value = Array.isArray(val?.data) ? val.data.map((item: any) => ({ label: item.name, value: item.code })) : []
})

const bookId = ref<string | null>(null)
const isEdit = computed(() => !!bookId.value)

const { run: fetchDetail } = useRequest<any>(
  () => httpGet(`/books/${bookId.value}`),
  { immediate: false },
)

onLoad((query) => {
  if (query.id) {
    bookId.value = query.id
    fetchDetail().then((res) => {
      Object.assign(formData.value, res)
    })
  }
})

function onSubmit() {
  formRef.value
    .validate()
    .then(({ valid, errors }) => {
      if (valid) {
        const payload = { ...formData.value } as any
        if (bookId.value) {
          payload.id = bookId.value
        }
        else {
          delete payload.id
        }
        httpPost('/books', payload).then(() => {
          toast.success('保存成功')
          setTimeout(() => {
            uni.navigateBack()
            uni.$emit('refreshBookList')
          }, 500)
        })
      }
    })
    .catch((error) => {
      console.log(error, 'error')
    })
}

const fileList = ref<any[]>([])

function customUpload(file, uploadFormData, options) {
  const tempFilePath = file.url || file.path || ''
  if (!tempFilePath) {
    options.onError('文件路径不存在', file, uploadFormData)
    return
  }
  uploadFile({
    tempFilePath,
    formData: uploadFormData,
    onSuccess: (res) => {
      let url = ''
      try {
        const data = typeof res === 'string' ? JSON.parse(res).data : res.data
        url = data.url || data.data?.url || ''
      }
      catch (e) {
        url = ''
      }
      if (url) {
        formData.value.coverUrl = url
        options.onSuccess({ ...res, url }, file, uploadFormData)
      }
      else {
        options.onError({ ...res, errMsg: '未获取到图片地址' }, file, uploadFormData)
      }
    },
    onError: (err) => {
      options.onError(err, file, uploadFormData)
    },
    onComplete: () => {},
  })
}

// 回显已上传图片
watch(() => formData.value.coverUrl, (val) => {
  fileList.value = val ? [{ url: val }] : []
})
</script>

<template>
  <view class="bg-white px-4 pt-2">
    <wd-form ref="formRef" :model="formData" :rules="rules" label-width="80">
      <wd-cell title="书本封面" required>
        <wd-upload
          v-model:file-list="fileList"
          :upload-method="customUpload"
          :limit="1"
          prop="coverUrl"
          image-mode="aspectFill"
        />
      </wd-cell>
      <wd-input v-model="formData.title" label="书名" prop="title" placeholder="请输入书名" />
      <wd-input v-model="formData.author" label="作者" prop="author" placeholder="请输入作者" />
      <wd-select-picker
        v-model="formData.category"
        label="分类"
        prop="category"
        :columns="categoryOptions"
        type="radio"
        placeholder="请选择分类"
        required
      />
      <wd-input v-model="formData.isbn" label="ISBN" prop="isbn" placeholder="请输入ISBN" />
      <wd-input v-model="formData.publisher" label="出版社" prop="publisher" placeholder="请输入出版社" />
      <wd-calendar
        v-model="formData.publishDate"
        label="出版日期"
        prop="publishDate"
        placeholder="请选择出版日期"
      />
      <wd-select-picker
        v-model="formData.status"
        label="状态"
        prop="status"
        :columns="statusOptions"
        type="radio"
        placeholder="请选择状态"
        required
      />
      <wd-textarea v-model="formData.description" label="简介" prop="description" placeholder="请输入简介" />
      <wd-button type="primary" block class="mt-4" @click="onSubmit">
        保存
      </wd-button>
    </wd-form>
  </view>
</template>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
</style>
