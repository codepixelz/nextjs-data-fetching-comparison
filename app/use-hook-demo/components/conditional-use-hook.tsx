'use client'

import { use, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
 * Note: With React Compiler (RC) in Next.js 16, manual memoization
 * is not needed - the compiler handles it automatically.
 */
export default function ConditionalUseHook() {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [userId, setUserId] = useState<string>('1')

  // This is ONLY possible with the 'use' hook!
  // Other hooks cannot be called conditionally
  // fetchUser returns cached promise for same ID (no useMemo needed with RC)
  const user = shouldFetch ? use(fetchUser(userId)) : null

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
          <li>The promise cache ensures stability - RC handles memoization</li>
          <li>Enables dynamic data fetching patterns</li>
          <li>Can be used in loops, if statements, or anywhere</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto border">
        <pre>{`// Promise cache ensures stable references
const cache = new Map()

function fetchUser(id) {
  if (cache.has(id)) return cache.get(id)
  const promise = fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
  cache.set(id, promise)
  return promise
}

function Component() {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [userId, setUserId] = useState('1')

  // ✅ Cache ensures same promise - RC handles memoization
  const user = shouldFetch ? use(fetchUser(userId)) : null

  return <div>{user?.name}</div>
}`}</pre>
      </div>

      <div className="p-3 bg-muted rounded border text-xs">
        <strong>Important: Promise Stability</strong>
        <p className="mt-1">
          When using conditional 'use', the promise must be stable across renders.
          Use a module-level cache to return the same promise instance for the same arguments.
          With React Compiler (RC), manual useMemo is not needed.
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
