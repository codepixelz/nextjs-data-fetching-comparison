'use client'

import { useProducts } from '@/hooks/use-products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MetricsDisplay } from '@/components/metrics-display'

export default function ProductsClient() {
  // useSuspenseQuery returns data that's NEVER undefined
  // No isLoading or error - those are handled by Suspense and Error Boundaries
  const { data: products, refetch, dataUpdatedAt } = useProducts()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approach 5: TanStack Query Prefetch (Await)</h1>
        <p className="text-muted-foreground mb-4">
          Server-side prefetching with blocking await - SEO-friendly with TanStack Query cache
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">SSR Prefetch</Badge>
          <Badge variant="outline">SEO-Friendly</Badge>
          <Badge variant="outline">TanStack Query Cache</Badge>
          <Badge variant="secondary">Blocking Await</Badge>
          <Badge variant="secondary">useSuspenseQuery</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Server prefetching with blocking for SEO</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Server component prefetches data using <code>await queryClient.prefetchQuery()</code></li>
              <li>Page WAITS for data to be fetched (blocking)</li>
              <li>Query state is dehydrated and sent to client in HTML</li>
              <li>Client rehydrates the TanStack Query cache</li>
              <li>Client component uses the same query key to access cached data</li>
              <li>No loading state on initial render (data already available)</li>
              <li>Next.js Data Cache disabled with <code>cache: 'no-store'</code></li>
              <li>TanStack Query manages all caching logic</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="tanstack-prefetch-await" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Guaranteed data in initial render - no loading state flicker</li>
                <li>Simpler mental model - data ready when page renders</li>
                <li>TanStack Query features available (refetch, mutations, etc.)</li>
                <li>Centralized cache management (single source of truth)</li>
                <li>Works with TanStack Query DevTools</li>
                <li>Optimistic updates and intelligent refetching</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Blocks page render until data is fetched (slower TTFB)</li>
                <li>No streaming - entire page waits for data</li>
                <li>Worse perceived performance (blank screen while waiting)</li>
                <li>Increases server load (every request fetches data)</li>
                <li>More complex setup than pure SSR</li>
                <li>Larger bundle size (~15KB for TanStack Query)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>🔍 SEO Clarification</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="p-3 bg-card rounded border">
              <strong>Important: SEO is the same as Approach 6 (streaming)!</strong>
              <div className="mt-2 space-y-2 text-xs">
                <p>
                  Modern search engines (Google, Bing) wait for the full HTML to load before
                  indexing. Whether you block (await) or stream (Suspense), crawlers get the
                  complete content either way.
                </p>
                <p className="font-semibold">
                  The real difference is TTFB and user experience, NOT SEO.
                </p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li><strong>This approach (await):</strong> Slower TTFB, no loading flicker</li>
                  <li><strong>Approach 6 (streaming):</strong> Faster TTFB, better perceived performance</li>
                  <li><strong>SEO outcome:</strong> Identical - both serve full HTML</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Cache Strategy</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-3">
              <div className="p-3 bg-card rounded border">
                <strong>Next.js Data Cache:</strong> DISABLED
                <div className="text-xs mt-1">Using <code>cache: 'no-store'</code> to prevent conflicts</div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>TanStack Query Cache:</strong> ACTIVE
                <div className="text-xs mt-1">
                  staleTime: 60s, gcTime: 5min - Query manages all caching
                </div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>⚠️ Why disable Next.js cache?</strong>
                <div className="text-xs mt-1">
                  Mixing both caches causes stale data issues. When using TanStack Query,
                  let it manage the cache entirely for predictable behavior.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cache Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Last updated:</strong>{' '}
                {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
              </div>
              <div>
                <strong>Initial render:</strong> No loading state (data prefetched on server)
              </div>
              <Button onClick={() => refetch()} size="sm" className="mt-2">
                Refetch Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <CardDescription>{product.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">${product.price}</span>
                <Badge variant={product.stock > 50 ? 'default' : 'secondary'}>
                  {product.stock} in stock
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`// app/page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/query-client'

export default async function Page() {
  const queryClient = getQueryClient()

  // Prefetch and AWAIT (blocks rendering)
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

// components/products-client.tsx (Client Component)
'use client'

import { useProducts } from '@/hooks/use-products'

export default function ProductsClient() {
  // useSuspenseQuery returns data that's NEVER undefined
  // No isLoading or error - data is guaranteed to be ready
  const { data: products } = useProducts()

  // Can directly use products - no null checks needed!
  return <ProductGrid products={products} />
}

// hooks/use-products.ts
import { useSuspenseQuery } from '@tanstack/react-query'

export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 60 * 1000,      // Fresh for 60s
    gcTime: 5 * 60 * 1000,     // Cache for 5min
  })
}`}
          </pre>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-muted">
        <CardHeader>
          <CardTitle>When to Use This Approach</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Critical above-the-fold content:</strong> When data MUST be visible on
              first paint (no loading flicker tolerated)
            </li>
            <li>
              <strong>Very fast APIs (&lt;100ms):</strong> Blocking penalty is minimal, simpler
              to reason about
            </li>
            <li>
              <strong>Simple server-rendered apps:</strong> Need TanStack Query features but
              prefer simpler mental model
            </li>
            <li>
              <strong>Marketing landing pages:</strong> No loading states desired, data loads
              quickly anyway
            </li>
            <li>
              <strong>When TTFB isn't critical:</strong> Content over speed, guaranteed complete
              render
            </li>
          </ul>
          <div className="mt-3 p-2 bg-card rounded border text-xs">
            <strong>Note:</strong> For most modern apps, Approach 6 (streaming) is preferred
            for better TTFB and perceived performance with identical SEO outcome.
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-muted">
        <CardHeader>
          <CardTitle>Comparison with Other Approaches</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-3">
            <div className="p-3 bg-card rounded">
              <strong>vs. Approach 3 (Pure SSR):</strong>
              <div className="text-xs mt-1">
                Use Approach 3 when you don't need TanStack Query features. Simpler, lighter
                bundle, same blocking behavior.
              </div>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>vs. Approach 6 (Streaming):</strong>
              <div className="text-xs mt-1">
                <strong>This approach:</strong> Guaranteed no loading flicker, slower TTFB, simpler code.
                <br />
                <strong>Approach 6:</strong> Faster TTFB, better UX, may show brief loading state.
                <br />
                <strong>SEO:</strong> Identical - both serve complete HTML to crawlers.
              </div>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>Best Practice:</strong>
              <div className="text-xs mt-1">
                Choose Approach 6 (streaming) for most cases. Use this approach only when you
                can't tolerate any loading state and TTFB isn't a concern.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
