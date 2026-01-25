'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface User {
  id: string
  name: string
  email: string
}

/**
 * Traditional Approach: useEffect + useState
 *
 * This is the old way of handling async data in React.
 * Requires manual state management for loading, error, and data.
 */
export default function TraditionalApproach() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/users/1')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch user')
        return res.json()
      })
      .then(data => {
        if (!cancelled) {
          setUser(data.data)
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{user?.name}</h3>
          <Badge variant="outline">Traditional</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <div className="text-xs text-muted-foreground">
        <strong>Code characteristics:</strong>
        <ul className="list-disc list-inside mt-1 ml-2">
          <li>Manual state management (useState for loading, error, data)</li>
          <li>useEffect for side effects</li>
          <li>Cleanup function to prevent memory leaks</li>
          <li>Conditional rendering for loading and error states</li>
          <li>More boilerplate code</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto">
        <pre>{`const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetch('/api/users/1')
    .then(res => res.json())
    .then(setUser)
    .catch(setError)
    .finally(() => setLoading(false))
}, [])

if (loading) return <Skeleton />
if (error) return <Error />
return <div>{user.name}</div>`}</pre>
      </div>
    </div>
  )
}
