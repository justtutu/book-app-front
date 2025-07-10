import type { AppState, Book, BorrowRecord, Category, User } from '@/types/index'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 初始状态
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  books: [],
  categories: [],
  borrowRecords: [],
  notifications: [],
  favorites: [],
}

// mock 数据
const mockCategories: Category[] = [
  { id: '1', name: '文学小说', description: '各类文学作品和小说' },
  { id: '2', name: '科技计算机', description: '计算机技术和科技类书籍' },
  { id: '3', name: '历史传记', description: '历史类和人物传记' },
  { id: '4', name: '经济管理', description: '经济学和管理学书籍' },
  { id: '5', name: '教育教学', description: '教育理论和教学方法' },
]

// 初始借阅记录
const mockBorrowRecords: BorrowRecord[] = [
  {
    id: '1',
    userId: '1',
    bookId: '1',
    borrowTime: '2024-01-15T10:00:00Z',
    dueTime: '2024-02-14T10:00:00Z',
    returnTime: '2024-02-10T15:30:00Z',
    status: 'returned',
    fine: 0,
  },
  {
    id: '2',
    userId: '1',
    bookId: '3',
    borrowTime: '2024-02-01T14:20:00Z',
    dueTime: '2024-03-03T14:20:00Z',
    status: 'borrowed',
    fine: 0,
  },
  {
    id: '3',
    userId: '1',
    bookId: '6',
    borrowTime: '2024-01-20T09:15:00Z',
    dueTime: '2024-02-19T09:15:00Z',
    returnTime: '2024-02-25T16:45:00Z',
    status: 'returned',
    fine: 6, // 逾期6天，罚款6元
  },
]

