'use client'

import { useActionState } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { addProduct } from '../actions'

/**
 * Add Product Form
 *
 * Demonstrates using Server Actions with forms and useActionState
 */
export default function AddProductForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      return await addProduct(formData)
    },
    null
  )

  return (
    <Card>
      <CardHeader>
        <CardDescription>Submit a form using Server Actions</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter product name"
              required
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
              disabled={isPending}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Adding...' : 'Add Product'}
          </Button>

          {state?.success && (
            <Alert className="bg-muted">
              <AlertDescription>
                {state.message}
              </AlertDescription>
            </Alert>
          )}
        </form>

        <div className="mt-4 p-3 bg-muted rounded border text-xs">
          <strong>What happens:</strong>
          <ol className="list-decimal list-inside ml-2 mt-1 space-y-1">
            <li>Form submits to server action</li>
            <li>Server saves data (simulated)</li>
            <li>Server calls <code>revalidateTag('products')</code></li>
            <li>All caches tagged 'products' are invalidated</li>
            <li>Product list below re-fetches fresh data</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
