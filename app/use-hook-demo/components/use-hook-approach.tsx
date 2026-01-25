'use client'

import { use } from 'react'
import { Badge } from '@/components/ui/badge'

interface User {
  id: string
  name: string
  email: string
}

/**
 * Promise cache to ensure stable promise references across renders.
 * The cache returns the same promise instance for the same ID.
 */
const promiseCache = new Map<string, Promise<User>>()

function fetchUser(id: string): Promise<User> {
  // Guard against SSR - relative URLs don't work on server
  if (typeof window === 'undefined') {
    return Promise.resolve({ id, name: '', email: '' })
  }

  const cached = promiseCache.get(id)
  if (cached) return cached

  const promise = fetch(`/api/users/${id}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return response.json()
    })
    .then((data) => data.data as User)
    .catch((error) => {
      promiseCache.delete(id)
      throw error
    })

  promiseCache.set(id, promise)
  return promise
}

/**
 * React 19 'use' Hook Approach
 *
 * This demonstrates the new 'use' hook for unwrapping promises.
 * Much simpler than the traditional approach!
 *
 * Note: With React Compiler (RC) in Next.js 16, manual memoization
 * is not needed - the compiler handles it automatically.
 */
export default function UseHookApproach() {
  // fetchUser returns cached promise for same ID (no useMemo needed with RC)
  const user = use(fetchUser('2'))

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{user.name}</h3>
          <Badge variant="outline">
            React 19 'use'
          </Badge>
        </div>
        <p className="text-sm">{user.email}</p>
      </div>

      <div className="text-xs text-muted-foreground">
        <strong>Code characteristics:</strong>
        <ul className="list-disc list-inside mt-1 ml-2">
          <li>No useState or useEffect needed</li>
          <li>No manual loading state management</li>
          <li>Suspense handles loading automatically</li>
          <li>Error boundary catches errors</li>
          <li>Much less boilerplate</li>
          <li>Component suspends while promise is pending</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto border">
        <pre>{`// Promise cache for stable references
const cache = new Map()

function fetchUser(id) {
  if (cache.has(id)) return cache.get(id)
  const promise = fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
  cache.set(id, promise)
  return promise
}

function Component() {
  // Cache ensures same promise instance - RC handles memoization
  const user = use(fetchUser('2'))
  return <div>{user.name}</div>
}

// In parent:
<Suspense fallback={<Skeleton />}>
  <Component />
</Suspense>`}</pre>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Key Insight:</strong>
        <p className="mt-1">
          The 'use' hook automatically suspends the component while the promise is pending.
          Suspense catches the suspension and shows the fallback. When the promise resolves,
          React re-renders with the data. Much simpler!
        </p>
      </div>
    </div>
  )
}
