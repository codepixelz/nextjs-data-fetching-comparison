import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

import { Badge } from '@/components/ui/badge'
import AddProductForm from './components/add-product-form'
import RevalidateControls from './components/revalidate-controls'
import CachedProductList from './components/cached-product-list'

/**
 * Server Actions & Cache Revalidation Demo
 *
 * This page demonstrates:
 * 1. Server Actions for mutations
 * 2. revalidateTag for granular cache invalidation
 * 3. revalidatePath for path-based invalidation
 * 4. How cache invalidation relates to Next.js Data Cache
 * 5. When to use tags vs paths
 */

export default function ServerActionsDemoPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Server Actions & Cache Revalidation</h1>
        <p className="text-muted-foreground mb-4">
          Understanding server actions, revalidateTag, and revalidatePath for Next.js cache
          management
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">Server Actions</Badge>
          <Badge variant="outline">revalidateTag</Badge>
          <Badge variant="outline">revalidatePath</Badge>
          <Badge variant="secondary">Next.js Cache</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What are Server Actions?</CardTitle>
            <CardDescription>
              Server-side functions that can be called from client components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              Server Actions are asynchronous functions that run on the server and can be
              called from client components. They enable:
            </div>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Form submissions without API routes</li>
              <li>Data mutations on the server</li>
              <li>Cache revalidation after mutations</li>
              <li>Progressive enhancement (work without JS)</li>
              <li>Type-safe server-client communication</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Cache Revalidation Strategies</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-card rounded border">
                <strong>revalidateTag(tag)</strong>
                <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                  <li>Invalidates all caches with a specific tag</li>
                  <li>Granular control over what to revalidate</li>
                  <li>Best for related data across multiple routes</li>
                  <li>Example: <code>revalidateTag('products')</code></li>
                </ul>
              </div>
              <div className="p-3 bg-card rounded border">
                <strong>revalidatePath(path)</strong>
                <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                  <li>Invalidates cache for a specific path</li>
                  <li>Simpler for single-route revalidation</li>
                  <li>Can use patterns like <code>/products/[id]</code></li>
                  <li>Example: <code>revalidatePath('/products')</code></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Next.js Data Cache Relationship</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="space-y-2">
              <p>
                <strong>Important:</strong> revalidateTag and revalidatePath work with Next.js
                Data Cache (fetch with cache tags/revalidate options).
              </p>
              <div className="p-3 bg-card rounded border text-xs">
                <strong>How it works:</strong>
                <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
                  <li>Fetch data with <code>{`fetch(url, { next: { tags: ['products'] } })`}</code></li>
                  <li>Next.js caches the response with the 'products' tag</li>
                  <li>Call <code>revalidateTag('products')</code> in a server action</li>
                  <li>All caches with 'products' tag are invalidated</li>
                  <li>Next fetch request gets fresh data from the origin</li>
                </ol>
              </div>
              <div className="p-3 bg-muted rounded border text-xs mt-2">
                <strong>⚠️ With TanStack Query:</strong>
                <p className="mt-1">
                  revalidateTag/Path DON'T affect TanStack Query cache! TanStack Query has
                  its own cache management (queryClient.invalidateQueries). If using TanStack
                  Query, disable Next.js cache with <code>cache: 'no-store'</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Demo */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Add Product (Server Action)</h2>
          <AddProductForm />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Manual Revalidation</h2>
          <RevalidateControls />
        </div>
      </div>

      {/* Cached Data Display */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Cached Products (SSR with Tags)</h2>
        <CachedProductList />
      </div>

      {/* Code Examples */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Code Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 text-sm">1. Server Action with revalidateTag</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`'use server'

import { revalidateTag } from 'next/cache'

export async function addProduct(formData: FormData) {
  const name = formData.get('name')

  // Save to database
  await db.products.create({ name })

  // Invalidate all caches tagged 'products'
  revalidateTag('products')

  return { success: true }
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">2. Fetching with Cache Tags</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`// Server Component
async function ProductList() {
  const res = await fetch('/api/products', {
    next: {
      tags: ['products'],  // Tag this cache
      revalidate: 3600,    // Optional: revalidate after 1 hour
    }
  })

  const products = await res.json()
  return <div>{products.map(...)}</div>
}`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm">3. Using in Client Component</h3>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
{`'use client'

import { addProduct } from './actions'

export default function Form() {
  return (
    <form action={addProduct}>
      <input name="name" />
      <button type="submit">Add</button>
    </form>
  )
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="mb-6 bg-muted">
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Use revalidateTag for related data:</strong> When one mutation affects
              multiple routes (e.g., adding a product affects list, categories, search)
            </li>
            <li>
              <strong>Use revalidatePath for single routes:</strong> When mutation only
              affects one specific page
            </li>
            <li>
              <strong>Tag granularity:</strong> Use specific tags like 'product-123' for
              individual items, 'products' for lists
            </li>
            <li>
              <strong>Combine strategies:</strong> You can call both revalidateTag AND
              revalidatePath in one action
            </li>
            <li>
              <strong>Don't mix with TanStack Query:</strong> If using TanStack Query for
              caching, disable Next.js cache
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* When to Use What */}
      <Card className="mb-6 bg-muted">
        <CardHeader>
          <CardTitle>Decision Tree: When to Use What</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-3">
            <div className="p-3 bg-card rounded">
              <strong>Use Next.js Cache (revalidateTag/Path) when:</strong>
              <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                <li>Pure SSR approach (no client-side state management)</li>
                <li>Simple apps with minimal interactivity</li>
                <li>SEO-critical pages with static-ish data</li>
                <li>You want server-side cache for performance</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded">
              <strong>Use TanStack Query (queryClient.invalidateQueries) when:</strong>
              <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                <li>Client-heavy apps with lots of interactivity</li>
                <li>Optimistic updates and mutations</li>
                <li>Real-time data with background refetching</li>
                <li>Complex cache dependencies and invalidation logic</li>
              </ul>
            </div>
            <div className="p-3 bg-muted rounded border">
              <strong>⚠️ DON'T mix both for the same data:</strong>
              <div className="text-xs mt-1">
                Choose one cache layer per data type. Mixing causes confusion and stale data
                issues.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
