export interface User {
  id: string
  username: string
  phone: string
  avatar?: string
  role: 'user' | 'admin'
  points: number
  registerTime: string
  status: 'active' | 'banned'
}

export interface Book {
  id: string
  isbn: string
  title: string
  author: string
  publisher: string
  publishDate: string
  categoryId: string
  price: number
  totalStock: number
  availableStock: number
  description: string
  coverUrl: string
  addTime: string
  status: 'available' | 'unavailable'
  borrowCount: number
  rating: number
}

export interface Category {
  id: string
  name: string
  parentId?: string
  description: string
}

export interface BorrowRecord {
  id: string
  userId: string
  bookId: string
  borrowTime: string
  dueTime: string
  returnTime?: string
  status: 'borrowed' | 'returned' | 'overdue'
  fine: number
}

export interface Notification {
  id: string
  title: string
  content: string
  target: 'all' | 'specific'
  sendTime: string
  isRead: boolean
}

export interface AppState {
  user: User | null
  isAuthenticated: boolean
  books: Book[]
  categories: Category[]
  borrowRecords: BorrowRecord[]
  notifications: Notification[]
  favorites: string[]
}
