import { Product } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Server Component - Renders product list
 *
 * This component runs only on the server and sends HTML to the client
 */
export function ServerProducts({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.slice(0, 6).map(product => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.category}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-xs">SSR</Badge>
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
  )
}
