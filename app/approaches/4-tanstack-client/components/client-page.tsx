'use client'

import { Suspense, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MetricsDisplay } from '@/components/metrics-display'
import ProductsDisplay from './products-display'

export default function TanStackClientPageClient() {
  const [delay, setDelay] = useState<number | undefined>(undefined)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approach 4: TanStack Query Client-Side</h1>
        <p className="text-muted-foreground mb-4">
          Client-side data fetching with intelligent caching and state management
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">Client-Side Only</Badge>
          <Badge variant="outline">TanStack Query Cache</Badge>
          <Badge variant="outline">No SSR</Badge>
          <Badge variant="secondary">useSuspenseQuery</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Enhanced client-side fetching with TanStack Query</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Component renders on the client (like Approach 1)</li>
              <li>
                <strong>useSuspenseQuery</strong> hook manages data fetching and caching
              </li>
              <li>Suspense boundary handles loading states automatically</li>
              <li>No manual isLoading checks needed - cleaner code!</li>
              <li>data is never undefined - better TypeScript types</li>
              <li>Automatic background refetching when data becomes stale</li>
              <li>Cache persists between component unmounts</li>
              <li>Built-in retry logic and error handling</li>
              <li>Optimistic updates and mutations support</li>
              <li>staleTime: 5s, gcTime: 10min (configurable)</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="tanstack-client" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Intelligent caching reduces redundant requests</li>
                <li>Automatic background refetching keeps data fresh</li>
                <li>Built-in loading, error, and success states</li>
                <li>Optimistic updates for better UX</li>
                <li>Declarative data fetching</li>
                <li>DevTools for debugging cache</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Still no SEO (client-side only)</li>
                <li>Additional bundle size (~15KB gzipped)</li>
                <li>Learning curve for cache configuration</li>
                <li>Initial load time same as pure SPA</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>useSuspenseQuery Benefits</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-3">
              <div className="p-3 bg-card rounded border">
                <strong>✅ No Loading State Checks</strong>
                <div className="text-xs mt-1">
                  Suspense boundary handles loading automatically. No more{' '}
                  <code>if (isLoading)</code> checks!
                </div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>✅ Better TypeScript Types</strong>
                <div className="text-xs mt-1">
                  <code>data</code> is never undefined. TypeScript knows this, so no null
                  checks needed.
                </div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>✅ Cleaner Component Code</strong>
                <div className="text-xs mt-1">
                  Component focuses on the happy path. Error boundaries handle errors.
                </div>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>Cache Config:</strong>
                <div className="text-xs mt-1">
                  staleTime: 5s, gcTime: 10min, refetchOnMount: true
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Delays</CardTitle>
            <CardDescription>Simulate different network speeds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => setDelay(undefined)} variant={delay === undefined ? "default" : "outline"} size="sm">
                Default (500ms)
              </Button>
              <Button onClick={() => setDelay(0)} variant={delay === 0 ? "default" : "outline"} size="sm">
                Instant
              </Button>
              <Button onClick={() => setDelay(1000)} variant={delay === 1000 ? "default" : "outline"} size="sm">
                Slow (1s)
              </Button>
              <Button onClick={() => setDelay(2000)} variant={delay === 2000 ? "default" : "outline"} size="sm">
                Very Slow (2s)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Suspense
        key={delay}
        fallback={
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
        }
      >
        <ProductsDisplay delay={delay} />
      </Suspense>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`// Page Component
'use client'

import { Suspense } from 'react'
import ProductsDisplay from './products-display'

export default function TanStackClientPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsDisplay />
    </Suspense>
  )
}

// ProductsDisplay Component
'use client'

import { useProducts } from '@/hooks/use-products'

export default function ProductsDisplay() {
  // No isLoading or error! Suspense handles it
  // data is never undefined - TypeScript knows this
  const { data: products } = useProducts()

  return <ProductGrid products={products} />
}

// hooks/use-products.ts
import { useSuspenseQuery } from '@tanstack/react-query'

export function useProducts() {
  return useSuspenseQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
    staleTime: 5 * 1000,      // Fresh for 5s
    gcTime: 10 * 60 * 1000,   // Cache for 10min
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
            <li><strong>Dashboards & Admin Panels:</strong> SEO not required, complex data management needed</li>
            <li><strong>Authenticated Apps:</strong> Content is private, intelligent caching reduces server load</li>
            <li><strong>Real-time Features:</strong> Automatic background refetching keeps data fresh</li>
            <li><strong>Complex State:</strong> Mutations, optimistic updates, and cache invalidation are common</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
