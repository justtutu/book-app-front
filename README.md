<p align="center">
  <a href="https://github.com/unibest-tech/unibest">
    <img width="160" src="./src/static/logo.svg">
  </a>
</p>

<h1 align="center">
  <a href="https://github.com/unibest-tech/unibest" target="_blank">unibest - 最好的 uniapp 开发框架</a>
</h1>

<div align="center">
旧仓库 codercup 进不去了，star 也拿不回来，这里也展示一下那个地址的 star.

[![GitHub Repo stars](https://img.shields.io/github/stars/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)
[![GitHub forks](https://img.shields.io/github/forks/codercup/unibest?style=flat&logo=github)](https://github.com/codercup/unibest)

</div>

<div align="center">

[![GitHub Repo stars](https://img.shields.io/github/stars/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![GitHub forks](https://img.shields.io/github/forks/feige996/unibest?style=flat&logo=github)](https://github.com/feige996/unibest)
[![star](https://gitee.com/feige996/unibest/badge/star.svg?theme=dark)](https://gitee.com/feige996/unibest/stargazers)
[![fork](https://gitee.com/feige996/unibest/badge/fork.svg?theme=dark)](https://gitee.com/feige996/unibest/members)
![node version](https://img.shields.io/badge/node-%3E%3D18-green)
![pnpm version](https://img.shields.io/badge/pnpm-%3E%3D7.30-green)
![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/feige996/unibest)
![GitHub License](https://img.shields.io/github/license/feige996/unibest)

</div>

`unibest` —— 最好的 `uniapp` 开发模板，由 `uniapp` + `Vue3` + `Ts` + `Vite5` + `UnoCss` + `wot-ui` + `z-paging` 构成，使用了最新的前端技术栈，无需依靠 `HBuilderX`，通过命令行方式运行 `web`、`小程序` 和 `App`（编辑器推荐 `VSCode`，可选 `webstorm`）。

`unibest` 内置了 `约定式路由`、`layout布局`、`请求封装`、`请求拦截`、`登录拦截`、`UnoCSS`、`i18n多语言` 等基础功能，提供了 `代码提示`、`自动格式化`、`统一配置`、`代码片段` 等辅助功能，让你编写 `uniapp` 拥有 `best` 体验 （ `unibest 的由来`）。

![](https://raw.githubusercontent.com/andreasbm/readme/master/screenshots/lines/rainbow.png)

<p align="center">
  <a href="https://unibest.tech/" target="_blank">📖 文档地址(new)</a>
  <span style="margin:0 10px;">|</span>
  <a href="https://feige996.github.io/hello-unibest/" target="_blank">📱 DEMO 地址</a>
</p>

---

注意旧的地址 [codercup](https://github.com/codercup/unibest) 我进不去了，使用新的 [feige996](https://github.com/feige996/unibest)。PR和 issue 也请使用新地址，否则无法合并。

## 平台兼容性

| H5  | IOS | 安卓 | 微信小程序 | 字节小程序 | 快手小程序 | 支付宝小程序 | 钉钉小程序 | 百度小程序 |
| --- | --- | ---- | ---------- | ---------- | ---------- | ------------ | ---------- | ---------- |
| √   | √   | √    | √          | √          | √          | √            | √          | √          |

注意每种 `UI框架` 支持的平台有所不同，详情请看各 `UI框架` 的官网，也可以看 `unibest` 文档。

## ⚙️ 环境

- node>=18
- pnpm>=7.30
- Vue Official>=2.1.10
- TypeScript>=5.0

## &#x1F4C2; 快速开始

执行 `pnpm create unibest` 创建项目
执行 `pnpm i` 安装依赖
执行 `pnpm dev` 运行 `H5`
执行 `pnpm dev:mp` 运行 `微信小程序`

## 📦 运行（支持热更新）

- web平台： `pnpm dev:h5`, 然后打开 [http://localhost:9000/](http://localhost:9000/)。
- weixin平台：`pnpm dev:mp` 然后打开微信开发者工具，导入本地文件夹，选择本项目的`dist/dev/mp-weixin` 文件。
- APP平台：`pnpm dev:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/dev/app` 文件夹，选择运行到模拟器(开发时优先使用)，或者运行的安卓/ios基座。

## 🔗 发布

- web平台： `pnpm build:h5`，打包后的文件在 `dist/build/h5`，可以放到web服务器，如nginx运行。如果最终不是放在根目录，可以在 `manifest.config.ts` 文件的 `h5.router.base` 属性进行修改。
- weixin平台：`pnpm build:mp`, 打包后的文件在 `dist/build/mp-weixin`，然后通过微信开发者工具导入，并点击右上角的"上传"按钮进行上传。
- APP平台：`pnpm build:app`, 然后打开 `HBuilderX`，导入刚刚生成的`dist/build/app` 文件夹，选择发行 - APP云打包。

## 📄 License

[MIT](https://opensource.org/license/mit/)

Copyright (c) 2025 菲鸽

## 捐赠

<p align='center'>
<img alt="special sponsor appwrite" src="https://oss.laf.run/ukw0y1-site/pay/wepay.png" height="330" style="display:inline-block; height:330px;">
<img alt="special sponsor appwrite" src="https://oss.laf.run/ukw0y1-site/pay/alipay.jpg" height="330" style="display:inline-block; height:330px; margin-left:10px;">
</p>

# 图书管理小程序

基于 unibest 框架开发的微信小程序图书管理系统，提供完整的图书借阅管理功能。

## 功能特性

### 用户端功能
- **用户认证**: 支持用户注册、登录，区分普通用户和管理员角色
- **图书浏览**: 首页展示热门图书、最新上架、分类浏览
- **图书搜索**: 支持按书名、作者、ISBN、出版社搜索，支持分类筛选和排序
- **图书详情**: 查看图书详细信息，包括库存状态、评分、借阅次数等
- **借阅管理**: 借阅图书、归还图书、续借功能
- **借阅记录**: 查看当前借阅和历史借阅记录
- **个人中心**: 用户信息管理、借阅统计、功能入口

### 管理员功能
- **数据概览**: 图书总数、可借图书、借出图书、今日借阅等统计
- **图书管理**: 添加、编辑、删除图书信息
- **借阅管理**: 查看所有用户的借阅记录
- **用户管理**: 管理用户账户和权限
- **统计分析**: 借阅数据和趋势分析

## 技术栈

- **框架**: unibest (uniapp + Vue3 + TypeScript)
- **状态管理**: Pinia
- **UI组件**: wot-design-uni
- **样式**: UnoCSS
- **构建工具**: Vite

## 项目结构

```
src/
├── pages/                 # 页面文件
│   ├── home/             # 首页
│   ├── search/           # 搜索页面
│   ├── book-detail/      # 图书详情页
│   ├── borrow/           # 借阅管理页
│   ├── profile/          # 个人中心
│   ├── auth/             # 登录注册页
│   └── admin/            # 管理后台
├── store/                # 状态管理
│   ├── app.ts           # 应用状态
│   └── index.ts         # store配置
├── types/                # 类型定义
├── components/           # 公共组件
├── utils/                # 工具函数
└── static/               # 静态资源
```

## 快速开始

### 环境要求
- Node.js >= 16
- pnpm >= 7

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev:mp-weixin
```

### 构建生产版本
```bash
pnpm build:mp-weixin
```

## 使用说明

### 演示账号
- **普通用户**: 13812345678 / 123456
- **管理员**: 13800138000 / admin123

### 主要功能流程

1. **用户登录/注册**
   - 进入应用后，未登录用户会看到登录提示
   - 点击"立即登录"进入登录页面
   - 支持手机号+密码登录，新用户可注册

2. **图书浏览和搜索**
   - 首页展示热门图书、最新上架、分类浏览
   - 点击搜索栏进入搜索页面
   - 支持关键词搜索、分类筛选、排序

3. **图书借阅**
   - 点击图书进入详情页
   - 查看图书信息和库存状态
   - 点击"立即借阅"完成借阅

4. **借阅管理**
   - 在"借阅"标签页查看当前借阅和历史记录
   - 支持归还图书和续借功能
   - 显示到期提醒和逾期状态

5. **管理员功能**
   - 管理员用户可在个人中心看到"管理后台"入口
   - 查看系统统计数据
   - 管理图书和用户信息

## 数据模型

### 用户 (User)
```typescript
interface User {
  id: string;
  username: string;
  phone: string;
  avatar?: string;
  role: 'user' | 'admin';
  points: number;
  registerTime: string;
  status: 'active' | 'banned';
}
```

### 图书 (Book)
```typescript
interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  categoryId: string;
  price: number;
  totalStock: number;
  availableStock: number;
  description: string;
  coverUrl: string;
  addTime: string;
  status: 'available' | 'unavailable';
  borrowCount: number;
  rating: number;
}
```

### 借阅记录 (BorrowRecord)
```typescript
interface BorrowRecord {
  id: string;
  userId: string;
  bookId: string;
  borrowTime: string;
  dueTime: string;
  returnTime?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fine: number;
}
```

## 开发说明

### 状态管理
项目使用 Pinia 进行状态管理，主要包含：
- 用户信息管理
- 图书数据管理
- 借阅记录管理
- 分类数据管理

### 页面路由
使用 unibest 的路由配置，支持：
- 自定义导航栏
- 底部标签栏
- 页面参数传递

### 组件使用
优先使用 wot-design-uni 组件库，提供：
- 统一的UI风格
- 丰富的组件功能
- 良好的用户体验

## 部署说明

1. 构建项目生成小程序代码
2. 使用微信开发者工具打开 dist/build/mp-weixin 目录
3. 配置小程序 AppID 和相关信息
4. 上传代码到微信小程序后台

## 注意事项

- 当前版本使用本地存储模拟数据，实际部署需要连接后端服务
- 图片资源使用外部链接，生产环境建议使用本地资源
- 用户认证为模拟实现，实际使用需要集成真实的认证服务

## 更新日志

### v1.0.0
- 完成基础功能开发
- 实现用户认证和图书管理
- 支持借阅流程和记录管理
- 添加管理员功能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进项目。

## 许可证

MIT License
