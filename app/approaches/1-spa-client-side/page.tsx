'use client'

import { useState, useEffect } from 'react'
import { Product, ApiResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MetricsDisplay } from '@/components/metrics-display'
import { measurePageLoad, recordMetric } from '@/lib/performance'

/**
 * Approach 1: Pure SPA (Client-Side Only)
 *
 * Traditional React SPA pattern with useEffect for data fetching
 *
 * Characteristics:
 * - All data fetched in browser
 * - No server-side rendering
 * - No SEO benefits
 * - Loading states managed client-side
 * - Only browser cache used
 */
export default function SPAClientSidePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const finishMeasure = measurePageLoad('spa-client')
    const startTime = performance.now()

    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products')
        return res.json()
      })
      .then((data: ApiResponse<Product[]>) => {
        setProducts(data.data)
        const loadTime = performance.now() - startTime
        recordMetric('spa-client', 'LOAD_TIME', loadTime)
        finishMeasure()
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Approach 1: Pure SPA (Client-Side)</h1>
        <p className="text-muted-foreground mb-4">
          Traditional React SPA with useEffect - all data fetched in the browser
        </p>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline">No SSR</Badge>
          <Badge variant="outline">No SEO</Badge>
          <Badge variant="outline">Browser Cache Only</Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>Traditional client-side data fetching pattern</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Component renders on the client with empty state</li>
              <li>useEffect hook triggers fetch request after mount</li>
              <li>Loading state displays skeleton UI</li>
              <li>Data updates state when response arrives</li>
              <li>No server-side rendering or prefetching</li>
              <li>Page is fully client-rendered (bad for SEO)</li>
            </ul>
          </CardContent>
        </Card>

        <MetricsDisplay approach="spa-client" className="mb-6" />

        <Card className="mb-6 bg-muted">
          <CardHeader>
            <CardTitle>Trade-offs</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Pros:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>Simple and familiar pattern</li>
                <li>Full client-side control</li>
                <li>Easy to implement</li>
              </ul>
            </div>
            <div>
              <strong>Cons:</strong>
              <ul className="list-disc list-inside ml-4">
                <li>No SEO - content not in initial HTML</li>
                <li>Slower initial page load (waterfall requests)</li>
                <li>Visible loading states</li>
                <li>No server cache benefits</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading && (
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
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
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
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Code Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
            {`'use client'

import { useState, useEffect } from 'react'

export default function SPAClientSidePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSkeleton />
  return <ProductGrid products={products} />
}`}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
