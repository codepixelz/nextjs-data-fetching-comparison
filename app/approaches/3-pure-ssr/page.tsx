import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { MetricsDisplay } from '@/components/metrics-display'
import { ProductList } from './components/product-list'
import { UserProfile } from './components/user-profile'

// Mark as dynamic to prevent static generation during build
export const dynamic = 'force-dynamic'

/**
 * Approach 3: Pure SSR with Suspense
 *
 * Full server-side rendering with React Suspense for streaming
 *
 * Characteristics:
 * - All data fetched on server
 * - Streaming SSR with Suspense boundaries
 * - Excellent SEO
 * - Uses Next.js Data Cache
 * - No client-side data fetching
 */
export default function PureSSRPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approach 3: Pure SSR with Suspense</h1>
        <p className="text-muted-foreground mb-4">
          Full server-side rendering with streaming and Suspense boundaries
        </p>

        <div className="flex gap-2 mb-4">
          <Badge>Full SSR</Badge>
          <Badge>Streaming</Badge>
          <Badge>SEO Optimized</Badge>
          <Badge variant="outline">Next.js Cache</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Server-rendered with progressive streaming</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>All components are async server components</li>
              <li>Data fetched on server with Next.js fetch cache</li>
              <li>Suspense boundaries allow streaming HTML</li>
              <li>Fallback UI streams immediately</li>
              <li>Content streams as data becomes available</li>
              <li>Fully rendered HTML sent to browser (perfect for SEO)</li>
              <li>Uses revalidateTag for cache invalidation</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="pure-ssr" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Excellent SEO - all content in initial HTML</li>
                <li>Fast First Contentful Paint with streaming</li>
                <li>Server-side caching with revalidation</li>
                <li>No client-side JS for data fetching</li>
                <li>Progressive rendering improves perceived performance</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Limited client-side interactivity</li>
                <li>Server dependency for all data</li>
                <li>Cache invalidation can be complex</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {/* Product List with Suspense */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Product List (Streaming)</h2>
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList />
          </Suspense>
        </div>

        {/* User Profile with Suspense */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">User Profile (Streaming)</h2>
          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile userId="1" />
          </Suspense>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`// Server Component (page.tsx)
import { Suspense } from 'react'

export default function PureSSRPage() {
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <ProductList />
    </Suspense>
  )
}

// Async Server Component (product-list.tsx)
async function ProductList() {
  // Fetched on server with caching
  const response = await fetch('http://localhost:3000/api/products', {
    next: {
      revalidate: 60,  // Revalidate every 60 seconds
      tags: ['products']  // Tag for cache invalidation
    }
  })

  const data = await response.json()
  return <ProductGrid products={data.data} />
}

// Server Action for cache invalidation
'use server'
import { revalidateTag } from 'next/cache'

export async function refreshProducts() {
  revalidateTag('products')  // Invalidate products cache
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}

function ProductListSkeleton() {
  return (
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
  )
}

function UserProfileSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-4 w-1/4" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
