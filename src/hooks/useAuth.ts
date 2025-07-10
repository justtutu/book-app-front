import { useUserStore } from '@/store'
import { clearLoginInfo, hasValidToken } from '@/utils'

/**
 * 认证相关钩子
 */
export function useAuth() {
  const userStore = useUserStore()

  /**
   * 检查是否已登录（仅检查token存在性）
   */
  const isLoggedIn = () => {
    return hasValidToken()
  }

  /**
   * 验证token有效性（调用后端接口验证）
   */
  const validateToken = async () => {
    return await userStore.validateToken()
  }

  /**
   * 完整的登录状态检查（包括token验证）
   */
  const checkLoginStatus = async () => {
    if (!isLoggedIn()) {
      return false
    }
    return await validateToken()
  }

  /**
   * 退出登录
   */
  const logout = async () => {
    await userStore.logout()
  }

  /**
   * 清除登录信息（不调用后端接口）
   */
  const clearAuth = () => {
    clearLoginInfo()
    // 重置store中的用户信息
    userStore.userInfo = {
      id: 0,
      username: '',
      avatar: '/static/images/default-avatar.png',
      token: '',
    }
  }

  return {
    isLoggedIn,
    validateToken,
    checkLoginStatus,
    logout,
    clearAuth,
    userInfo: userStore.userInfo,
  }
}
