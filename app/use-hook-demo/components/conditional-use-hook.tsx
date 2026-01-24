'use client'

import { use, cache, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
}

/**
 * Fetch user data - cached
 */
const fetchUser = cache(async (id: string) => {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }

  const data = await response.json()
  return data.data as User
})

/**
 * Conditional 'use' Hook
 *
 * This demonstrates a UNIQUE capability of the 'use' hook:
 * it can be called conditionally!
 *
 * Traditional hooks (useState, useEffect, etc.) CANNOT be called conditionally.
 * This is a major difference and enables new patterns.
 */
export default function ConditionalUseHook() {
  const [shouldFetch, setShouldFetch] = useState(true)
  const [userId, setUserId] = useState<string>('1')

  // This is ONLY possible with the 'use' hook!
  // Other hooks cannot be called conditionally
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
          <li>The promise is only created and unwrapped when shouldFetch is true</li>
          <li>Enables dynamic data fetching patterns</li>
          <li>Can be used in loops, if statements, or anywhere</li>
        </ul>
      </div>

      <div className="bg-muted p-3 rounded text-xs overflow-x-auto border">
        <pre>{`function Component() {
  const [shouldFetch, setShouldFetch] = useState(true)

  // ✅ This works with 'use' hook!
  const user = shouldFetch
    ? use(fetchUser('1'))
    : null

  // ❌ This would ERROR with useState:
  // const [user, setUser] = shouldFetch
  //   ? useState(null)  // ERROR!
  //   : [null, () => {}]

  return <div>{user?.name}</div>
}`}</pre>
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
