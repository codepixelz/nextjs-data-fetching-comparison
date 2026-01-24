export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string
  stock: number
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
}

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  authorId: string
  author?: User
  published: boolean
  views: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: string
  postId: string
  content: string
  authorId: string
  author?: User
  createdAt: string
}

export interface ApiResponse<T> {
  data: T
  meta: {
    total?: number
    fetchTime?: number
    cachedAt?: string
    requestId?: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  meta: {
    fetchTime: number
    requestId: string
  }
}

export interface ApiError {
  error: string
  message: string
  statusCode: number
  requestId?: string
}
