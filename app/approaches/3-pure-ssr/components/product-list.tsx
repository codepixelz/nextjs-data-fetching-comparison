import { Product, ApiResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Async Server Component - Product List
 *
 * Fetches data on the server with Next.js caching
 */
export async function ProductList() {
  // Server-side fetch with Next.js Data Cache
  const response = await fetch('http://localhost:3000/api/products', {
    next: {
      revalidate: 60, // Revalidate every 60 seconds
      tags: ['products'], // Cache tag for granular invalidation
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data: ApiResponse<Product[]> = await response.json()
  const products = data.data

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="secondary">Cached with revalidate: 60s</Badge>
        <Badge variant="outline">Tag: products</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map(product => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.category}</CardDescription>
                </div>
                <Badge className="text-xs">SSR</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {product.description}
              </p>
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
    </div>
  )
}
