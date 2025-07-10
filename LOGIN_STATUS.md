# 登录状态判断机制

## 概述

本项目已从基于 `username` 的登录状态判断改为基于 `token` 的判断机制，提供更安全的身份验证。

## 主要变更

### 1. 登录状态判断逻辑

**之前**：通过检查 `userStore.userInfo.username` 是否存在来判断
```typescript
function isLogined() {
  const userStore = useUserStore()
  return !!userStore.userInfo.username
}
```

**现在**：通过检查 token 存在性和有效性来判断
```typescript
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
  } catch (error) {
    console.error('Token验证失败:', error)
    return false
  }
}
```

### 2. 新增功能

#### UserStore 新增方法
- `hasValidToken()`: 检查token是否存在且不为空
- `validateToken()`: 调用后端接口验证token有效性

#### 工具函数 (utils/index.ts)
- `hasValidToken()`: 检查本地存储中是否有有效token
- `isLoggedIn()`: 简单的登录状态检查
- `clearLoginInfo()`: 清除登录信息

#### 认证钩子 (hooks/useAuth.ts)
- `isLoggedIn()`: 检查是否已登录
- `validateToken()`: 验证token有效性
- `checkLoginStatus()`: 完整的登录状态检查
- `logout()`: 退出登录
- `clearAuth()`: 清除认证信息

### 3. HTTP拦截器增强

当收到401错误时，自动：
1. 清除本地存储的用户信息和token
2. 跳转到登录页面
3. 保存当前页面路径作为重定向目标

## 使用方式

### 在组件中检查登录状态

```typescript
import { useAuth } from '@/hooks/useAuth'

export default {
  setup() {
    const { isLoggedIn, checkLoginStatus, userInfo } = useAuth()
    
    // 简单检查
    if (isLoggedIn()) {
      console.log('用户已登录')
    }
    
    // 完整验证（推荐）
    const checkAuth = async () => {
      const isValid = await checkLoginStatus()
      if (isValid) {
        console.log('登录状态有效')
      } else {
        console.log('需要重新登录')
      }
    }
    
    return {
      userInfo,
      checkAuth
    }
  }
}
```

### 在页面中使用

```typescript
import { usePageAuth } from '@/hooks/usePageAuth'

// 在页面中启用权限验证
usePageAuth()
```

### 手动清除登录信息

```typescript
import { clearLoginInfo } from '@/utils'

// 清除登录信息
clearLoginInfo()
```

## 安全优势

1. **Token验证**: 不仅检查token存在性，还验证其有效性
2. **自动清理**: 401错误时自动清除无效的登录信息
3. **重定向保护**: 自动跳转到登录页并保存原页面路径
4. **持久化**: 登录信息持久化存储，应用重启后仍有效

## 注意事项

1. 页面权限验证现在是异步的，需要等待token验证完成
2. 建议在需要严格权限控制的页面使用 `checkLoginStatus()` 进行完整验证
3. 简单的UI显示可以使用 `isLoggedIn()` 进行快速检查
4. 401错误会自动处理，无需手动处理token失效情况 