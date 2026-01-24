'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { User, ApiResponse } from '@/types'
import { CACHE_CONFIG } from '@/lib/cache-config'

/**
 * Fetch all users
 */
async function fetchUsers(delay?: number): Promise<User[]> {
  const url = delay ? `/api/users?delay=${delay}` : '/api/users'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch users')
  }

  const data: ApiResponse<User[]> = await response.json()
  return data.data
}

/**
 * Fetch a single user by ID
 */
async function fetchUser(id: string, delay?: number): Promise<User> {
  const url = delay ? `/api/users/${id}?delay=${delay}` : `/api/users/${id}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch user ${id}`)
  }

  const data: ApiResponse<User> = await response.json()
  return data.data
}

/**
 * Hook to fetch all users using Suspense
 */
export function useUsers(delay?: number) {
  return useSuspenseQuery({
    queryKey: ['users', delay],
    queryFn: () => fetchUsers(delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}

/**
 * Hook to fetch a single user using Suspense
 */
export function useUser(id: string, delay?: number) {
  return useSuspenseQuery({
    queryKey: ['users', id, delay],
    queryFn: () => fetchUser(id, delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}