const mockBooks: Book[] = [
  {
    id: '1',
    isbn: '9787020002207',
    title: '红楼梦',
    author: '曹雪芹',
    publisher: '人民文学出版社',
    publishDate: '2020-01-01',
    categoryId: '1',
    price: 68.00,
    totalStock: 5,
    availableStock: 3,
    description: '中国古典四大名著之一，描写了贾、史、王、薛四大家族的兴衰史...',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-01-01T08:00:00Z',
    status: 'available',
    borrowCount: 156,
    rating: 4.8,
  },
  {
    id: '2',
    isbn: '9787301281234',
    title: '深入浅出计算机组成原理',
    author: '王道',
    publisher: '清华大学出版社',
    publishDate: '2021-05-10',
    categoryId: '2',
    price: 88.00,
    totalStock: 10,
    availableStock: 7,
    description: '计算机基础知识入门，适合初学者和考研学生。',
    coverUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-02-15T10:00:00Z',
    status: 'available',
    borrowCount: 98,
    rating: 4.5,
  },
  {
    id: '3',
    isbn: '9787505737010',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    publisher: '中信出版社',
    publishDate: '2019-08-01',
    categoryId: '3',
    price: 59.00,
    totalStock: 8,
    availableStock: 2,
    description: '一本讲述人类从远古到现代发展历程的畅销书。',
    coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-03-10T09:00:00Z',
    status: 'available',
    borrowCount: 120,
    rating: 4.7,
  },
  {
    id: '4',
    isbn: '9787302423282',
    title: '经济学原理',
    author: '曼昆',
    publisher: '北京大学出版社',
    publishDate: '2018-09-01',
    categoryId: '4',
    price: 99.00,
    totalStock: 12,
    availableStock: 10,
    description: '经济学入门经典教材，理论与案例结合。',
    coverUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-04-01T11:00:00Z',
    status: 'available',
    borrowCount: 80,
    rating: 4.6,
  },
  {
    id: '5',
    isbn: '9787301234567',
    title: '教育心理学',
    author: '皮连生',
    publisher: '华东师范大学出版社',
    publishDate: '2022-03-01',
    categoryId: '5',
    price: 45.00,
    totalStock: 6,
    availableStock: 4,
    description: '教育心理学基础理论与实践案例。',
    coverUrl: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-04-10T12:00:00Z',
    status: 'available',
    borrowCount: 60,
    rating: 4.3,
  },
  {
    id: '6',
    isbn: '9787020002208',
    title: '三体',
    author: '刘慈欣',
    publisher: '重庆出版社',
    publishDate: '2017-06-01',
    categoryId: '1',
    price: 39.00,
    totalStock: 15,
    availableStock: 12,
    description: '中国科幻小说巅峰之作，三体宇宙的开端。',
    coverUrl: 'https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-05-01T13:00:00Z',
    status: 'available',
    borrowCount: 200,
    rating: 4.9,
  },
  {
    id: '7',
    isbn: '9787301285678',
    title: '算法图解',
    author: 'Aditya Bhargava',
    publisher: '人民邮电出版社',
    publishDate: '2019-11-01',
    categoryId: '2',
    price: 59.00,
    totalStock: 8,
    availableStock: 5,
    description: '用图解方式讲解常见算法，通俗易懂。',
    coverUrl: 'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-05-10T14:00:00Z',
    status: 'available',
    borrowCount: 110,
    rating: 4.4,
  },
  {
    id: '8',
    isbn: '9787505737020',
    title: '世界简史',
    author: '朱利安·巴恩斯',
    publisher: '商务印书馆',
    publishDate: '2016-10-01',
    categoryId: '3',
    price: 49.00,
    totalStock: 7,
    availableStock: 3,
    description: '世界历史的简明梳理，适合大众阅读。',
    coverUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-05-15T15:00:00Z',
    status: 'available',
    borrowCount: 70,
    rating: 4.2,
  },
  {
    id: '9',
    isbn: '9787302423299',
    title: '管理学',
    author: '斯蒂芬·罗宾斯',
    publisher: '机械工业出版社',
    publishDate: '2015-08-01',
    categoryId: '4',
    price: 79.00,
    totalStock: 9,
    availableStock: 6,
    description: '管理学经典教材，理论与实践结合。',
    coverUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-06-01T16:00:00Z',
    status: 'available',
    borrowCount: 90,
    rating: 4.5,
  },
  {
    id: '10',
    isbn: '9787301234568',
    title: '教师专业发展',
    author: '李政涛',
    publisher: '华东师范大学出版社',
    publishDate: '2020-09-01',
    categoryId: '5',
    price: 55.00,
    totalStock: 6,
    availableStock: 2,
    description: '教师成长与专业发展的理论与实践。',
    coverUrl: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-06-10T17:00:00Z',
    status: 'available',
    borrowCount: 40,
    rating: 4.1,
  },
  {
    id: '11',
    isbn: '9787020002209',
    title: '西游记',
    author: '吴承恩',
    publisher: '人民文学出版社',
    publishDate: '2018-01-01',
    categoryId: '1',
    price: 66.00,
    totalStock: 10,
    availableStock: 8,
    description: '中国古典四大名著之一，讲述唐僧师徒西天取经的故事。',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-07-01T08:00:00Z',
    status: 'available',
    borrowCount: 130,
    rating: 4.7,
  },
  {
    id: '12',
    isbn: '9787301281235',
    title: '代码大全',
    author: 'Steve McConnell',
    publisher: '电子工业出版社',
    publishDate: '2014-05-10',
    categoryId: '2',
    price: 108.00,
    totalStock: 12,
    availableStock: 9,
    description: '软件开发领域的经典著作，提升编程能力必读。',
    coverUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-07-15T10:00:00Z',
    status: 'available',
    borrowCount: 85,
    rating: 4.6,
  },
  {
    id: '13',
    isbn: '9787505737011',
    title: '万历十五年',
    author: '黄仁宇',
    publisher: '中华书局',
    publishDate: '2017-08-01',
    categoryId: '3',
    price: 39.00,
    totalStock: 7,
    availableStock: 5,
    description: '明朝历史名作，剖析中国历史转折点。',
    coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-08-10T09:00:00Z',
    status: 'available',
    borrowCount: 75,
    rating: 4.3,
  },
  {
    id: '14',
    isbn: '9787302423283',
    title: '创新者的窘境',
    author: '克莱顿·克里斯坦森',
    publisher: '中信出版社',
    publishDate: '2015-09-01',
    categoryId: '4',
    price: 69.00,
    totalStock: 8,
    availableStock: 6,
    description: '商业创新与管理领域的经典之作。',
    coverUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-09-01T11:00:00Z',
    status: 'available',
    borrowCount: 55,
    rating: 4.2,
  },
  {
    id: '15',
    isbn: '9787301234569',
    title: '儿童心理学',
    author: '皮亚杰',
    publisher: '人民教育出版社',
    publishDate: '2016-03-01',
    categoryId: '5',
    price: 48.00,
    totalStock: 5,
    availableStock: 2,
    description: '儿童心理发展与教育的权威著作。',
    coverUrl: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-09-10T12:00:00Z',
    status: 'available',
    borrowCount: 30,
    rating: 4.0,
  },
  {
    id: '16',
    isbn: '9787020002210',
    title: '水浒传',
    author: '施耐庵',
    publisher: '人民文学出版社',
    publishDate: '2019-01-01',
    categoryId: '1',
    price: 60.00,
    totalStock: 9,
    availableStock: 7,
    description: '中国古典四大名著之一，描写梁山好汉的故事。',
    coverUrl: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-10-01T08:00:00Z',
    status: 'available',
    borrowCount: 100,
    rating: 4.5,
  },
  {
    id: '17',
    isbn: '9787301281236',
    title: '操作系统真象还原',
    author: '刘超',
    publisher: '电子工业出版社',
    publishDate: '2022-05-10',
    categoryId: '2',
    price: 88.00,
    totalStock: 10,
    availableStock: 8,
    description: '操作系统底层原理与实现，适合进阶学习。',
    coverUrl: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-10-15T10:00:00Z',
    status: 'available',
    borrowCount: 65,
    rating: 4.3,
  },
  {
    id: '18',
    isbn: '9787505737012',
    title: '大秦帝国',
    author: '孙皓晖',
    publisher: '长江文艺出版社',
    publishDate: '2018-08-01',
    categoryId: '3',
    price: 58.00,
    totalStock: 8,
    availableStock: 5,
    description: '以小说形式展现秦朝历史风云。',
    coverUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-11-10T09:00:00Z',
    status: 'available',
    borrowCount: 50,
    rating: 4.1,
  },
  {
    id: '19',
    isbn: '9787302423284',
    title: '从0到1',
    author: '彼得·蒂尔',
    publisher: '中信出版社',
    publishDate: '2017-09-01',
    categoryId: '4',
    price: 49.00,
    totalStock: 7,
    availableStock: 4,
    description: '创业与创新领域的畅销书。',
    coverUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-12-01T11:00:00Z',
    status: 'available',
    borrowCount: 60,
    rating: 4.4,
  },
  {
    id: '20',
    isbn: '9787301234570',
    title: '教师成长之路',
    author: '郑杰',
    publisher: '华东师范大学出版社',
    publishDate: '2021-03-01',
    categoryId: '5',
    price: 52.00,
    totalStock: 6,
    availableStock: 3,
    description: '教师职业发展与成长的实用指南。',
    coverUrl: 'https://images.pexels.com/photos/261909/pexels-photo-261909.jpeg?auto=compress&cs=tinysrgb&w=300',
    addTime: '2024-12-10T12:00:00Z',
    status: 'available',
    borrowCount: 35,
    rating: 4.0,
  },
]

