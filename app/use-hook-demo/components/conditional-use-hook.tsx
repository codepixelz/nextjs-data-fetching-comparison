'use client'

import { use, useState, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
}

/**
 * Promise cache to ensure stable promise references across renders.
 * This is necessary because React's cache() only deduplicates within
 * a single request/render tree, not across state changes.
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
      // Remove from cache on error so retry is possible
      promiseCache.delete(id)
      throw error
    })

  promiseCache.set(id, promise)
  return promise
}

/**
 * Conditional 'use' Hook
 *
 * This demonstrates a UNIQUE capability of the 'use' hook:
 * it can be called conditionally!
 *
 * Traditional hooks (useState, useEffect, etc.) CANNOT be called conditionally.
 * This is a major difference and enables new patterns.
 *
 * IMPORTANT: The promise must be stable across renders. We use useMemo
 * to ensure the same promise instance is used when userId hasn't changed.
 */
export default function ConditionalUseHook() {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [userId, setUserId] = useState<string>('1')

  // Create the promise outside the conditional - this ensures stability
  // The promise is memoized based on userId
  const userPromise = useMemo(() => fetchUser(userId), [userId])

  // This is ONLY possible with the 'use' hook!
  // Other hooks cannot be called conditionally
  // The promise is created above, but only READ conditionally
  const user = shouldFetch ? use(userPromise) : null

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setShouldFetch(!shouldFetch)}
          variant={shouldFetch ? 'default' : 'outline'}
          size="sm"
        >
          {shouldFetch ? 'Disable Fetch' : 'Enable Fetch'}
        </Button>
        <Button
          onClick={() => setUserId(userId === '1' ? '2' : '1')}
          variant="outline"
          size="sm"
        >
          Toggle User (Current: {userId})
        </Button>
      </div>

      {shouldFetch && user ? (
        <div className="p-4 bg-muted rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">{user.name}</h3>
            <Badge variant="outline">
              Conditional 'use'
            </Badge>
          </div>
          <p className="text-sm">{user.email}</p>
          <p className="text-xs mt-2">User ID: {user.id}</p>
        </div>
      ) : (
        <div className="p-4 bg-muted rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Fetching is disabled. Click "Enable Fetch" to load user data.
          </p>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        <strong>What makes this special:</strong>
        <ul className="list-disc list-inside mt-1 ml-2">
          <li>The 'use' hook is called CONDITIONALLY (inside a ternary operator)</li>
          <li>This is NOT possible with useState, useEffect, or other hooks</li>
          <li>The promise is created with useMemo, but only READ when shouldFetch is true</li>
          <li>Enables dynamic data fetching patterns</li>
          <li>Can be used in loops, if statements, or anywhere</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto border">
        <pre>{`function Component() {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [userId, setUserId] = useState('1')

  // ✅ Create promise outside the conditional (stable reference)
  const userPromise = useMemo(() => fetchUser(userId), [userId])

  // ✅ Read the promise conditionally with 'use'
  const user = shouldFetch ? use(userPromise) : null

  // ❌ DON'T create promise inside conditional:
  // const user = shouldFetch ? use(fetchUser('1')) : null
  // This creates a new promise each render → infinite Suspense!

  return <div>{user?.name}</div>
}`}</pre>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Important: Promise Stability</strong>
        <p className="mt-1">
          When using conditional 'use', the promise must be stable across renders.
          Create the promise with useMemo or a cache, then read it conditionally.
          Creating a new promise inside the conditional causes infinite Suspense loops.
        </p>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Rules of Hooks Exception:</strong>
        <p className="mt-1">
          The famous "Rules of Hooks" state that hooks cannot be called conditionally.
          The 'use' hook is an exception to this rule! It can be called in conditionals,
          loops, and after early returns. This makes it fundamentally different from other hooks.
        </p>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Use Cases for Conditional 'use':</strong>
        <ul className="list-disc list-inside mt-1 ml-2">
          <li>Fetch data only when user is authenticated</li>
          <li>Load different data based on feature flags</li>
          <li>Conditionally read from different promises</li>
          <li>Dynamic data loading in list items</li>
        </ul>
      </div>
    </div>
  )
}
