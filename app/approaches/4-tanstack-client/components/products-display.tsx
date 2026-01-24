'use client'

import { useProducts } from '@/hooks/use-products'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProductsDisplayProps {
  delay?: number
}

/**
 * Products Display using useSuspenseQuery
 *
 * Note: No isLoading or error handling needed!
 * - Suspense boundary handles loading state
 * - Error boundary handles errors
 * - data is never undefined (TypeScript knows this)
 */
export default function ProductsDisplay({ delay }: ProductsDisplayProps) {
  // useSuspenseQuery returns data that's NEVER undefined
  const { data: products } = useProducts(delay)

  return (
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
  )
}
