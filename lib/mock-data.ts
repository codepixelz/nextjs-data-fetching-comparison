import { Product, User, Post, Comment } from '@/types'

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    role: 'admin',
    createdAt: new Date('2023-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'user',
    createdAt: new Date('2023-02-20').toISOString(),
  },
  {
    id: '3',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
    role: 'user',
    createdAt: new Date('2023-03-10').toISOString(),
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana',
    role: 'user',
    createdAt: new Date('2023-04-05').toISOString(),
  },
]

// Mock Products
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones with 30-hour battery life',
    price: 199.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    stock: 45,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    stock: 32,
    createdAt: new Date('2024-01-11').toISOString(),
    updatedAt: new Date('2024-01-11').toISOString(),
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe',
    price: 89.99,
    category: 'Home & Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
    stock: 28,
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '4',
    name: 'Running Shoes',
    description: 'Lightweight running shoes with advanced cushioning',
    price: 129.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    stock: 56,
    createdAt: new Date('2024-01-13').toISOString(),
    updatedAt: new Date('2024-01-13').toISOString(),
  },
  {
    id: '5',
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature',
    price: 45.99,
    category: 'Office',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    stock: 67,
    createdAt: new Date('2024-01-14').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
  },
  {
    id: '6',
    name: 'Backpack',
    description: 'Waterproof backpack with laptop compartment',
    price: 79.99,
    category: 'Travel',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    stock: 41,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '7',
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with carrying strap',
    price: 34.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    stock: 73,
    createdAt: new Date('2024-01-16').toISOString(),
    updatedAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: '8',
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker',
    price: 59.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
    stock: 38,
    createdAt: new Date('2024-01-17').toISOString(),
    updatedAt: new Date('2024-01-17').toISOString(),
  },
  {
    id: '9',
    name: 'Water Bottle',
    description: 'Insulated stainless steel water bottle',
    price: 24.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    stock: 92,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: '10',
    name: 'Notebook Set',
    description: 'Set of 3 premium notebooks with dotted pages',
    price: 19.99,
    category: 'Office',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
    stock: 105,
    createdAt: new Date('2024-01-19').toISOString(),
    updatedAt: new Date('2024-01-19').toISOString(),
  },
]

// Mock Posts
export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Understanding Next.js Data Fetching',
    content: 'Next.js provides multiple ways to fetch data. In this comprehensive guide, we explore the different patterns available including server components, client components, and hybrid approaches. Each pattern has its own use cases and trade-offs that developers should understand.',
    excerpt: 'A comprehensive guide to data fetching patterns in Next.js',
    authorId: '1',
    published: true,
    views: 1247,
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: '2',
    title: 'TanStack Query Best Practices',
    content: 'TanStack Query (formerly React Query) is a powerful data synchronization library. This article covers best practices including query key management, cache configuration, optimistic updates, and integrating with Next.js server components.',
    excerpt: 'Learn the best practices for using TanStack Query effectively',
    authorId: '2',
    published: true,
    views: 892,
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '3',
    title: 'Server-Side Rendering vs Client-Side Rendering',
    content: 'The choice between SSR and CSR affects SEO, performance, and user experience. This article provides a detailed comparison with real-world examples to help you make informed architectural decisions for your applications.',
    excerpt: 'Comparing different rendering strategies for modern web apps',
    authorId: '1',
    published: true,
    views: 2103,
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '4',
    title: 'React 19 New Features Overview',
    content: 'React 19 introduces several exciting features including the use hook, improved server components, and enhanced concurrent rendering. This guide walks through each new feature with practical examples.',
    excerpt: 'Exploring the new features introduced in React 19',
    authorId: '3',
    published: true,
    views: 1567,
    createdAt: new Date('2024-01-18').toISOString(),
    updatedAt: new Date('2024-01-18').toISOString(),
  },
  {
    id: '5',
    title: 'Optimizing Web Performance',
    content: 'Performance optimization is crucial for user experience and SEO. This article covers various techniques including code splitting, lazy loading, caching strategies, and measuring Core Web Vitals.',
    excerpt: 'Techniques for improving web application performance',
    authorId: '4',
    published: true,
    views: 1834,
    createdAt: new Date('2024-01-20').toISOString(),
    updatedAt: new Date('2024-01-20').toISOString(),
  },
]

// Mock Comments
export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    postId: '1',
    content: 'Great article! Very informative.',
    authorId: '2',
    createdAt: new Date('2024-01-11').toISOString(),
  },
  {
    id: '2',
    postId: '1',
    content: 'This helped me understand the different patterns better.',
    authorId: '3',
    createdAt: new Date('2024-01-11').toISOString(),
  },
  {
    id: '3',
    postId: '2',
    content: 'The optimistic updates section was particularly useful!',
    authorId: '1',
    createdAt: new Date('2024-01-13').toISOString(),
  },
  {
    id: '4',
    postId: '3',
    content: 'Would love to see more examples of hybrid approaches.',
    authorId: '4',
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: '5',
    postId: '3',
    content: 'The SSR examples were very clear and practical.',
    authorId: '2',
    createdAt: new Date('2024-01-17').toISOString(),
  },
]

// Helper function to add user details to posts
export function enrichPostsWithAuthors(posts: Post[]): Post[] {
  return posts.map(post => ({
    ...post,
    author: MOCK_USERS.find(user => user.id === post.authorId),
  }))
}

// Helper function to add user details to comments
export function enrichCommentsWithAuthors(comments: Comment[]): Comment[] {
  return comments.map(comment => ({
    ...comment,
    author: MOCK_USERS.find(user => user.id === comment.authorId),
  }))
}
