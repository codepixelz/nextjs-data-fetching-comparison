'use client'

import { useState, useEffect } from 'react'
import { Product, ApiResponse } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Client Component - Interactive product details
 *
 * This component runs in the browser and fetches additional data on user interaction
 */
export function ClientInteractive({ productIds }: { productIds: string[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [productDetails, setProductDetails] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedId) {
      setLoading(true)
      fetch(`/api/products/${selectedId}`)
        .then(res => res.json())
        .then((data: ApiResponse<Product>) => {
          setProductDetails(data.data)
        })
        .finally(() => setLoading(false))
    }
  }, [selectedId])

  return (
    <div className="space-y-4">
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Client-Side Interactivity
            <Badge variant="outline">Client</Badge>
          </CardTitle>
          <CardDescription>
            Click a button to fetch product details on the client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {productIds.slice(0, 6).map((id, index) => (
              <Button
                key={id}
                variant={selectedId === id ? 'default' : 'outline'}
                onClick={() => setSelectedId(id)}
                size="sm"
              >
                Product {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedId && (
        <Card>
          <CardHeader>
            <CardTitle>Product Details (Fetched Client-Side)</CardTitle>
            <CardDescription>This data was loaded after user interaction</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ) : productDetails ? (
              <div>
                <h3 className="text-2xl font-bold mb-2">{productDetails.name}</h3>
                <p className="text-muted-foreground mb-4">{productDetails.category}</p>
                <p className="text-sm mb-4">{productDetails.description}</p>
                <div className="flex gap-4 items-center flex-wrap">
                  <span className="text-3xl font-bold text-primary">
                    ${productDetails.price}
                  </span>
                  <Badge variant={productDetails.stock > 50 ? 'default' : 'secondary'}>
                    {productDetails.stock} in stock
                  </Badge>
                  <Badge variant="outline">
                    Created: {new Date(productDetails.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a product to see details</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
