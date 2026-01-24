'use client'

import { useSuspenseProducts } from '@/hooks/use-products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MetricsDisplay } from '@/components/metrics-display'

export default function ProductsClient() {
  // useSuspenseQuery returns data that's NEVER undefined
  // Suspense boundary will handle loading state if query is pending
  const { data: products, refetch, dataUpdatedAt } = useSuspenseProducts()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Approach 6: TanStack Query Prefetch (No Await)
        </h1>
        <p className="text-muted-foreground mb-4">
          Server-side prefetch with streaming - best of both worlds
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">SSR Prefetch</Badge>
          <Badge variant="outline">Streaming</Badge>
          <Badge variant="outline">TanStack Query Cache</Badge>
          <Badge variant="secondary">Non-Blocking</Badge>
          <Badge variant="secondary">Fast TTFB</Badge>
          <Badge variant="secondary">useSuspenseQuery</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              The most advanced approach - streaming with prefetching
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>
                Server component starts prefetch WITHOUT await (non-blocking)
              </li>
              <li>Page HTML can stream to client immediately (fast TTFB)</li>
              <li>
                Pending queries are dehydrated with <code>shouldDehydrateQuery</code> config
              </li>
              <li>Client receives initial HTML and starts hydrating</li>
              <li>TanStack Query continues/completes the pending query on client</li>
              <li>Loading state may briefly appear if query not finished</li>
              <li>Once complete, data is cached in TanStack Query</li>
              <li>Next.js Data Cache disabled to avoid conflicts</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="tanstack-prefetch-no-await" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Fast TTFB - page doesn't wait for data</li>
                <li>Streaming HTML - shell renders immediately</li>
                <li>Best perceived performance - users see content instantly</li>
                <li>Query starts on server (saves time vs pure client)</li>
                <li>All TanStack Query features available</li>
                <li>Excellent for Core Web Vitals (TTFB, FCP, LCP)</li>
                <li>Graceful progressive enhancement</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>May see brief loading state if query completes slowly</li>
                <li>Query can be cancelled if dehydration config wrong</li>
                <li>More complex setup and debugging than blocking approach</li>
                <li>Requires correct <code>shouldDehydrateQuery</code> configuration</li>
                <li>Slightly more moving parts to understand</li>
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
              <strong>SEO is identical to Approach 5 (blocking)!</strong>
              <div className="mt-2 space-y-2 text-xs">
                <p>
                  Despite streaming, search engine crawlers wait for the full HTML to complete
                  before indexing. They receive the complete rendered content, including all
                  data that streamed in.
                </p>
                <p className="font-semibold">
                  The difference is user experience and TTFB, NOT SEO capability.
                </p>
                <ul className="list-disc list-inside ml-2 mt-1">
                  <li><strong>This approach (streaming):</strong> Fast TTFB, better UX, may show brief loading</li>
                  <li><strong>Approach 5 (blocking):</strong> Slow TTFB, no loading flicker, guaranteed data</li>
                  <li><strong>SEO outcome:</strong> Identical - crawlers get full content either way</li>
                </ul>
                <p className="mt-2 font-semibold">
                  ✅ Recommended: Use this approach for most modern applications!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Critical Configuration</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-3">
              <div className="p-3 bg-card rounded border">
                <strong>Query Client Setup:</strong>
                <pre className="text-xs mt-2 bg-muted p-2 rounded overflow-x-auto">
{`dehydrate: {
  shouldDehydrateQuery: (query) =>
    defaultShouldDehydrateQuery(query) ||
    query.state.status === 'pending',
}`}
                </pre>
                <div className="text-xs mt-2">
                  This ensures pending queries are sent to client and not cancelled
                </div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>⚠️ Without this config:</strong>
                <div className="text-xs mt-1">
                  Pending queries would be cancelled on the server, and the client would
                  refetch from scratch (defeating the purpose)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Performance Benefits</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <div>
                <strong>TTFB (Time to First Byte):</strong> Fastest among SSR approaches -
                doesn't wait for data
              </div>
              <div>
                <strong>FCP (First Contentful Paint):</strong> Fast - shell renders
                immediately
              </div>
              <div>
                <strong>LCP (Largest Contentful Paint):</strong> Good - data loads
                progressively
              </div>
              <div>
                <strong>CLS (Cumulative Layout Shift):</strong> Minimize with skeleton loaders
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
            {`// lib/query-client.ts
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      dehydrate: {
        // CRITICAL: Include pending queries
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  })
}

// app/page.tsx (Server Component)
import { Suspense } from 'react'

export default function Page() {
  const queryClient = getQueryClient()

  // Start prefetch but DON'T await
  queryClient.prefetchQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  // Page renders immediately, streams to client
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductsClient />
      </Suspense>
    </HydrationBoundary>
  )
}

// components/products-client.tsx
'use client'

import { useSuspenseProducts } from '@/hooks/use-products'

export default function ProductsClient() {
  // useSuspenseQuery - data is never undefined
  // Suspense boundary handles loading state
  const { data: products } = useSuspenseProducts()

  return <ProductGrid products={products} />
}

// hooks/use-products.ts
import { useSuspenseQuery } from '@tanstack/react-query'

export function useSuspenseProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
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
              <strong>Most Modern Web Apps:</strong> This should be your default choice for
              SSR with TanStack Query
            </li>
            <li>
              <strong>E-commerce:</strong> Product pages need fast TTFB, SEO, and interactive
              features (cart, wishlist)
            </li>
            <li>
              <strong>Content Sites:</strong> News, blogs where layout should appear instantly,
              content streams in
            </li>
            <li>
              <strong>SaaS Applications:</strong> Dashboards where perceived performance is
              critical
            </li>
            <li>
              <strong>Core Web Vitals Optimization:</strong> Best TTFB and FCP among all SSR
              approaches
            </li>
            <li>
              <strong>When you need:</strong> Full SEO + TanStack Query features + best UX
            </li>
          </ul>
          <div className="mt-3 p-2 bg-card rounded border text-xs">
            <strong>✅ Recommended default:</strong> This approach provides the best balance
            of performance, SEO, and developer experience for most applications.
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
              <strong>vs. Approach 5 (Prefetch with Await):</strong>
              <div className="text-xs mt-1">
                <strong>This approach (streaming):</strong> Faster TTFB, better perceived
                performance, may show brief loading state.
                <br />
                <strong>Approach 5 (blocking):</strong> Slower TTFB, no loading flicker,
                guaranteed complete render.
                <br />
                <strong>SEO:</strong> Identical - both serve complete HTML.
                <br />
                <strong>Choose this</strong> for most cases (better UX), unless you can't
                tolerate any loading state.
              </div>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>vs. Approach 4 (Client-Only):</strong>
              <div className="text-xs mt-1">
                This approach starts fetching on server (faster initial load), has full SEO
                support, and better Core Web Vitals. Use Approach 4 only for authenticated
                pages where SEO doesn't matter.
              </div>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>vs. Approach 3 (Pure SSR):</strong>
              <div className="text-xs mt-1">
                This approach adds TanStack Query features (caching, mutations, optimistic
                updates). More complex but more powerful. Use Approach 3 for simple,
                static content without interactive features.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-muted">
        <CardHeader>
          <CardTitle>Recommended Hybrid Architecture</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-2">
            <p>
              <strong>Best practice for modern apps:</strong> Mix approaches based on page
              requirements
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>
                <strong>This approach (Approach 6):</strong> Default for most pages - SEO +
                interactivity + best UX
              </li>
              <li>
                <strong>Approach 3 (Pure SSR):</strong> Simple static pages, documentation,
                blogs (no TanStack Query needed)
              </li>
              <li>
                <strong>Approach 4 (Client-Only):</strong> Authenticated dashboards, admin
                panels (no SEO needed)
              </li>
              <li>
                <strong>Approach 5 (Blocking):</strong> Only when you absolutely can't show
                loading states
              </li>
            </ul>
            <div className="mt-2 p-2 bg-card rounded border text-xs">
              <strong>Performance tip:</strong> For optimal results, this approach (6) should
              be your go-to for 70-80% of pages in a modern web application.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
