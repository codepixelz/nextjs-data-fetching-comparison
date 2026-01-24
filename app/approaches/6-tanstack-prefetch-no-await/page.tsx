import { Suspense } from 'react'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const dynamic = 'force-dynamic'

import { getQueryClient } from '@/lib/query-client'
import { Product, ApiResponse } from '@/types'
import { CACHE_CONFIG } from '@/lib/cache-config'
import ProductsClient from './components/products-client'

/**
 * Approach 6: TanStack Query Prefetch WITHOUT Await
 *
 * Server-side prefetching with TanStack Query - STREAMING approach
 *
 * Characteristics:
 * - Data prefetch starts on server but doesn't block rendering
 * - Page can stream to client before data arrives
 * - SEO-friendly for static content, loading state for data
 * - Pending queries are dehydrated and resolved on client
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

export default function TanStackPrefetchNoAwaitPage() {
  const queryClient = getQueryClient()

  // Start prefetch but DON'T await - allows streaming!
  // The query will be in "pending" state and resolved on the client
  queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Page renders immediately, pending queries are dehydrated
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsClientSkeleton />}>
        <ProductsClient />
      </Suspense>
    </HydrationBoundary>
  )
}

function ProductsClientSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
