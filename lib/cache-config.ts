/**
 * Cache Configuration Constants
 *
 * This file defines cache strategies for different data fetching approaches.
 *
 * CRITICAL PRINCIPLE: When using TanStack Query with Next.js SSR,
 * let TanStack Query manage the cache. Disable Next.js Data Cache to prevent conflicts.
 */

export const CACHE_CONFIG = {
  // Next.js cache configurations
  nextjs: {
    // For pure SSR approaches WITHOUT TanStack Query
    ssr: {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['products', 'users', 'posts'], // Cache tags for granular invalidation
    },

    // For approaches using TanStack Query - disable Next.js cache
    tanstack: {
      cache: 'no-store' as const, // Disable Next.js Data Cache
      // Alternative: use revalidate: 0
    },

    // For hybrid approaches - no cache for demo purposes
    hybrid: {
      cache: 'no-store' as const,
    },
  },

  // TanStack Query cache configurations
  tanstack: {
    // Client-only approach (Approach 4)
    client: {
      staleTime: 5 * 1000, // 5 seconds - data is fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache retention
      refetchOnWindowFocus: false, // Don't refetch on window focus for demo
      refetchOnMount: true, // Refetch on component mount
      refetchOnReconnect: true, // Refetch when reconnecting
    },

    // Prefetch approaches (Approaches 5 & 6)
    prefetch: {
      staleTime: 60 * 1000, // 1 minute - longer fresh time for SSR
      gcTime: 5 * 60 * 1000, // 5 minutes - cache retention
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Don't refetch on mount (already prefetched)
    },
  },
} as const

// API delay configurations for simulation
export const API_DELAYS = {
  products: {
    list: 500, // 500ms for product list
    detail: 300, // 300ms for individual product
  },
  users: {
    list: 50, // 50ms for user list (fast)
    detail: 200, // 200ms for individual user
  },
  posts: {
    list: 400, // 400ms for post list
    detail: 250, // 250ms for individual post
    comments: 150, // 150ms for comments
  },
} as const

// Cache tag constants
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
} as const

// Approach-specific configurations
export const APPROACH_CONFIG = {
  'spa-client': {
    name: 'Pure SPA (Client-Side)',
    description: 'Traditional React SPA with useEffect',
    cacheStrategy: 'Browser cache only',
    usesNextjsCache: false,
    usesTanstackCache: false,
  },
  'hybrid-ssr-client': {
    name: 'Hybrid SSR + Client',
    description: 'Server components + client interactivity',
    cacheStrategy: 'No cache (demo)',
    usesNextjsCache: false,
    usesTanstackCache: false,
  },
  'pure-ssr': {
    name: 'Pure SSR with Suspense',
    description: 'Full server rendering with streaming',
    cacheStrategy: 'Next.js Data Cache',
    usesNextjsCache: true,
    usesTanstackCache: false,
  },
  'tanstack-client': {
    name: 'TanStack Query Client',
    description: 'Client-side TanStack Query',
    cacheStrategy: 'TanStack Query cache only',
    usesNextjsCache: false,
    usesTanstackCache: true,
  },
  'tanstack-prefetch-await': {
    name: 'TanStack Prefetch (Await)',
    description: 'Server prefetch with blocking',
    cacheStrategy: 'TanStack Query cache only',
    usesNextjsCache: false,
    usesTanstackCache: true,
  },
  'tanstack-prefetch-no-await': {
    name: 'TanStack Prefetch (Streaming)',
    description: 'Server prefetch without blocking',
    cacheStrategy: 'TanStack Query cache only',
    usesNextjsCache: false,
    usesTanstackCache: true,
  },
} as const
