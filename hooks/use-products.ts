'use client'

import { useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Product, ApiResponse } from '@/types'
import { CACHE_CONFIG } from '@/lib/cache-config'

/**
 * Fetch all products
 */
async function fetchProducts(delay?: number): Promise<Product[]> {
  const url = delay ? `/api/products?delay=${delay}` : '/api/products'
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data: ApiResponse<Product[]> = await response.json()
  return data.data
}

/**
 * Fetch a single product by ID
 */
async function fetchProduct(id: string, delay?: number): Promise<Product> {
  const url = delay ? `/api/products/${id}?delay=${delay}` : `/api/products/${id}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${id}`)
  }

  const data: ApiResponse<Product> = await response.json()
  return data.data
}

/**
 * Update a product
 */
async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    throw new Error(`Failed to update product ${id}`)
  }

  const data: ApiResponse<Product> = await response.json()
  return data.data
}

/**
 * Hook to fetch all products using Suspense
 *
 * Benefits of useSuspenseQuery over useQuery:
 * - No need to handle loading states manually (Suspense handles it)
 * - data is never undefined (better TypeScript types)
 * - More declarative - Suspense boundary shows loading intent
 * - Simpler component code - no if (isLoading) checks
 */
export function useSuspenseProducts(delay?: number) {
  return useSuspenseQuery({
    queryKey: ['products', delay],
    queryFn: () => fetchProducts(delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}

/**
 * Hook to fetch a single product using Suspense
 */
export function useSuspenseProduct(id: string, delay?: number) {
  return useSuspenseQuery({
    queryKey: ['products', id, delay],
    queryFn: () => fetchProduct(id, delay),
    ...CACHE_CONFIG.tanstack.client,
  })
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      updateProduct(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] })
      // Update the specific product in cache
      queryClient.setQueryData(['products', variables.id], data)
    },
  })
}