export const useAppStore = defineStore('app', () => {
  // 全局状态
  const state = ref<AppState>({ ...initialState })

  // 初始化 mock 数据
  const initMockData = () => {
    state.value.categories = mockCategories
    state.value.books = mockBooks
    state.value.borrowRecords = mockBorrowRecords
    // 检查本地用户
    const savedUser = uni.getStorageSync('library_user')
    if (savedUser) {
      state.value.user = JSON.parse(savedUser)
      state.value.isAuthenticated = true
    }
  }

  // 登录
  const login = async (phone: string, password: string): Promise<boolean> => {
    console.log('store login 被调用:', { phone, password })

    // mock 登录
    const mockUser: User = {
      id: '1',
      username: '图书爱好者',
      phone,
      role: phone === '13800138000' ? 'admin' : 'user',
      points: 100,
      registerTime: '2024-01-01T08:00:00Z',
      status: 'active',
    }

    console.log('创建用户对象:', mockUser)

    state.value.user = mockUser
    state.value.isAuthenticated = true
    uni.setStorageSync('library_user', JSON.stringify(mockUser))

    console.log('登录成功，用户状态已更新')
    return true
  }

  // 注册
  const register = async (userData: { phone: string, password: string, username: string }): Promise<boolean> => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      phone: userData.phone,
      role: 'user',
      points: 0,
      registerTime: new Date().toISOString(),
      status: 'active',
    }
    state.value.user = newUser
    state.value.isAuthenticated = true
    uni.setStorageSync('library_user', JSON.stringify(newUser))
    return true
  }

  // 退出登录
  const logout = () => {
    state.value.user = null
    state.value.isAuthenticated = false
    uni.removeStorageSync('library_user')
  }

  // 借书
  const borrowBook = async (bookId: string): Promise<boolean> => {
    if (!state.value.user)
      return false

    const book = state.value.books.find(b => b.id === bookId)
    if (!book || book.availableStock <= 0)
      return false

    // 检查用户是否已经借阅此书
    const existingBorrow = state.value.borrowRecords.find(
      record => record.userId === state.value.user!.id
        && record.bookId === bookId
        && record.status === 'borrowed',
    )
    if (existingBorrow) {
      uni.showToast({ title: '您已借阅此书', icon: 'none' })
      return false
    }

    // 创建借阅记录
    const borrowRecord: BorrowRecord = {
      id: Date.now().toString(),
      userId: state.value.user.id,
      bookId,
      borrowTime: new Date().toISOString(),
      dueTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后到期
      status: 'borrowed',
      fine: 0,
    }

    // 更新图书库存
    book.availableStock -= 1
    book.borrowCount += 1

    // 添加借阅记录
    state.value.borrowRecords.push(borrowRecord)

    return true
  }

  // 还书
  const returnBook = async (recordId: string): Promise<boolean> => {
    const record = state.value.borrowRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'borrowed')
      return false

    const book = state.value.books.find(b => b.id === record.bookId)
    if (!book)
      return false

    // 计算是否逾期
    const dueDate = new Date(record.dueTime)
    const returnDate = new Date()
    const isOverdue = returnDate > dueDate

    // 计算罚款（每天1元）
    let fine = 0
    if (isOverdue) {
      const overdueDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
      fine = overdueDays * 1
    }

    // 更新借阅记录
    record.status = 'returned'
    record.returnTime = returnDate.toISOString()
    record.fine = fine

    // 更新图书库存
    book.availableStock += 1

    // 如果有罚款，扣除用户积分
    if (fine > 0 && state.value.user) {
      state.value.user.points = Math.max(0, state.value.user.points - fine * 10) // 1元罚款扣10积分
      uni.setStorageSync('library_user', JSON.stringify(state.value.user))
    }

    return true
  }

  // 续借
  const renewBook = async (recordId: string): Promise<boolean> => {
    const record = state.value.borrowRecords.find(r => r.id === recordId)
    if (!record || record.status !== 'borrowed')
      return false

    // 检查是否逾期
    const dueDate = new Date(record.dueTime)
    const now = new Date()
    if (now > dueDate) {
      uni.showToast({ title: '逾期图书不能续借', icon: 'none' })
      return false
    }

    // 延长30天
    const newDueDate = new Date(dueDate.getTime() + 30 * 24 * 60 * 60 * 1000)
    record.dueTime = newDueDate.toISOString()

    return true
  }

  // 收藏相关
  const addFavorite = (bookId: string) => {
    if (!state.value.user)
      return
    if (!state.value.favorites.includes(bookId)) {
      state.value.favorites.push(bookId)
      uni.showToast({ title: '已添加到收藏', icon: 'none' })
    }
  }
  const removeFavorite = (bookId: string) => {
    if (!state.value.user)
      return
    state.value.favorites = state.value.favorites.filter(id => id !== bookId)
    uni.showToast({ title: '已取消收藏', icon: 'none' })
  }
  const isFavorite = (bookId: string) => {
    return state.value.favorites.includes(bookId)
  }
  const getFavoriteBooks = () => {
    return state.value.books.filter(book => state.value.favorites.includes(book.id))
  }

  return {
    state,
    initMockData,
    login,
    register,
    logout,
    borrowBook,
    returnBook,
    renewBook,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteBooks,
  }
}, {
  persist: true,
})
