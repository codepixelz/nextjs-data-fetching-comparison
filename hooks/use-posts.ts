'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Post, Comment, PaginatedResponse, ApiResponse } from '@/types'
import { CACHE_CONFIG } from '@/lib/cache-config'

/**
 * Fetch paginated posts
 */
async function fetchPosts(page: number = 1, limit: number = 10, delay?: number): Promise<PaginatedResponse<Post>> {
  let url = `/api/posts?page=${page}&limit=${limit}`
  if (delay) url += `&delay=${delay}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

/**
 * Fetch a single post by ID
 */
async function fetchPost(id: string, delay?: number): Promise<Post> {
  const url = delay ? `/api/posts/${id}?delay=${delay}` : `/api/posts/${id}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch post ${id}`)
  }

  const data: ApiResponse<Post> = await response.json()
  return data.data
}

/**
 * Fetch comments for a post
 */
async function fetchPostComments(postId: string, delay?: number): Promise<Comment[]> {
  const url = delay ? `/api/posts/${postId}/comments?delay=${delay}` : `/api/posts/${postId}/comments`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch comments for post ${postId}`)
  }

  const data: ApiResponse<Comment[]> = await response.json()
  return data.data
}

/**
 * Hook to fetch paginated posts using Suspense
 */
export function usePosts(page: number = 1, limit: number = 10, delay?: number) {
  return useSuspenseQuery({
    queryKey: ['posts', page, limit, delay],
    queryFn: () => fetchPosts(page, limit, delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}

/**
 * Hook to fetch a single post using Suspense
 */
export function usePost(id: string, delay?: number) {
  return useSuspenseQuery({
    queryKey: ['posts', id, delay],
    queryFn: () => fetchPost(id, delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}

/**
 * Hook to fetch post comments using Suspense
 */
export function usePostComments(postId: string, delay?: number) {
  return useSuspenseQuery({
    queryKey: ['posts', postId, 'comments', delay],
    queryFn: () => fetchPostComments(postId, delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}
