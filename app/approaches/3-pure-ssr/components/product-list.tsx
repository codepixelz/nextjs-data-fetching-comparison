import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_PRODUCTS } from '@/lib/mock-data'

/**
 * Async Server Component - Product List
 *
 * Uses direct data import to avoid localhost fetch issues during SSR.
 * In production, you would use a database query or external API.
 */
export async function ProductList() {
  // Simulate server-side data access
  // In production, this would be a database query or external API call
  const products = MOCK_PRODUCTS

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
