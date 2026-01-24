import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'

import { getQueryClient } from '@/lib/query-client'
import { Product, ApiResponse } from '@/types'
import { CACHE_CONFIG } from '@/lib/cache-config'
import ProductsClient from './components/products-client'

/**
 * Approach 5: TanStack Query Prefetch with Await
 *
 * Server-side prefetching with TanStack Query - BLOCKING approach
 *
 * Characteristics:
 * - Data is prefetched on the server using await
 * - Page waits for data before sending HTML (no streaming)
 * - SEO-friendly (data in initial HTML)
 * - Hydrated on client for interactivity
 * - TanStack Query manages cache on client
 * - Next.js Data Cache disabled (cache: 'no-store')
 */

async function fetchProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/products`, {
    ...CACHE_CONFIG.nextjs.tanstack, // Disable Next.js cache
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data: ApiResponse<Product[]> = await response.json()
  return data.data
}

export default async function TanStackPrefetchAwaitPage() {
  const queryClient = getQueryClient()

  // Prefetch and AWAIT - this blocks the page from rendering
  await queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsClient />
    </HydrationBoundary>
  )
}
