import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'
import { needLoginPages as _needLoginPages, getNeedLoginPages } from '@/utils'

const loginRoute = import.meta.env.VITE_LOGIN_URL
const isDev = import.meta.env.DEV

// 检查是否已登录（通过token判断）
async function isLogined() {
  const userStore = useUserStore()

  // 首先检查是否有token
  if (!userStore.hasValidToken()) {
    return false
  }

  // 如果有token，验证token有效性
  try {
    const isValid = await userStore.validateToken()
    return isValid
  }
  catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}

// 检查当前页面是否需要登录
export function usePageAuth() {
  onLoad(async (options) => {
    // 获取当前页面路径
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const currentPath = `/${currentPage.route}`

    // 获取需要登录的页面列表
    let needLoginPages: string[] = []
    if (isDev) {
      needLoginPages = getNeedLoginPages()
    }
    else {
      needLoginPages = _needLoginPages
    }

    // 检查当前页面是否需要登录
    const isNeedLogin = needLoginPages.includes(currentPath)
    if (!isNeedLogin) {
      return
    }

    const hasLogin = await isLogined()
    if (hasLogin) {
      return true
    }

    // 构建重定向URL
    const queryString = Object.entries(options || {})
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')

    const currentFullPath = queryString ? `${currentPath}?${queryString}` : currentPath
    const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(currentFullPath)}`

    // 重定向到登录页
    uni.redirectTo({ url: redirectRoute })
  })
}
