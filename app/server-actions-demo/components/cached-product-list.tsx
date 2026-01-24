import { Product, ApiResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CACHE_TAGS } from '@/lib/cache-config'

/**
 * Fetch products with cache tags
 *
 * This demonstrates how to use Next.js Data Cache with tags
 */
async function fetchProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/products`, {
    next: {
      tags: [CACHE_TAGS.PRODUCTS], // Tag this cache for revalidation
      revalidate: 3600, // Optional: auto-revalidate after 1 hour
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data: ApiResponse<Product[]> = await response.json()
  return data.data
}

/**
 * Cached Product List (Server Component)
 *
 * This component fetches data with Next.js Data Cache and tags.
 * When revalidateTag('products') is called, this data is invalidated.
 */
export default async function CachedProductList() {
  const products = await fetchProducts()
  const timestamp = new Date().toLocaleTimeString()

  return (
    <div className="space-y-4">
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>Cache Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="space-y-1">
            <div>
              <strong>Cache Tag:</strong> <code className="bg-card px-1 py-0.5 rounded">products</code>
            </div>
            <div>
              <strong>Revalidate:</strong> 3600 seconds (1 hour)
            </div>
            <div>
              <strong>Server render time:</strong> {timestamp}
            </div>
            <div className="mt-2 text-xs">
              This data is cached on the server. When you add a product or manually revalidate
              the 'products' tag, this component will re-fetch fresh data on the next request.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 6).map(product => (
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

      <Card className="border">
        <CardHeader>
          <CardTitle className="text-sm">How This Works</CardTitle>
        </CardHeader>
        <CardContent className="text-xs space-y-2">
          <div className="p-2 bg-muted rounded">
            <strong>1. Initial Request:</strong>
            <div className="ml-2 mt-1">Server fetches data, caches it with 'products' tag, renders component</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <strong>2. Subsequent Requests:</strong>
            <div className="ml-2 mt-1">Server serves cached data (no API call), fast response</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <strong>3. After revalidateTag('products'):</strong>
            <div className="ml-2 mt-1">Cache is invalidated, next request fetches fresh data</div>
          </div>
          <div className="p-2 bg-muted rounded border">
            <strong>Important:</strong>
            <div className="ml-2 mt-1">
              Notice the timestamp doesn't change on client-side navigation. It only updates
              when the server re-renders (after cache revalidation or expiry).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
