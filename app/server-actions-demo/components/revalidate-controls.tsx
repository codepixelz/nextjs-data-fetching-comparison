'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { revalidateByTag, revalidateApproachPath } from '../actions'

/**
 * Revalidate Controls
 *
 * Manual controls to trigger cache revalidation
 */
export default function RevalidateControls() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const handleRevalidateTag = () => {
    startTransition(async () => {
      const result = await revalidateByTag('products')
      setMessage(result.message)
      setTimeout(() => setMessage(null), 3000)
    })
  }

  const handleRevalidatePath = () => {
    startTransition(async () => {
      const result = await revalidateApproachPath('/server-actions-demo')
      setMessage(result.message)
      setTimeout(() => setMessage(null), 3000)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>Manually trigger cache revalidation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button
            onClick={handleRevalidateTag}
            disabled={isPending}
            variant="outline"
            className="w-full"
          >
            {isPending ? 'Revalidating...' : 'Revalidate Tag: "products"'}
          </Button>

          <Button
            onClick={handleRevalidatePath}
            disabled={isPending}
            variant="outline"
            className="w-full"
          >
            {isPending ? 'Revalidating...' : 'Revalidate Path: "/server-actions-demo"'}
          </Button>
        </div>

        {message && (
          <Alert className="bg-muted">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="p-3 bg-muted rounded border text-xs">
          <strong>Understanding the difference:</strong>
          <ul className="list-disc list-inside ml-2 mt-1 space-y-1">
            <li>
              <strong>revalidateTag('products'):</strong> Invalidates all fetch requests
              tagged with 'products' across all routes
            </li>
            <li>
              <strong>revalidatePath('/path'):</strong> Invalidates all cached data for a
              specific route/path
            </li>
          </ul>
        </div>

        <div className="p-3 bg-muted rounded border text-xs">
          <strong>Note:</strong>
          <p className="mt-1">
            These revalidations only affect Next.js Data Cache (server-side). They don't
            trigger re-renders in client components unless the data is refetched.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
